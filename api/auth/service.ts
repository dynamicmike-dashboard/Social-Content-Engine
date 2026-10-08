// Authentication & Client Membership System
// Server-side only - handles verified identity to client mapping

import { TeableService, TeableRecord, TEABLE_TABLES, TEABLE_FIELDS } from '../teable/service';

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

export class AuthService {
  private teable: TeableService;

  constructor(teable: TeableService) {
    this.teable = teable;
  }

  /**
   * Get client membership for an authenticated user
   * This is the core tenant isolation - maps verified auth identity to client
   */
  async getClientMembership(user: AuthenticatedUser): Promise<ClientMembership | null> {
    // First check if we have a Client Memberships table in Teable
    // If not, fall back to checking Clients.Client Users field
    // In production, this should use a dedicated Client Memberships table
    
    try {
      // Query clients where the user is in Client Users
      const filter = {
        conjunction: 'and' as const,
        filterSet: [
          {
            fieldId: TEABLE_FIELDS.CLIENTS.CLIENT_USERS,
            operator: 'hasAnyOf',
            value: [user.subject] // This would need to match Teable user IDs
          },
          {
            fieldId: TEABLE_FIELDS.CLIENTS.ACTIVE_INACTIVE,
            operator: 'is',
            value: 'ACTIVE'
          }
        ]
      };

      const response = await this.teable.listRecords(TEABLE_TABLES.CLIENTS, { filter });
      
      if (response.records.length === 0) {
        return null;
      }

      // If multiple clients, in a real app you'd need disambiguation
      // For now, take the first active client
      const clientRecord = response.records[0];
      return this.mapClientRecordToMembership(clientRecord);
    } catch (error) {
      console.error('Error fetching client membership:', error);
      return null;
    }
  }

  /**
   * Get client profile by client ID (for verified membership)
   */
  async getClientProfile(clientRecordId: string): Promise<ClientProfile | null> {
    try {
      const record = await this.teable.getRecord(TEABLE_TABLES.CLIENTS, clientRecordId);
      return this.mapClientRecordToProfile(record);
    } catch (error) {
      console.error('Error fetching client profile:', error);
      return null;
    }
  }

