// Auth types for client-side use and testing
// Mirrors the server-side types from api/auth/service.ts

export interface AuthenticatedUser {
  issuer: string;
  subject: string;
  email?: string;
  name?: string;
}

export interface ClientMembership {
  id: string;
  clientId: string;
  clientRecordId: string;
  clientName: string;
  role: 'CLIENT' | 'AGENCY_ADMIN';
  status: 'INVITED' | 'ACTIVE' | 'REVOKED';
  authIssuer: string;
  authSubject: string;
  teableUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  id: string;
  recordId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  otherSocialUrls?: string;
  businessLocation?: string;
  industry?: string;
  businessDescription?: string;
  primaryOffer?: string;
  secondaryOffers?: string;
  targetAudience?: string;
  idealCustomerDescription?: string;
  brandPersonality?: string;
  brandTone?: string;
  wordsToUse?: string;
  wordsToAvoid?: string;
  mainCustomerProblems?: string;
  mainCustomerDesires?: string;
  commonQuestions?: string;
  commonObjections?: string;
  competitiveAdvantages?: string;
  testimonialsProof?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  preferredContactMethod: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'WEBSITE';
  contentApprovalRequired: boolean;
  servicePackage: 'STARTER' | 'STANDARD' | 'PRO' | 'CUSTOM';
  active: boolean;
  timeZone: string;
  createdAt: string;
  updatedAt: string;
}

export function verifyClientOwnership(
  membership: ClientMembership | null,
  requestedClientId: string
): boolean {
  if (!membership) return false;
  if (membership.status !== 'ACTIVE') return false;
  return membership.clientRecordId === requestedClientId;
}