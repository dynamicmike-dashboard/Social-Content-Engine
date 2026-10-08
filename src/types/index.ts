export type StrategyName = 'EDUCATE' | 'ENGAGE' | 'AUTHORITY' | 'STORY' | 'PROMOTE';

export type SocialChannel = 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'TWITTER' | 'TIKTOK';

export type Platform = SocialChannel;

export type ContentFormat = 'IMAGE' | 'CAROUSEL' | 'SHORT_VIDEO' | 'REEL' | 'TEXT' | 'STORY' | 'POLL' | 'QUESTION';

export type ContentStatus = 
  | 'DRAFT' 
  | 'GENERATED' 
  | 'CLIENT_REVIEW' 
  | 'CHANGES_REQUESTED' 
  | 'APPROVED' 
  | 'SCHEDULED' 
  | 'PUBLISHED' 
  | 'REJECTED';

export type CTAType = 'KEYWORD' | 'DIRECT_LINK' | 'CONVERSATION' | 'ENGAGEMENT';

export interface HookOption {
  id: string;
  text: string;
  approach: 'curiosity' | 'problem' | 'contrarian' | 'question' | 'story' | 'result' | 'mistake' | 'myth' | 'direct_benefit';
  isPrimary: boolean;
  reason: string; // Why this hook works for this audience/platform
}

export interface PlatformContent {
  hook: string;
  alternativeHooks: HookOption[];
  caption: string;
  cta: string;
  hashtags: string;
  ctaType: CTAType;
  ctaValue: string;
  ctaReason: string; // Why this CTA is appropriate
  visualConcept?: string;
  visualDimensions?: string;
  videoConcept?: string;
  platformNotes?: string;
  length?: string;
  format?: ContentFormat;
}

export interface ContentPost {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  scheduledTime?: string; // ISO string
  platform: Platform;
  strategyId: string;
  strategyName: StrategyName;
  strategyColor: string;
  format: ContentFormat;
  topic: string;
  objective: string;
  hook: string; // Primary hook (for backward compatibility)
  alternativeHooks?: string[];
  caption: string; // Primary caption (for backward compatibility)
  shortCaption?: string;
  cta: string; // Primary CTA (for backward compatibility)
  ctaType: CTAType;
  ctaValue: string;
  hashtags: string; // Primary hashtags (for backward compatibility)
  imagePrompt?: string;
  imageUrl?: string;
  videoConcept?: string;
  videoScript?: string;
  firstComment?: string;
  aiInstructions?: string;
  status: ContentStatus;
  clientNotes?: string;
  revisionRequest?: string;
  approvedAt?: string;
  publishedAt?: string;
  externalPostId?: string;
  createdAt: string;
  updatedAt: string;
  // Platform-specific content for cross-channel marketing
  platformContent?: Record<SocialChannel, PlatformContent>;
}

export interface Strategy {
  id: string;
  name: StrategyName;
  shortDescription: string;
  color: string;
  hexColor: string;
  recommendedPercentage: number;
  primaryObjective: string;
  exampleContentTypes: string;
  recommendedCTA: string;
  active: boolean;
  recommendedPosts30: number;
}

export interface Client {
  id: string;
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
  // Questionnaire state
  questionnaireLevel?: QuestionnaireContextLevel;
  questionnaireResponses?: Record<string, string>;
  questionnaireProgress?: QuestionnaireProgress;
  questionnaireRevision: number;
  questionnaireSubmittedAt?: string;
}

export interface QuestionnaireResponse {
  id: string;
  clientId: string;
  questionNumber: number;
  questionCategory: 'BUSINESS' | 'CUSTOMER' | 'OFFER' | 'BRAND' | 'CONTENT' | 'COMPETITION' | 'CONVERSION';
  question: string;
  response: string;
  required: boolean;
  aiNotes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Questionnaire Context Levels
export type QuestionnaireContextLevel = 'quick_start' | 'build_strategy' | 'deep_context';

export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  contextLevel: QuestionnaireContextLevel;
  questions: QuestionnaireQuestion[];
  order: number;
  isOptional: boolean;
}

