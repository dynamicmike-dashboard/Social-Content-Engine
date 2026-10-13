// POST /api/auth/signup
// Alternative endpoint for registration (alias for /api/auth/register)

import { createTeableService } from '../../../../teable/service';
import { hashPassword, generateSecureToken } from '../../../lib/auth/password';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface SignupResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
  error?: string;
  errorCode?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return Response.json(
        { success: false, error: 'Email, password, and name are required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const teableApiToken = process.env.TEABLE_API_TOKEN;
    if (!teableApiToken) {
      return Response.json(
        { success: false, error: 'Authentication service not configured', errorCode: 'SERVICE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const teable = createTeableService();
    
    const existingUsers = await teable.listRecords('Users', {
      filter: {
        conjunction: 'and',
        filterSet: [
          { fieldId: 'email', operator: 'is', value: email.toLowerCase() }
        ]
      }
    });

    if (existingUsers.records.length > 0) {
      return Response.json(
        { success: false, error: 'An account with this email already exists', errorCode: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    const { hashPassword, generateSecureToken } = await import('../../../lib/auth/password');
    const passwordHash = await hashPassword(password);
    const verificationToken = generateSecureToken(32);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const userRecord = await teable.createRecord('Users', {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: name.trim(),
      status: 'PENDING_VERIFICATION',
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
    });

    // TODO: Send verification email

    return Response.json({
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.fields.email,
        name: userRecord.fields.name,
        emailVerified: false,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return Response.json(
      { success: false, error: 'Registration failed. Please try again.', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}