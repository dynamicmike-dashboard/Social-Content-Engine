// GET /api/me
// Returns verified identity, active client membership, permitted capabilities

import { createTeableService } from '../../teable/service';
import { AuthService, getAuthenticatedUser, ClientMembership } from '../../auth/service';

export async function GET(request: Request) {
  try {
    // Get authenticated user from session/token
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return Response.json(
        { authenticated: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const teable = createTeableService();
    const authService = new AuthService(teable);
    
    // Get client membership for this user
    const membership = await authService.getClientMembership(user);
    
    if (!membership) {
      return Response.json(
        { 
          authenticated: true, 
          user: { email: user.email, name: user.name },
          client: null,
          message: 'No active client membership found'
        },
        { status: 200 }
      );
    }

    // Get client profile
    const profile = await authService.getClientProfile(membership.clientRecordId);

    return Response.json({
      authenticated: true,
      user: { 
        issuer: user.issuer, 
        subject: user.subject,
        email: user.email, 
        name: user.name 
      },
      client: membership ? {
        id: membership.clientRecordId,
        clientId: membership.clientId,
        name: membership.clientName,
        role: membership.role,
        status: membership.status
      } : null,
      profile: profile ? {
        businessName: profile.businessName,
        contactName: profile.contactName,
        email: profile.email,
        servicePackage: profile.servicePackage,
        timeZone: profile.timeZone,
        contentApprovalRequired: profile.contentApprovalRequired
      } : null,
      capabilities: {
        canManageProfile: true,
        canAnswerQuestionnaire: true,
        canRequestGeneration: true,
        canViewCalendar: true,
        canEditContent: true,
        canApproveContent: true,
        canRequestRegeneration: true,
        canManageAssets: true
      }
    });

  } catch (error) {
    console.error('Error in /api/me:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}