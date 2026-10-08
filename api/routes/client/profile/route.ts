// GET /api/client/profile
// Returns current client's full profile

import { createTeableService } from '../../../teable/service';
import { AuthService, getAuthenticatedUser, verifyClientOwnership } from '../../../auth/service';

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

    const profile = await authService.getClientProfile(membership.clientRecordId);
    
    if (!profile) {
      return Response.json({ error: 'Client not found' }, { status: 404 });
    }

    return Response.json({ profile });

  } catch (error) {
    console.error('Error in GET /api/client/profile:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/client/profile
// Updates allowlisted business/brand fields

export async function PATCH(request: Request) {
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

    const updates = await request.json();
    
    // Validate updates - only allow specific fields
    const allowedKeys = [
      'businessName', 'contactName', 'email', 'phone', 'whatsapp', 'website',
      'facebookUrl', 'instagramUrl', 'linkedinUrl', 'otherSocialUrls',
      'businessLocation', 'industry', 'businessDescription', 'primaryOffer',
      'secondaryOffers', 'targetAudience', 'idealCustomerDescription',
      'brandPersonality', 'brandTone', 'wordsToUse', 'wordsToAvoid',
      'mainCustomerProblems', 'mainCustomerDesires', 'commonQuestions',
      'commonObjections', 'competitiveAdvantages', 'testimonialsProof',
      'primaryCTA', 'secondaryCTA', 'preferredContactMethod'
    ];

    const filteredUpdates: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const profile = await authService.updateClientProfile(membership.clientRecordId, filteredUpdates);
    
    return Response.json({ profile });

  } catch (error) {
    console.error('Error in PATCH /api/client/profile:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}