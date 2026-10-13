// POST /api/auth/reset-password
// Reset password with token

import { createTeableService } from '../../../../teable/service';
import { hashPassword } from '../../../../lib/auth/password';

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ResetPasswordRequest = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return Response.json(
        { success: false, error: 'Token and password are required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const teable = createTeableService();

    // Find user with this reset token
    const users = await teable.listRecords('Users', {
      filter: {
        conjunction: 'and',
        filterSet: [
          { fieldId: 'password_reset_token', operator: 'is', value: token },
          { fieldId: 'password_reset_expires', operator: 'isAfter', value: new Date().toISOString() }
        ]
      }
    });

    if (users.records.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid or expired reset token', errorCode: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    const userRecord = users.records[0];

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password and clear reset token
    await teable.updateRecord('Users', userRecord.id, {
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expires: null,
    });

    // Invalidate all existing sessions for this user
    // (optional - for security, invalidate all sessions on password reset)
    // await invalidateUserSessions(userRecord.id);

    return Response.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return Response.json(
      { success: false, error: 'Password reset failed. Please try again.', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}