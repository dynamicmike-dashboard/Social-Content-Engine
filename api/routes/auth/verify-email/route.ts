// POST /api/auth/verify-email
// Verify email with token

import { createTeableService } from '../../../../teable/service';

interface VerifyEmailRequest {
  token: string;
}

interface VerifyEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: VerifyEmailRequest = await request.json();
    const { token } = body;

    if (!token) {
      return Response.json(
        { success: false, error: 'Verification token is required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const teable = createTeableService();

    // Find user with this verification token
    const users = await teable.listRecords('Users', {
      filter: {
        conjunction: 'and',
        filterSet: [
          { fieldId: 'email_verification_token', operator: 'is', value: token },
          { fieldId: 'email_verification_expires', operator: 'isAfter', value: new Date().toISOString() }
        ]
      }
    });

    if (users.records.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid or expired verification token', errorCode: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    const userRecord = users.records[0];

    // Update user to verified
    await teable.updateRecord('Users', userRecord.id, {
      status: 'ACTIVE',
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
    });

    return Response.json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return Response.json(
      { success: false, error: 'Verification failed. Please try again.', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}