export interface QuestionnaireQuestion {
  id: string;
  sectionId: string;
  questionNumber: number;
  questionCategory: 'BUSINESS' | 'CUSTOMER' | 'OFFER' | 'BRAND' | 'CONTENT' | 'COMPETITION' | 'CONVERSION';
  question: string;
  response: string;
  required: boolean;
  aiNotes?: string;
  completed: boolean;
  contextLevel: QuestionnaireContextLevel;
  helpText?: string;
  placeholder?: string;
}

export interface QuestionnaireContextLevelConfig {
  level: QuestionnaireContextLevel;
  label: string;
  description: string;
  questionCount: number;
  estimatedTimeMinutes: number;
  isRecommended: boolean;
  questions: QuestionnaireQuestion[];
}

export interface QuestionnaireProgress {
  level: QuestionnaireContextLevel;
  completed: number;
  total: number;
  requiredCompleted: number;
  requiredTotal: number;
  canSubmit: boolean;
  sectionProgress: Record<string, { completed: number; total: number }>;
}

export interface ClientQuestionnaireState {
  level: QuestionnaireContextLevel;
  responses: Record<string, string>;
  progress: QuestionnaireProgress;
  submittedAt?: string;
  revision: number;
}

// Onboarding Flow Types
export type OnboardingStep = 'welcome' | 'select_level' | 'questionnaire' | 'strategy' | 'calendar' | 'complete';

export interface OnboardingFlowState {
  step: OnboardingStep;
  selectedLevel: QuestionnaireContextLevel | null;
  questionnaireCompleted: boolean;
  strategyConfirmed: boolean;
  clientId: string | null;
  questionnaireRevision: number;
}

export interface ContentAsset {
  id: string;
  contentId: string;
  assetUrl: string;
  assetType: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'DOCUMENT';
  thumbnailUrl?: string;
  altText?: string;
  aiPrompt?: string;
  approved: boolean;
  createdAt: string;
}

export interface ApprovalActivity {
  id: string;
  contentId: string;
  action: 'APPROVED' | 'EDITED' | 'REJECTED' | 'REGENERATED' | 'COMMENTED';
  previousStatus: ContentStatus;
  newStatus: ContentStatus;
  clientComment?: string;
  timestamp: string;
  userId: string;
}

