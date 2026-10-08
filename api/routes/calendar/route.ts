// GET /api/calendar?month=YYYY-MM
// Returns server-derived client calendar for bounded date range

import { createTeableService } from '../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership, TEABLE_TABLES, TEABLE_FIELDS } from '../../../auth/service';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return Response.json({ error: 'Valid month required (YYYY-MM)' }, { status: 400 });
    }

    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership || !verifyClientOwnership(membership, membership.clientRecordId)) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build date range for the month
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

    // Build filter for client + date range
    const filter = {
      conjunction: 'and' as const,
      filterSet: [
        {
          fieldId: TEABLE_FIELDS.CONTENT_CALENDAR.CLIENT_ID,
          operator: 'is',
          value: membership.clientRecordId
        },
        {
          fieldId: TEABLE_FIELDS.CONTENT_CALENDAR.DATE,
          operator: 'is',
          value: {
            mode: 'dateRange',
            exactDate: startDate.toISOString(),
            exactDateEnd: endDate.toISOString(),
            timeZone: 'UTC'
          }
        }
      ]
    };

    const response = await teable.listRecords(TEABLE_TABLES.CONTENT_CALENDAR, {
      filter,
      take: 100,
      sort: [
        { fieldId: TEABLE_FIELDS.CONTENT_CALENDAR.DATE, order: 'asc' },
        { fieldId: TEABLE_FIELDS.CONTENT_CALENDAR.SCHEDULED_TIME, order: 'asc' }
      ]
    });

    const posts = response.records.map(record => mapContentRecord(record));

    return Response.json({
      month,
      posts,
      total: posts.length
    });

  } catch (error) {
    console.error('Error in GET /api/calendar:', error);
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