// POST /api/content/{contentId}/approve
// Allowed state transition, approval timestamp, audit event

import { createTeableService } from '../../../../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership, TEABLE_TABLES, TEABLE_FIELDS } from '../../../../../../auth/service';

const VALID_TRANSITIONS_TO_APPROVE = ['CLIENT_REVIEW', 'CHANGES_REQUESTED'];

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
    if (!VALID_TRANSITIONS_TO_APPROVE.includes(currentStatus)) {
      return Response.json({ 
        error: `Cannot approve content in ${currentStatus} status. Must be in CLIENT_REVIEW or CHANGES_REQUESTED.`
      }, { status: 400 });
    }

    // Update status to APPROVED
    const now = new Date().toISOString();
    const updated = await teable.updateRecord(TEABLE_TABLES.CONTENT_CALENDAR, contentId, {
      [TEABLE_FIELDS.CONTENT_CALENDAR.STATUS]: 'APPROVED',
      [TEABLE_FIELDS.CONTENT_CALENDAR.APPROVED_AT]: now
    });

    // Record approval activity
    await teable.createRecord(TEABLE_TABLES.APPROVAL_ACTIVITY, {
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.CONTENT_ID]: contentId,
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.ACTION]: 'APPROVED',
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.PREVIOUS_STATUS]: currentStatus,
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.NEW_STATUS]: 'APPROVED',
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.CLIENT_COMMENT]: 'Approved by client',
      [TEABLE_FIELDS.APPROVAL_ACTIVITY.TIMESTAMP]: now
    });

    return Response.json({
      post: {
        id: updated.id,
        status: updated.fields[TEABLE_FIELDS.CONTENT_CALENDAR.STATUS],
        approvedAt: updated.fields[TEABLE_FIELDS.CONTENT_CALENDAR.APPROVED_AT]
      }
    });

  } catch (error) {
    console.error('Error in POST /api/content/[contentId]/approve:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}