/// <reference types="vite/client" />

import type { AppConfig } from '../types';

// Configuration - uses environment variables with fallbacks
export const config: AppConfig = {
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true' || true, // Default to demo mode
  teableApiKey: import.meta.env.VITE_TEABLE_API_KEY,
  teableBaseId: import.meta.env.VITE_TEABLE_BASE_ID || 'bseagIh2WI3tU9zIvKm',
  aiProvider: (import.meta.env.VITE_AI_PROVIDER as 'gemini' | 'openrouter') || 'gemini',
  aiApiKey: import.meta.env.VITE_AI_API_KEY
};

// Demo mode configuration
export const DEMO_CONFIG = {
  clientId: 'demo-client-001',
  clientName: 'Demo Business Co.',
  enabled: config.demoMode
} as const;

// Teable table IDs from the database reference
export const TEABLE_TABLES = {
  clients: 'tblEwplxQKUmq9oDHki',
  questionnaireResponses: 'tblknwlbpM85PW6tDN2',
  contentStrategies: 'tblFGUZ06SPGwjmLEXB',
  contentCalendar: 'tblza9csBxLaPAkRkQS',
  contentAssets: 'tblfFIwp5wnhnJqmiUB',
  approvalActivity: 'tble7rdBSzvUnIl7x1p',
  socialAccounts: 'tbljhokUm3ToWSGg2y5',
  leads: 'tblClVGoMgC8MtKlaLX'
} as const;

// Teable field IDs for Clients table
export const TEABLE_CLIENT_FIELDS = {
  businessName: 'fldqFFfzrExmLpoeXBC',
  clientId: 'fldXwmxsN2uJbuuSv3o',
  contactName: 'fldwMujZjFNv1YKUMB1',
  email: 'fldCkHPc22JXdGcI1HY',
  phone: 'fldzDAcYiWVz0GBh69c',
  whatsapp: 'fldes0zDKzwyf4lEZeB',
  website: 'fldgmifEAGipjQVqGan',
  facebookUrl: 'fldfMrPfOKaAmMla6eA',
  instagramUrl: 'fldYn8OQAVHtewIQiId',
  linkedinUrl: 'fldTeTN0lmSr7N5I4r0',
  otherSocialUrls: 'fldUgC3Y4F8MLBjjXR9',
  businessLocation: 'fld0sy0uSxHqfpqD8uJ',
  industry: 'fldaSarEXB9j4lMfsBa',
  businessDescription: 'fldULlNGpwGRuhjEfrm',
  primaryOffer: 'fldBwR5lOzEjvEPEH36',
  secondaryOffers: 'fldrgSuYZZm0pqTi7wM',
  targetAudience: 'fldex4UsvKl7dszJ2bZ',
  idealCustomerDescription: 'fldnOHphzEdttn8Uieu',
  brandPersonality: 'fldspPc9D7b9W6FhLww',
  brandTone: 'fldSxNol4IQf17cUL14',
  wordsToUse: 'fld4ncQfVvFLHHiMwa7',
  wordsToAvoid: 'fldRwVByRurPk1IqqdV',
  mainCustomerProblems: 'fldkRrDgP8o2gJTKkyt',
  mainCustomerDesires: 'fldjsB331j4KiQdBBHC',
  commonQuestions: 'fldlUo0pMF0etKj1PLH',
  commonObjections: 'fldc0J2xsoaa9z5ZtlN',
  competitiveAdvantages: 'fldubzhOHHksb8YJA8E',
  testimonialsProof: 'fldJIl39oWmcpOQBAZU',
  primaryCTA: 'fldbeBqU7aK0EfgcOwe',
  secondaryCTA: 'fldp2x7E6TqKkkmA7LR',
  preferredContactMethod: 'fldoTtLO4cbA0fW4ymi',
  contentApprovalRequired: 'fld5fD1kZhlyygI33GK',
  servicePackage: 'fld6pArqCH2K50412wJ',
  active: 'fldWOXPV60SYkAkLDrE',
  clientUsers: 'fld4jlmNJmkoSPZn2Ru',
  timeZone: 'fldd4e5sSVhIjdmjYi0',
  createdAt: 'fldDqNvyEHTzxuoF4PB',
  updatedAt: 'fldTi5mgrDTZ1g0CtzS'
} as const;

