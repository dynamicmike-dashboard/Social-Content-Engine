// POST /api/auth/register
// Register a new user with email and password

import { createTeableService } from '../../../../teable/service';
import { hashPassword, generateSecureToken } from '../../../lib/auth/password';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
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
    const body: RegisterRequest = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return Response.json(
        { success: false, error: 'Email, password, and name are required', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Check if Teable is configured
    const teableApiToken = process.env.TEABLE_API_TOKEN;
    if (!teableApiToken) {
      console.error('TEABLE_API_TOKEN not configured');
      return Response.json(
        { success: false, error: 'Authentication service not configured', errorCode: 'SERVICE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const teable = createTeableService();
    
    // Check if user already exists
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

    // Hash password
    const { hashPassword } = await import('../../../lib/auth/password');
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const { generateSecureToken } = await import('../../../lib/auth/password');
    const verificationToken = generateSecureToken(32);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Create user record
    const userRecord = await teable.createRecord('Users', {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: name.trim(),
      status: 'PENDING_VERIFICATION',
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
    });

    // TODO: Send verification email here
    // await sendVerificationEmail(email, verificationToken);

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
    console.error('Registration error:', error);
    return Response.json(
      { success: false, error: 'Registration failed. Please try again.', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}