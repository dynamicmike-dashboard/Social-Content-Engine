// POST /api/auth/logout
// Logout user by deleting session

import { createTeableService } from '../../../../teable/service';
import { hashPassword } from '../../../lib/auth/password';

export async function POST(request: Request): Promise<Response> {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      return Response.json(
        { success: false, error: 'Not logged in', errorCode: 'UNAUTHORIZED' },
        { status: 401 }
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

    if (sessionToken) {
      const teable = createTeableService();
      const { hashPassword } = await import('../../../lib/auth/password');
      const sessionTokenHash = await hashPassword(sessionToken);

      // Find and delete session
      const sessions = await teable.listRecords('User Sessions', {
        filter: {
          conjunction: 'and',
          filterSet: [
            { fieldId: 'session_token_hash', operator: 'is', value: sessionTokenHash }
          ]
        }
      });

      if (sessions.records.length > 0) {
        await teable.deleteRecord('User Sessions', sessions.records[0].id);
      }
    }

    // Clear session cookie
    const cookie = 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';

    return Response.json(
      { success: true, message: 'Logged out successfully' },
      {
        headers: {
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
        }
      }
    );

  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, clear the cookie
    return Response.json(
      { success: true, message: 'Logged out' },
      {
        headers: {
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
        }
      }
    );
  }
}