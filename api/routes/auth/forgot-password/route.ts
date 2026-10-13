// POST /api/auth/forgot-password
// Request password reset

import { createTeableService } from '../../../../teable/service';
import { generateSecureToken } from '../../../../lib/auth/password';

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ForgotPasswordRequest = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json(
        { success: false, error: 'Email is required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const teable = createTeableService();

    // Find user by email
    const users = await teable.listRecords('Users', {
      filter: {
        conjunction: 'and',
        filterSet: [
          { fieldId: 'email', operator: 'is', value: email.toLowerCase() }
        ]
      }
    });

    // Always return success to prevent email enumeration
    if (users.records.length === 0) {
      return Response.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
      });
    }

    const userRecord = users.records[0];

    // Generate reset token
    const { generateSecureToken } = await import('../../../../lib/auth/password');
    const resetToken = generateSecureToken(32);
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Save reset token
    await teable.updateRecord('Users', userRecord.id, {
      password_reset_token: resetToken,
      password_reset_expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    // TODO: Send reset email
    // await sendPasswordResetEmail(email, resetToken);

    return Response.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return Response.json(
      { success: false, error: 'Request failed. Please try again.', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}