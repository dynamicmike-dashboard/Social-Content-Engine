// POST /api/auth/login
// Login user with email and password

import { createTeableService } from '../../../../teable/service';
import { verifyPassword, generateSecureToken, hashPassword } from '../../../lib/auth/password';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
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
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required', errorCode: 'VALIDATION_ERROR' },
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

    if (users.records.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const userRecord = users.records[0];
    const user = userRecord.fields;

    // Check if user is verified
    if (user.status !== 'ACTIVE') {
      return Response.json(
        { success: false, error: 'Please verify your email before logging in', errorCode: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    // Verify password
    const { verifyPassword } = await import('../../../lib/auth/password');
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return Response.json(
        { success: false, error: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Generate session token
    const { generateSecureToken, hashPassword } = await import('../../../lib/auth/password');
    const sessionToken = generateSecureToken(32);
    const sessionTokenHash = await hashPassword(sessionToken);
    
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    // Create session record
    await teable.createRecord('User Sessions', {
      user_id: userRecord.id,
      session_token_hash: sessionTokenHash,
      expires_at: expiresAt,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    // Set session cookie
    const cookie = `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`;

    return Response.json(
      {
        success: true,
        user: {
          id: userRecord.id,
          email: user.email,
          name: user.name,
          emailVerified: true,
        }
      },
      {
        headers: {
          'Set-Cookie': cookie,
        }
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, error: 'Login failed. Please try again.', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}