// Teable field IDs for Content Calendar table
export const TEABLE_CONTENT_FIELDS = {
  contentTopic: 'fldL2QABewKU1OkxZ9K',
  contentId: 'fldcJp42tN2e9hhMhQ0',
  clientId: 'fldDgRU0An5yYuJa8nb',
  date: 'fld4KUWG1lCDhEw13xg',
  scheduledTime: 'fldEJ9sgyv7uU1DJ0tk',
  platform: 'fldfT6y33sbzKrQPqRT',
  strategyId: 'fld3F4k5UHu3pgdf3dr',
  contentFormat: 'fldPrGjIuvSXqIcOwSj',
  contentObjective: 'fldTMaulQDyXaZ4EkCR',
  hook: 'fldDeWQvfJbZzRKQqHd',
  caption: 'fldCYyWSyFQDKE78Xyy',
  shortCaption: 'fld0z1Qfeyeu8ElfmYC',
  cta: 'fldM4vGTjM3hTYUWFBR',
  hashtags: 'fldRRm9ChzVrgFPdycx',
  imagePrompt: 'fldIfXWoZ165LNNfYvU',
  imageUrl: 'fldSpvMKZtWxpw0L1jh',
  videoConcept: 'fldKYGyKHqf5hniDMFD',
  videoScript: 'fldpJlFeNI8LHg2VjNj',
  firstComment: 'fldlqtj1vINHSLrUgnE',
  aiInstructions: 'fldlRA7yQgyASjrHdgW',
  status: 'fldWuLN0DYpKb9vzXVX',
  clientNotes: 'fldo7r0lWwkZKRAKVP8',
  aiRevisionRequest: 'fldlEDYbAsAKsulMKGZ',
  approvedAt: 'fldK4A6VgjPDt1GaYtt',
  publishedAt: 'fldxtSyxhMoktZpphrX',
  externalPostId: 'fld719bJ9GQlasvzhws',
  createdAt: 'fldSxtdmUXmV6oTYiam',
  updatedAt: 'fldjr1ULImuegOAl9PT',
  day: 'fldwTkU2OoyfzcEuZs2',
  strategyName: 'fldtcQk6Fa74xKVSvDI',
  clientRecordId: 'fldUOOcxHc680MuT640',
  clientUsers: 'fldsbMN7M7njgKZjW2W',
  strategyColour: 'fldPsxI7gxbI8MYsbVb'
} as const;

// Teable field IDs for Content Strategies table
export const TEABLE_STRATEGY_FIELDS = {
  strategyName: 'fldz2TiATD6iGgjHqIF',
  strategyId: 'fldTs4f4AuodAXYgd1M',
  shortDescription: 'fldikbNawSuOW5TwPZG',
  color: 'fldgwHgEPtjZCdaUBeF',
  hexColor: 'fldK7SZlHCFZRb8Pti3',
  recommendedPercentage: 'fldJC1kxlKZBT3873Q7',
  primaryObjective: 'fldhsss3xD0s0Cf7PtA',
  exampleContentTypes: 'fldJ7S4UMw5xPHNSSCE',
  recommendedCTA: 'fldypxC13gITIfkEbEv',
  active: 'fldczsbZQPDgHSzJ8zu',
  recommendedPosts30: 'fldyUdEU8KisZcr00sz'
} as const;

// Teable field IDs for Questionnaire Responses table
export const TEABLE_QUESTIONNAIRE_FIELDS = {
  question: 'fld5ND3hSCvbbsjh70O',
  responseId: 'fldgaB09XEF4weRhNqF',
  clientId: 'fldFl0ZZ1fD0sFyD3n4',
  questionNumber: 'flduQIALN0KfkiV4GSw',
  questionCategory: 'fld6koB40tSdqEfLEVX',
  response: 'fldtCGO3SsWKhjBfVj9',
  required: 'fldpET1TjuizjFhm9K2',
  aiNotes: 'fld3L1xu5IVrGfZ2Fw0',
  createdAt: 'fld4CQEHRpZnQqhVdI0',
  updatedAt: 'fldmWQoJYWMOg9vVAMm',
  completed: 'fldBzAZruOM6PTTh3w5',
  clientUsers: 'fldqUvUDavgs9r5ojyg'
} as const;

export function buildTeableUrl(endpoint: string): string {
  return `https://app.teable.io/api${endpoint}`;
}

export function getTeableHeaders(): HeadersInit {
  if (!config.teableApiKey) {
    throw new Error('Teable API key not configured');
  }
  return {
    'Authorization': `Bearer ${config.teableApiKey}`,
    'Content-Type': 'application/json'
  };
}