  /**
   * Update client profile (allowlisted fields only)
   */
  async updateClientProfile(
    clientRecordId: string, 
    updates: Partial<ClientProfile>
  ): Promise<ClientProfile | null> {
    // Only allow specific fields to be updated by client
    const allowedFields = [
      TEABLE_FIELDS.CLIENTS.BUSINESS_NAME,
      TEABLE_FIELDS.CLIENTS.CONTACT_NAME,
      TEABLE_FIELDS.CLIENTS.EMAIL,
      TEABLE_FIELDS.CLIENTS.PHONE,
      TEABLE_FIELDS.CLIENTS.WHATSAPP,
      TEABLE_FIELDS.CLIENTS.WEBSITE,
      TEABLE_FIELDS.CLIENTS.FACEBOOK_URL,
      TEABLE_FIELDS.CLIENTS.INSTAGRAM_URL,
      TEABLE_FIELDS.CLIENTS.LINKEDIN_URL,
      TEABLE_FIELDS.CLIENTS.OTHER_SOCIAL_URLS,
      TEABLE_FIELDS.CLIENTS.BUSINESS_LOCATION,
      TEABLE_FIELDS.CLIENTS.INDUSTRY,
      TEABLE_FIELDS.CLIENTS.BUSINESS_DESCRIPTION,
      TEABLE_FIELDS.CLIENTS.PRIMARY_OFFER,
      TEABLE_FIELDS.CLIENTS.SECONDARY_OFFERS,
      TEABLE_FIELDS.CLIENTS.TARGET_AUDIENCE,
      TEABLE_FIELDS.CLIENTS.IDEAL_CUSTOMER_DESCRIPTION,
      TEABLE_FIELDS.CLIENTS.BRAND_PERSONALITY,
      TEABLE_FIELDS.CLIENTS.BRAND_TONE,
      TEABLE_FIELDS.CLIENTS.WORDS_TO_USE,
      TEABLE_FIELDS.CLIENTS.WORDS_TO_AVOID,
      TEABLE_FIELDS.CLIENTS.MAIN_CUSTOMER_PROBLEMS,
      TEABLE_FIELDS.CLIENTS.MAIN_CUSTOMER_DESIRES,
      TEABLE_FIELDS.CLIENTS.COMMON_QUESTIONS,
      TEABLE_FIELDS.CLIENTS.COMMON_OBJECTIONS,
      TEABLE_FIELDS.CLIENTS.COMPETITIVE_ADVANTAGES,
      TEABLE_FIELDS.CLIENTS.TESTIMONIALS_PROOF,
      TEABLE_FIELDS.CLIENTS.PRIMARY_CTA,
      TEABLE_FIELDS.CLIENTS.SECONDARY_CTA,
      TEABLE_FIELDS.CLIENTS.PREFERRED_CONTACT_METHOD
    ];

    const fields: Record<string, any> = {};
    
    // Map updates to Teable field IDs
    const fieldMap: Record<string, string> = {
      businessName: TEABLE_FIELDS.CLIENTS.BUSINESS_NAME,
      contactName: TEABLE_FIELDS.CLIENTS.CONTACT_NAME,
      email: TEABLE_FIELDS.CLIENTS.EMAIL,
      phone: TEABLE_FIELDS.CLIENTS.PHONE,
      whatsapp: TEABLE_FIELDS.CLIENTS.WHATSAPP,
      website: TEABLE_FIELDS.CLIENTS.WEBSITE,
      facebookUrl: TEABLE_FIELDS.CLIENTS.FACEBOOK_URL,
      instagramUrl: TEABLE_FIELDS.CLIENTS.INSTAGRAM_URL,
      linkedinUrl: TEABLE_FIELDS.CLIENTS.LINKEDIN_URL,
      otherSocialUrls: TEABLE_FIELDS.CLIENTS.OTHER_SOCIAL_URLS,
      businessLocation: TEABLE_FIELDS.CLIENTS.BUSINESS_LOCATION,
      industry: TEABLE_FIELDS.CLIENTS.INDUSTRY,
      businessDescription: TEABLE_FIELDS.CLIENTS.BUSINESS_DESCRIPTION,
      primaryOffer: TEABLE_FIELDS.CLIENTS.PRIMARY_OFFER,
      secondaryOffers: TEABLE_FIELDS.CLIENTS.SECONDARY_OFFERS,
      targetAudience: TEABLE_FIELDS.CLIENTS.TARGET_AUDIENCE,
      idealCustomerDescription: TEABLE_FIELDS.CLIENTS.IDEAL_CUSTOMER_DESCRIPTION,
      brandPersonality: TEABLE_FIELDS.CLIENTS.BRAND_PERSONALITY,
      brandTone: TEABLE_FIELDS.CLIENTS.BRAND_TONE,
      wordsToUse: TEABLE_FIELDS.CLIENTS.WORDS_TO_USE,
      wordsToAvoid: TEABLE_FIELDS.CLIENTS.WORDS_TO_AVOID,
      mainCustomerProblems: TEABLE_FIELDS.CLIENTS.MAIN_CUSTOMER_PROBLEMS,
      mainCustomerDesires: TEABLE_FIELDS.CLIENTS.MAIN_CUSTOMER_DESIRES,
      commonQuestions: TEABLE_FIELDS.CLIENTS.COMMON_QUESTIONS,
      commonObjections: TEABLE_FIELDS.CLIENTS.COMMON_OBJECTIONS,
      competitiveAdvantages: TEABLE_FIELDS.CLIENTS.COMPETITIVE_ADVANTAGES,
      testimonialsProof: TEABLE_FIELDS.CLIENTS.TESTIMONIALS_PROOF,
      primaryCTA: TEABLE_FIELDS.CLIENTS.PRIMARY_CTA,
      secondaryCTA: TEABLE_FIELDS.CLIENTS.SECONDARY_CTA,
      preferredContactMethod: TEABLE_FIELDS.CLIENTS.PREFERRED_CONTACT_METHOD
    };

    for (const [key, value] of Object.entries(updates)) {
      if (fieldMap[key] && allowedFields.includes(fieldMap[key])) {
        fields[fieldMap[key]] = value;
      }
    }

    if (Object.keys(fields).length === 0) {
      throw new Error('No valid fields to update');
    }

    const record = await this.teable.updateRecord(TEABLE_TABLES.CLIENTS, clientRecordId, fields);
    return this.mapClientRecordToProfile(record);
  }

  private mapClientRecordToMembership(record: TeableRecord): ClientMembership {
    const fields = record.fields;
    return {
      id: record.id,
      clientId: fields[TEABLE_FIELDS.CLIENTS.CLIENT_ID] || record.id,
      clientRecordId: record.id,
      clientName: fields[TEABLE_FIELDS.CLIENTS.BUSINESS_NAME] || 'Unknown Business',
      role: 'CLIENT',
      status: 'ACTIVE',
      authIssuer: '', // Would be populated from membership table
      authSubject: '',
      createdAt: fields[TEABLE_FIELDS.CLIENTS.CREATED_AT] || new Date().toISOString(),
      updatedAt: fields[TEABLE_FIELDS.CLIENTS.UPDATED_AT] || new Date().toISOString()
    };
  }