export interface SocialAccount {
  id: string;
  clientId: string;
  accountName: string;
  platform: Platform;
  accountUrl?: string;
  connectionStatus: 'NOT_CONNECTED' | 'CONNECTED' | 'EXPIRED' | 'REVOKED' | 'ERROR';
  externalAccountId?: string;
  publishingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  clientId: string;
  sourceContentId?: string;
  platform: Platform;
  name: string;
  contact?: string;
  email?: string;
  whatsapp?: string;
  enquiry: string;
  leadStatus: 'NEW' | 'AI_QUALIFYING' | 'QUALIFIED' | 'HOT' | 'WARM' | 'COLD' | 'HUMAN_FOLLOWUP' | 'CONVERTED' | 'LOST';
  leadScore: number;
  qualificationNotes?: string;
  aiSummary?: string;
  nextAction?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyDistribution {
  EDUCATE: number;
  ENGAGE: number;
  AUTHORITY: number;
  STORY: number;
  PROMOTE: number;
}

export const DEFAULT_STRATEGY_DISTRIBUTION: StrategyDistribution = {
  EDUCATE: 8,
  ENGAGE: 6,
  AUTHORITY: 5,
  STORY: 5,
  PROMOTE: 6
};

export const STRATEGY_COLORS: Record<StrategyName, { light: string; default: string; dark: string }> = {
  EDUCATE: { light: '#DBEAFE', default: '#3B82F6', dark: '#1D4ED8' },
  ENGAGE: { light: '#D1FAE5', default: '#10B981', dark: '#059669' },
  AUTHORITY: { light: '#EDE9FE', default: '#8B5CF6', dark: '#7C3AED' },
  STORY: { light: '#FFEDD5', default: '#F97316', dark: '#EA580C' },
  PROMOTE: { light: '#FFE4E6', default: '#EC4899', dark: '#DB2777' }
};

export const SOCIAL_CHANNEL_COLORS: Record<SocialChannel, { light: string; default: string; dark: string; bg: string; text: string; border: string }> = {
  FACEBOOK: { 
    light: '#DBEAFE', 
    default: '#1877F2', 
    dark: '#166FE5',
    bg: '#E7F0FE',
    text: '#1877F2',
    border: '#1877F2'
  },
  INSTAGRAM: { 
    light: '#FCE7F3', 
    default: '#E1306C', 
    dark: '#C13584',
    bg: '#FDF2F8',
    text: '#E1306C',
    border: '#E1306C'
  },
  LINKEDIN: { 
    light: '#DBEAFE', 
    default: '#0A66C2', 
    dark: '#004182',
    bg: '#E8F0FE',
    text: '#0A66C2',
    border: '#0A66C2'
  },
  TWITTER: { 
    light: '#E0F7FA', 
    default: '#1DA1F2', 
    dark: '#0D8BD9',
    bg: '#E8F7FD',
    text: '#1DA1F2',
    border: '#1DA1F2'
  },
  TIKTOK: { 
    light: '#F5F0FF', 
    default: '#000000', 
    dark: '#1A1A2E',
    bg: '#F3F0FF',
    text: '#000000',
    border: '#000000'
  }
};

export const STATUS_COLORS: Record<ContentStatus, string> = {
  DRAFT: '#94A3B8',
  GENERATED: '#64748B',
  CLIENT_REVIEW: '#F59E0B',
  CHANGES_REQUESTED: '#EF4444',
  APPROVED: '#10B981',
  SCHEDULED: '#3B82F6',
  PUBLISHED: '#059669',
  REJECTED: '#DC2626'
};

export const VALID_STATUS_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: ['GENERATED'],
  GENERATED: ['CLIENT_REVIEW'],
  CLIENT_REVIEW: ['APPROVED', 'CHANGES_REQUESTED', 'REJECTED'],
  CHANGES_REQUESTED: ['CLIENT_REVIEW'],
  APPROVED: ['SCHEDULED'],
  SCHEDULED: ['PUBLISHED'],
  PUBLISHED: [],
  REJECTED: ['CLIENT_REVIEW']
};

export interface DashboardStats {
  totalPlanned: number;
  approved: number;
  awaitingReview: number;
  changesRequested: number;
  strategyDistribution: Record<StrategyName, number>;
}

export interface GenerationProgress {
  stage: 'analyzing' | 'strategizing' | 'generating' | 'finalizing' | 'complete';
  progress: number;
  message: string;
  postsGenerated: number;
  totalPosts: number;
}

export interface AppConfig {
  demoMode: boolean;
  teableApiKey?: string;
  teableBaseId?: string;
  aiProvider?: 'gemini' | 'openrouter';
  aiApiKey?: string;
}

export interface StrategyHealth {
  status: 'healthy' | 'promotion_heavy' | 'authority_light' | 'format_repetitive' | 'journey_gaps';
  label: string;
  description: string;
  checks: {
    totalPosts: boolean;
    categoryBalance: boolean;
    promotionalContent: boolean;
    ctaCoverage: boolean;
    platformCoverage: boolean;
    formatDiversity: boolean;
    journeyCoverage: boolean;
  };
}

export interface TimeSavedConfig {
  ideaGenerationMinutes: number;
  writingMinutes: number;
  designMinutes: number;
  editingMinutes: number;
  schedulingMinutes: number;
  hourlyRateMXN: number;
}

export interface TimeSavedResult {
  totalMinutes: number;
  totalHours: number;
  valueMXN: number;
  breakdown: {
    ideaGeneration: number;
    writing: number;
    design: number;
    editing: number;
    scheduling: number;
  };
}