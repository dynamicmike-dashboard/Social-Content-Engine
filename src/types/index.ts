export type StrategyType = 'EDUCATE' | 'ENGAGE' | 'AUTHORITY' | 'STORY' | 'PROMOTE';
export type ContentStatus = 'DRAFT' | 'GENERATED' | 'CLIENT_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'REJECTED';
export type Platform = 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'TIKTOK';

export interface PlatformContent {
  hook: string;
  caption: string;
  ctaType: 'KEYWORD' | 'DIRECT_LINK' | 'CONVERSATION' | 'ENGAGEMENT';
  ctaValue: string; // The keyword, URL, or instruction
}

export interface ContentPost {
  id: string;
  date: string; // ISO date
  strategy: StrategyType;
  title: string;
  format: 'VIDEO' | 'IMAGE' | 'CAROUSEL' | 'TEXT';
  status: ContentStatus;
  platformContent: Record<Platform, PlatformContent>;
  alternativeHooks: string[];
  visualConcept: string;
}

export interface StrategyDistribution {
  EDUCATE: number;
  ENGAGE: number;
  AUTHORITY: number;
  STORY: number;
  PROMOTE: number;
}

export interface BusinessProfile {
  businessName: string;
  description: string;
  // ...other fields
}
