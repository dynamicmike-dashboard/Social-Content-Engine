// GET /api/auth/me
// Get current authenticated user

import { createTeableService } from '../../../../teable/service';
import { hashPassword } from '../../../lib/auth/password';

interface MeResponse {
  success: boolean;
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
  membership?: {
    id: string;
    clientId: string;
    clientRecordId: string;
    clientName: string;
    role: 'CLIENT' | 'AGENCY_ADMIN';
    status: 'INVITED' | 'ACTIVE' | 'REVOKED';
  };
  profile?: {
    id: string;
    recordId: string;
    businessName: string;
    contactName: string;
    email: string;
    servicePackage: string;
    timeZone: string;
    contentApprovalRequired: boolean;
  };
  capabilities?: Record<string, boolean>;
  error?: string;
  errorCode?: string;
}

export async function GET(request: Request): Promise<Response> {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      return Response.json(
        { success: true, authenticated: false, message: 'Not authenticated' },
        { status: 200 }
      );
    }

    const cookies = cookieHeader.split(';').map(c => c.trim());
    let sessionToken: string | null = null;
    
    for (const cookie of cookies) {
      if (cookie.startsWith('session=')) {
        sessionToken = cookie.split('=')[1];
        break;
      }
    }

    if (!sessionToken) {
      return Response.json(
        { success: true, authenticated: false, message: 'No session found' },
        { status: 200 }
      );
    }

    const teable = createTeableService();
    const { hashPassword } = await import('../../../lib/auth/password');
    const sessionTokenHash = await hashPassword(sessionToken);

    // Find session
    const sessions = await teable.listRecords('User Sessions', {
      filter: {
        conjunction: 'and',
        filterSet: [
          { fieldId: 'session_token_hash', operator: 'is', value: sessionTokenHash },
          { fieldId: 'expires_at', operator: 'isAfter', value: new Date().toISOString() }
        ]
      }
    });

    if (sessions.records.length === 0) {
      return Response.json(
        { success: true, authenticated: false, message: 'Session expired or invalid' },
        { status: 200 }
      );
    }

    const sessionRecord = sessions.records[0];
    const userId = sessionRecord.fields.user_id;

    // Get user
    const userRecord = await teable.getRecord('Users', userId);
    const user = userRecord.fields;

    if (user.status !== 'ACTIVE') {
      return Response.json(
        { success: true, authenticated: false, message: 'User account not active' },
        { status: 200 }
      );
    }

    // Get client membership
    let membership = null;
    let profile = null;
    let capabilities = {};

    // Get client membership if user is linked to a client
    // This would depend on your data model - for now we'll check if there's a client link
    // For now, return basic user info

    return Response.json({
      success: true,
      authenticated: true,
      user: {
        id: userRecord.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified === true,
      },
      capabilities: {
        canManageProfile: true,
        canAnswerQuestionnaire: true,
        canRequestGeneration: true,
        canViewCalendar: true,
        canEditContent: true,
        canApproveContent: true,
        canRequestRegeneration: true,
        canManageAssets: true,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Me endpoint error:', error);
    return Response.json(
      { success: false, error: 'Internal server error', errorCode: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}