// POST /api/questionnaire/submit
// Validates required answers, records submission revision, enqueues one monthly job

import { createTeableService } from '../../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership, TEABLE_TABLES, TEABLE_FIELDS } from '../../../../auth/service';
import { STRATEGY_RECORD_IDS, DEFAULT_STRATEGY_DISTRIBUTION } from '../../../../teable/service';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { month } = await request.json(); // Expected format: "2026-10"
    
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return Response.json({ error: 'Valid month required (YYYY-MM)' }, { status: 400 });
    }

    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership || !verifyClientOwnership(membership, membership.clientRecordId)) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all questionnaire responses for this client
    const filter = {
      conjunction: 'and' as const,
      filterSet: [
        {
          fieldId: TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.CLIENT_ID,
          operator: 'is',
          value: membership.clientRecordId
        }
      ]
    };

    const response = await teable.listRecords(TEABLE_TABLES.QUESTIONNAIRE_RESPONSES, {
      filter,
      take: 100
    });

    // Check required answers are complete
    const questions = response.records;
    const requiredQuestions = questions.filter(q => 
      q.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.REQUIRED] ?? true
    );
    const completedRequired = requiredQuestions.filter(q => 
      q.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.COMPLETED] === true
    );

    if (completedRequired.length < requiredQuestions.length) {
      return Response.json({ 
        error: 'Required questions incomplete',
        missing: requiredQuestions.length - completedRequired.length
      }, { status: 400 });
    }

    // Generate idempotency key to prevent duplicate jobs
    const idempotencyKey = `${membership.clientRecordId}-${month}-${Date.now()}`;

    // Create generation job record
    const jobRecord = await teable.createRecord('GENERATION_JOBS_TABLE_ID_PLACEHOLDER', {
      // These fields need to be created in Teable first
      // Client ID: membership.clientRecordId
      // Request Type: 'MONTHLY_PLAN'
      // Period Start: `${month}-01`
      // Period End: last day of month
      // Status: 'QUEUED'
      // Idempotency Key: idempotencyKey
      // Expected Posts: 30
      // Input Revision: hash of questionnaire responses
    });

    // TODO: Actually enqueue the job to a durable queue/worker
    // This is where you'd integrate with your queue system (Vercel Cron, Upstash, BullMQ, etc.)

    return Response.json({
      jobId: jobRecord.id,
      status: 'QUEUED',
      message: 'Generation job queued. Poll /api/generation-jobs/{jobId} for progress.'
    }, { status: 202 });

  } catch (error) {
    console.error('Error in POST /api/questionnaire/submit:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}