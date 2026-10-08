// GET /api/content/{contentId}
// Returns post and authorised asset/history data

import { createTeableService } from '../../../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership, TEABLE_TABLES, TEABLE_FIELDS } from '../../../../../auth/service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { contentId } = await params;
    
    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the content record
    const record = await teable.getRecord(TEABLE_TABLES.CONTENT_CALENDAR, contentId);
    
    // Verify ownership
    const contentClientId = record.fields[TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_ID];
    if (!contentClientId || 
        (Array.isArray(contentClientId) ? contentClientId[0]?.id : contentClientId) !== membership.clientRecordId) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const post = mapContentRecord(record);

    // Get assets for this post
    const assetsFilter = {
      conjunction: 'and' as const,
      filterSet: [
        {
          fieldId: TEABLE_FIELDS.CONTENT_ASSETS.CONTENT_ID,
          operator: 'is',
          value: contentId
        }
      ]
    };

    const assetsResponse = await teable.listRecords(TEABLE_TABLES.CONTENT_ASSETS, {
      filter: assetsFilter,
      take: 50
    });

    const assets = assetsResponse.records.map(asset => ({
      id: asset.id,
      contentId: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.CONTENT_ID],
      assetUrl: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.ASSET_URL],
      assetType: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.ASSET_TYPE],
      thumbnailUrl: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.THUMBNAIL_URL],
      altText: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.ALT_TEXT],
      aiPrompt: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.AI_PROMPT],
      approved: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.APPROVED] ?? false,
      createdAt: asset.fields[TEABLE_FIELDS.CONTENT_ASSETS.CREATED_AT]
    }));

    // Get approval history
    const historyFilter = {
      conjunction: 'and' as const,
      filterSet: [
        {
          fieldId: TEABLE_FIELDS.APPROVAL_ACTIVITY.CONTENT_ID,
          operator: 'is',
          value: contentId
        }
      ]
    };

    const historyResponse = await teable.listRecords(TEABLE_TABLES.APPROVAL_ACTIVITY, {
      filter: historyFilter,
      take: 50,
      sort: [{ fieldId: TEABLE_FIELDS.APPROVAL_ACTIVITY.TIMESTAMP, order: 'desc' }]
    });

    const history = historyResponse.records.map(activity => ({
      id: activity.id,
      action: activity.fields[TEABLE_FIELDS.APPROVAL_ACTIVITY.ACTION],
      previousStatus: activity.fields[TEABLE_FIELDS.APPROVAL_ACTIVITY.PREVIOUS_STATUS],
      newStatus: activity.fields[TEABLE_FIELDS.APPROVAL_ACTIVITY.NEW_STATUS],
      clientComment: activity.fields[TEABLE_FIELDS.APPROVAL_ACTIVITY.CLIENT_COMMENT],
      timestamp: activity.fields[TEABLE_FIELDS.APPROVAL_ACTIVITY.TIMESTAMP],
      user: activity.fields[TEABLE_FIELDS.APPROVAL_ACTIVITY.USER]
    }));

    return Response.json({
      post,
      assets,
      history
    });

  } catch (error) {
    console.error('Error in GET /api/content/[contentId]:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/content/{contentId}
// Allows allowlisted edits; invalidates old approval

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { contentId } = await params;
    const updates = await request.json();

    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the content record to verify ownership and current status
    const record = await teable.getRecord(TEABLE_TABLES.CONTENT_CALENDAR, contentId);
    
    const contentClientId = record.fields[TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_ID];
    if (!contentClientId || 
        (Array.isArray(contentClientId) ? contentClientId[0]?.id : contentClientId) !== membership.clientRecordId) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const currentStatus = record.fields[TEABLE_FIELDS.CONTENT_CALENDAR.STATUS] || 'DRAFT';

    // Only allow edits in certain statuses
    const editableStatuses = ['DRAFT', 'GENERATED', 'CLIENT_REVIEW', 'CHANGES_REQUESTED'];
    if (!editableStatuses.includes(currentStatus)) {
      return Response.json({ 
        error: `Cannot edit content in ${currentStatus} status` 
      }, { status: 400 });
    }

    // Allowlisted fields that client can edit
    const allowedFields = [
      TEABLE_FIELDS.CONTENT_CALENDAR.HOOK,
      TEABLE_FIELDS.CONTENT_CALENDAR.CAPTION,
      TEABLE_FIELDS.CONTENT_CALENDAR.SHORT_CAPTION,
      TEABLE_FIELDS.CONTENT_CALENDAR.CTA,
      TEABLE_FIELDS.CONTENT_CALENDAR.HASHTAGS,
      TEABLE_FIELDS.CONTENT_CALENDAR.IMAGE_PROMPT,
      TEABLE_FIELDS.CONTENT_CALENDAR.VIDEO_CONCEPT,
      TEABLE_FIELDS.CONTENT_CALENDAR.VIDEO_SCRIPT,
      TEABLE_FIELDS.CONTENT_CALENDAR.FIRST_COMMENT,
      TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_NOTES
    ];

    const fields: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      const fieldMap: Record<string, string> = {
        hook: TEABLE_FIELDS.CONTENT_CALENDAR.HOOK,
        caption: TEABLE_FIELDS.CONTENT_CALENDAR.CAPTION,
        shortCaption: TEABLE_FIELDS.CONTENT_CALENDAR.SHORT_CAPTION,
        cta: TEABLE_FIELDS.CONTENT_CALENDAR.CTA,
        hashtags: TEABLE_FIELDS.CONTENT_CALENDAR.HASHTAGS,
        imagePrompt: TEABLE_FIELDS.CONTENT_CALENDAR.IMAGE_PROMPT,
        videoConcept: TEABLE_FIELDS.CONTENT_CALENDAR.VIDEO_CONCEPT,
        videoScript: TEABLE_FIELDS.CONTENT_CALENDAR.VIDEO_SCRIPT,
        firstComment: TEABLE_FIELDS.CONTENT_CALENDAR.FIRST_COMMENT,
        clientNotes: TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_NOTES
      };
      
      if (fieldMap[key] && allowedFields.includes(fieldMap[key])) {
        fields[fieldMap[key]] = value;
      }
    }

    if (Object.keys(fields).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // If content was approved, reset to CHANGES_REQUESTED
    let newStatus = currentStatus;
    if (currentStatus === 'APPROVED') {
      newStatus = 'CHANGES_REQUESTED';
      fields[TEABLE_FIELDS.CONTENT_CALENDAR.STATUS] = newStatus;
      fields[TEABLE_FIELDS.CONTENT_CALENDAR.AI_REVISION_REQUEST] = 'Client edited approved content';
    }

    const updated = await teable.updateRecord(TEABLE_TABLES.CONTENT_CALENDAR, contentId, fields);

    // Record approval activity
    if (newStatus !== currentStatus) {
      await teable.createRecord(TEABLE_TABLES.APPROVAL_ACTIVITY, {
        [TEABLE_FIELDS.APPROVAL_ACTIVITY.CONTENT_ID]: contentId,
        [TEABLE_FIELDS.APPROVAL_ACTIVITY.ACTION]: 'EDITED',
        [TEABLE_FIELDS.APPROVAL_ACTIVITY.PREVIOUS_STATUS]: currentStatus,
        [TEABLE_FIELDS.APPROVAL_ACTIVITY.NEW_STATUS]: newStatus,
        [TEABLE_FIELDS.APPROVAL_ACTIVITY.CLIENT_COMMENT]: 'Client edited content',
        [TEABLE_FIELDS.APPROVAL_ACTIVITY.TIMESTAMP]: new Date().toISOString()
      });
    }

    return Response.json({
      post: mapContentRecord(updated)
    });

  } catch (error) {
    console.error('Error in PATCH /api/content/[contentId]:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapContentRecord(record: any) {
  const fields = record.fields;
  return {
    id: record.id,
    clientId: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_ID],
    date: fields[TEABLE_FIELDS.CONTENT_CALENDAR.DATE],
    scheduledTime: fields[TEABLE_FIELDS.CONTENT_CALENDAR.SCHEDULED_TIME],
    platform: fields[TEABLE_FIELDS.CONTENT_CALENDAR.PLATFORM],
    strategyId: fields[TEABLE_FIELDS.CONTENT_CALENDAR.STRATEGY_ID],
    strategyName: fields[TEABLE_FIELDS.CONTENT_CALENDAR.STRATEGY_NAME],
    strategyColor: fields[TEABLE_FIELDS.CONTENT_CALENDAR.STRATEGY_COLOUR],
    format: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CONTENT_FORMAT],
    topic: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CONTENT_TOPIC],
    objective: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CONTENT_OBJECTIVE],
    hook: fields[TEABLE_FIELDS.CONTENT_CALENDAR.HOOK],
    caption: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CAPTION],
    shortCaption: fields[TEABLE_FIELDS.CONTENT_CALENDAR.SHORT_CAPTION],
    cta: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CTA],
    hashtags: fields[TEABLE_FIELDS.CONTENT_CALENDAR.HASHTAGS],
    imagePrompt: fields[TEABLE_FIELDS.CONTENT_CALENDAR.IMAGE_PROMPT],
    imageUrl: fields[TEABLE_FIELDS.CONTENT_CALENDAR.IMAGE_URL],
    videoConcept: fields[TEABLE_FIELDS.CONTENT_CALENDAR.VIDEO_CONCEPT],
    videoScript: fields[TEABLE_FIELDS.CONTENT_CALENDAR.VIDEO_SCRIPT],
    firstComment: fields[TEABLE_FIELDS.CONTENT_CALENDAR.FIRST_COMMENT],
    aiInstructions: fields[TEABLE_FIELDS.CONTENT_CALENDAR.AI_INSTRUCTIONS],
    status: fields[TEABLE_FIELDS.CONTENT_CALENDAR.STATUS] || 'DRAFT',
    clientNotes: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_NOTES],
    revisionRequest: fields[TEABLE_FIELDS.CONTENT_CALENDAR.AI_REVISION_REQUEST],
    approvedAt: fields[TEABLE_FIELDS.CONTENT_CALENDAR.APPROVED_AT],
    publishedAt: fields[TEABLE_FIELDS.CONTENT_CALENDAR.PUBLISHED_AT],
    externalPostId: fields[TEABLE_FIELDS.CONTENT_CALENDAR.EXTERNAL_POST_ID],
    createdAt: fields[TEABLE_FIELDS.CONTENT_CALENDAR.CREATED_AT],
    updatedAt: fields[TEABLE_FIELDS.CONTENT_CALENDAR.UPDATED_AT]
  };
}