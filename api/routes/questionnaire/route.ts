// GET /api/questionnaire
// Returns current client's numbered questions and saved answers

import { createTeableService } from '../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership, TEABLE_TABLES, TEABLE_FIELDS } from '../../../auth/service';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership || !verifyClientOwnership(membership, membership.clientRecordId)) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get questionnaire responses for this client
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
      take: 100,
      sort: [{ fieldId: TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.QUESTION_NUMBER, order: 'asc' }]
    });

    const questions = response.records.map(record => ({
      id: record.id,
      questionNumber: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.QUESTION_NUMBER],
      questionCategory: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.QUESTION_CATEGORY],
      question: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.QUESTION],
      response: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.RESPONSE] || '',
      required: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.REQUIRED] ?? true,
      aiNotes: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.AI_NOTES],
      completed: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.COMPLETED] ?? false,
      createdAt: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.CREATED_AT],
      updatedAt: record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.UPDATED_AT]
    }));

    // Calculate progress
    const total = questions.length;
    const completed = questions.filter(q => q.completed).length;
    const requiredTotal = questions.filter(q => q.required).length;
    const requiredCompleted = questions.filter(q => q.required && q.completed).length;

    return Response.json({
      questions,
      progress: { completed, total, requiredCompleted, requiredTotal },
      canSubmit: requiredCompleted === requiredTotal && requiredTotal > 0
    });

  } catch (error) {
    console.error('Error in GET /api/questionnaire:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/questionnaire/{responseId}
// Saves one answer after ownership validation

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ responseId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { responseId } = await params;
    const { response } = await request.json();

    if (typeof response !== 'string') {
      return Response.json({ error: 'Response must be a string' }, { status: 400 });
    }

    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the questionnaire response record
    const record = await teable.getRecord(TEABLE_TABLES.QUESTIONNAIRE_RESPONSES, responseId);
    
    // Verify ownership
    const responseClientId = record.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.CLIENT_ID];
    if (!responseClientId || 
        (Array.isArray(responseClientId) ? responseClientId[0]?.id : responseClientId) !== membership.clientRecordId) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update the response
    const updated = await teable.updateRecord(TEABLE_TABLES.QUESTIONNAIRE_RESPONSES, responseId, {
      [TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.RESPONSE]: response
    });

    return Response.json({
      id: updated.id,
      response: updated.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.RESPONSE],
      completed: updated.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.COMPLETED],
      updatedAt: updated.fields[TEABLE_FIELDS.QUESTIONNAIRE_RESPONSES.UPDATED_AT]
    });

  } catch (error) {
    console.error('Error in PATCH /api/questionnaire:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}