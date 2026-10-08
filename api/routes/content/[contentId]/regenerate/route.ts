// POST /api/content/{contentId}/regenerate
// Save revision request and enqueue targeted job

import { createTeableService } from '../../../../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership, TEABLE_TABLES, TEABLE_FIELDS } from '../../../../../../auth/service';

const VALID_TRANSITIONS_TO_REGENERATE = ['CLIENT_REVIEW', 'CHANGES_REQUESTED', 'REJECTED'];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { contentId } = await params;
    const { revisionRequest } = await request.json();
    
    if (!revisionRequest || typeof revisionRequest !== 'string') {
      return Response.json({ error: 'Revision request required' }, { status: 400 });
    }

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

    const currentStatus = record.fields[TEABLE_FIELDS.CONTENT_CALENDAR.STATUS] || 'DRAFT';

    // Validate transition
    if (!VALID_TRANSITIONS_TO_REGENERATE.includes(currentStatus)) {
      return Response.json({ 
        error: `Cannot regenerate content in ${currentStatus} status. Must be in CLIENT_REVIEW, CHANGES_REQUESTED, or REJECTED.`
      }, { status: 400 });
    }

    // Update status to GENERATED (will be regenerated) and save revision request
    const now = new Date().toISOString();
    const updated = await teable.updateRecord(TEABLE_TABLES.CONTENT_CALENDAR, contentId, {
      [TEABLE_FIELDS.CONTENT_CALENDAR.STATUS]: 'GENERATED',
      [TEABLE_FIELDS.CONTENT_CALENDAR.AI_REVISION_REQUEST]: revisionRequest,
      [TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_NOTES]: revisionRequest
    });

    // Record approval activity
    await teable.createRecord(TEABLE_TABLES.APPROVAL_ACTIVITY, {
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.CONTENT_ID]: contentId,
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.ACTION]: 'REGENERATED',
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.PREVIOUS_STATUS]: currentStatus,
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.NEW_STATUS]: 'GENERATED',
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.CLIENT_COMMENT]: `Regeneration requested: ${revisionRequest}`,
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.TIMESTAMP]: now
    });

    // TODO: Enqueue regeneration job to durable queue
    // This would create a Generation Job with Request Type = 'POST_REGENERATION'
    // and Content ID = contentId

    return Response.json({
      post: {
        id: updated.id,
        status: updated.fields[TEABLE_FIELDS.CONTENT_CALENDAR.STATUS],
        revisionRequest: updated.fields[TEABLE_FIELDS.CONTENT_CALENDAR.AI_REVISION_REQUEST]
      },
      message: 'Regeneration requested. Job will be queued for processing.'
    }, { status: 202 });

  } catch (error) {
    console.error('Error in POST /api/content/[contentId]/regenerate:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}