  private mapClientRecordToProfile(record: TeableRecord): ClientProfile {
    const fields = record.fields;
    return {
      id: fields[TEABLE_FIELDS.CLIENTS.CLIENT_ID] || record.id,
      recordId: record.id,
      businessName: fields[TEABLE_FIELDS.CLIENTS.BUSINESS_NAME] || '',
      contactName: fields[TEABLE_FIELDS.CLIENTS.CONTACT_NAME] || '',
      email: fields[TEABLE_FIELDS.CLIENTS.EMAIL] || '',
      phone: fields[TEABLE_FIELDS.CLIENTS.PHONE],
      whatsapp: fields[TEABLE_FIELDS.CLIENTS.WHATSAPP],
      website: fields[TEABLE_FIELDS.CLIENTS.WEBSITE],
      facebookUrl: fields[TEABLE_FIELDS.CLIENTS.FACEBOOK_URL],
      instagramUrl: fields[TEABLE_FIELDS.CLIENTS.INSTAGRAM_URL],
      linkedinUrl: fields[TEABLE_FIELDS.CLIENTS.LINKEDIN_URL],
      otherSocialUrls: fields[TEABLE_FIELDS.CLIENTS.OTHER_SOCIAL_URLS],
      businessLocation: fields[TEABLE_FIELDS.CLIENTS.BUSINESS_LOCATION],
      industry: fields[TEABLE_FIELDS.CLIENTS.INDUSTRY],
      businessDescription: fields[TEABLE_FIELDS.CLIENTS.BUSINESS_DESCRIPTION],
      primaryOffer: fields[TEABLE_FIELDS.CLIENTS.PRIMARY_OFFER],
      secondaryOffers: fields[TEABLE_FIELDS.CLIENTS.SECONDARY_OFFERS],
      targetAudience: fields[TEABLE_FIELDS.CLIENTS.TARGET_AUDIENCE],
      idealCustomerDescription: fields[TEABLE_FIELDS.CLIENTS.IDEAL_CUSTOMER_DESCRIPTION],
      brandPersonality: fields[TEABLE_FIELDS.CLIENTS.BRAND_PERSONALITY],
      brandTone: fields[TEABLE_FIELDS.CLIENTS.BRAND_TONE],
      wordsToUse: fields[TEABLE_FIELDS.CLIENTS.WORDS_TO_USE],
      wordsToAvoid: fields[TEABLE_FIELDS.CLIENTS.WORDS_TO_AVOID],
      mainCustomerProblems: fields[TEABLE_FIELDS.CLIENTS.MAIN_CUSTOMER_PROBLEMS],
      mainCustomerDesires: fields[TEABLE_FIELDS.CLIENTS.MAIN_CUSTOMER_DESIRES],
      commonQuestions: fields[TEABLE_FIELDS.CLIENTS.COMMON_QUESTIONS],
      commonObjections: fields[TEABLE_FIELDS.CLIENTS.COMMON_OBJECTIONS],
      competitiveAdvantages: fields[TEABLE_FIELDS.CLIENTS.COMPETITIVE_ADVANTAGES],
      testimonialsProof: fields[TEABLE_FIELDS.CLIENTS.TESTIMONIALS_PROOF],
      primaryCTA: fields[TEABLE_FIELDS.CLIENTS.PRIMARY_CTA],
      secondaryCTA: fields[TEABLE_FIELDS.CLIENTS.SECONDARY_CTA],
      preferredContactMethod: fields[TEABLE_FIELDS.CLIENTS.PREFERRED_CONTACT_METHOD] || 'EMAIL',
      contentApprovalRequired: fields[TEABLE_FIELDS.CLIENTS.CONTENT_APPROVAL_REQUIRED] ?? true,
      servicePackage: fields[TEABLE_FIELDS.CLIENTS.SERVICE_PACKAGE] || 'STARTER',
      active: fields[TEABLE_FIELDS.CLIENTS.ACTIVE_INACTIVE] === 'ACTIVE',
      timeZone: fields[TEABLE_FIELDS.CLIENTS.TIME_ZONE] || 'America/Cancun',
      createdAt: fields[TEABLE_FIELDS.CLIENTS.CREATED_AT] || new Date().toISOString(),
      updatedAt: fields[TEABLE_FIELDS.CLIENTS.UPDATED_AT] || new Date().toISOString()
    };
  }
}

// Middleware to extract authenticated user from request
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  // This would integrate with your actual auth provider (Clerk, NextAuth, etc.)
  // For now, return null - implement based on your auth system
  
  // Example for cookie-based session:
  // const session = await getSession(request);
  // if (!session?.user) return null;
  // return { issuer: 'your-auth-provider', subject: session.user.id, email: session.user.email, name: session.user.name };
  
  return null;
}

// Verify user owns the client they're trying to access
export function verifyClientOwnership(
  membership: ClientMembership | null,
  requestedClientId: string
): boolean {
  if (!membership) return false;
  if (membership.status !== 'ACTIVE') return false;
  return membership.clientRecordId === requestedClientId;
}

export { TeableService } from '../teable/service';