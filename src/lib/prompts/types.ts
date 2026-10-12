import { WorkshopContentContext } from '../../data/workshopContentContext';
import { StrategyName } from '../../types';

export type PromptCategoryId = 
  | 'P01' | 'P02' | 'P03' | 'P04' | 'P05' 
  | 'P06' | 'P07' | 'P08' | 'P09';

export type PromptStatus = 'implemented' | 'tested' | 'experimental' | 'planned';

export type PromptModelRequirement = 
  | 'gemini-pro' 
  | 'gemini-flash' 
  | 'gpt-4o' 
  | 'gpt-4o-mini' 
  | 'claude-3.5-sonnet' 
  | 'claude-3.5-haiku' 
  | 'any';

export interface PromptInputField {
  key: string;
  label: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: unknown;
  source?: 'questionnaire' | 'workshop_context' | 'strategy' | 'client_profile' | 'calendar' | 'assets' | 'offers' | 'manual';
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface PromptOutputField {
  key: string;
  label: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
}

export interface PromptOutputSchema {
  type: 'object';
  properties: Record<string, JSONSchemaProperty>;
  required: string[];
  additionalProperties?: boolean;
}

export interface JSONSchemaProperty {
  type: string;
  description?: string;
  items?: JSONSchemaProperty;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  enum?: string[];
  minItems?: number;
  maxItems?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
}

export interface PromptTestCase {
  name: string;
  description: string;
  inputs: Record<string, unknown>;
  expectedOutputShape: Record<string, unknown>;
  shouldPass: boolean;
}

export interface PromptMetadata {
  estimatedTokens?: {
    input: number;
    output: number;
  };
  estimatedCostUSD?: number;
  avgLatencyMs?: number;
  tags?: string[];
  relatedPrompts?: PromptCategoryId[];
}

export interface PromptDefinition {
  id: PromptCategoryId;
  name: string;
  category: PromptCategoryId;
  version: string;
  status: PromptStatus;
  purpose: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  inputs: PromptInputField[];
  outputSchema: PromptOutputSchema;
  outputFields: PromptOutputField[];
  contextDependencies: {
    requiresWorkshopContext: boolean;
    requiresStrategy?: StrategyName[];
    requiresCalendar?: boolean;
    requiresAssets?: boolean;
    requiresOffers?: boolean;
  };
  approvalRequirements: {
    requiresHumanReview: boolean;
    reviewStage?: 'pre_generation' | 'post_generation' | 'pre_publish';
    approverRoles?: string[];
  };
  modelRequirements: {
    preferred: PromptModelRequirement;
    fallback?: PromptModelRequirement[];
    temperature?: number;
    maxTokens?: number;
  };
  metadata: PromptMetadata;
  testCases: PromptTestCase[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptCategory {
  id: PromptCategoryId;
  label: string;
  description: string;
  icon: string;
  color: string;
  promptIds: PromptCategoryId[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  params?: Record<string, unknown>;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface RenderedPrompt {
  systemPrompt: string;
  userPrompt: string;
  inputsUsed: Record<string, unknown>;
  missingRequired: string[];
}

export interface PromptExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  validation?: ValidationResult;
  error?: string;
  rawResponse?: string;
  tokensUsed?: {
    input: number;
    output: number;
  };
  latencyMs?: number;
}

export interface PromptContext {
  workshopContext?: WorkshopContentContext;
  strategy?: StrategyName;
  distribution?: Record<StrategyName, number>;
  calendarData?: unknown;
  assets?: unknown[];
  offers?: unknown[];
  clientProfile?: unknown;
  customInputs?: Record<string, unknown>;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: 'P01',
    label: 'Business & Audience Research',
    description: 'Audience profiles, needs analysis, positioning and competitive landscape',
    icon: 'users',
    color: '#3B82F6',
    promptIds: ['P01'],
  },
  {
    id: 'P02',
    label: 'Strategy & Content Calendar',
    description: 'Content pillars, objectives, publishing plans and strategy distribution',
    icon: 'calendar',
    color: '#10B981',
    promptIds: ['P02'],
  },
  {
    id: 'P03',
    label: 'Individual Social Posts',
    description: 'Platform-specific posts, hooks, CTAs and format variations',
    icon: 'message-square',
    color: '#8B5CF6',
    promptIds: ['P03'],
  },
  {
    id: 'P04',
    label: 'Visual Research & Asset Selection',
    description: 'Image requirements, asset recommendations and visual strategy',
    icon: 'image',
    color: '#F97316',
    promptIds: ['P04'],
  },
  {
    id: 'P05',
    label: 'Controlled Graphic Design',
    description: 'Layout specifications, editable text elements and brand-compliant templates',
    icon: 'layout',
    color: '#EC4899',
    promptIds: ['P05'],
  },
  {
    id: 'P06',
    label: 'AI Image Generation & Refinement',
    description: 'Image-generation instructions, prompt engineering and refinement loops',
    icon: 'wand',
    color: '#6366F1',
    promptIds: ['P06'],
  },
  {
    id: 'P07',
    label: 'Offers & Campaign Planning',
    description: 'Campaign plans based on approved offers, timelines and conversion funnels',
    icon: 'target',
    color: '#14B8A6',
    promptIds: ['P07'],
  },
  {
    id: 'P08',
    label: 'Quality Assurance',
    description: 'Factual accuracy, brand compliance, accessibility and policy checks',
    icon: 'shield-check',
    color: '#F59E0B',
    promptIds: ['P08'],
  },
  {
    id: 'P09',
    label: 'Performance Analysis & Optimisation',
    description: 'Findings, insights and recommended improvements from performance data',
    icon: 'trending-up',
    color: '#EF4444',
    promptIds: ['P09'],
  },
];

export function getPromptCategory(id: PromptCategoryId): PromptCategory | undefined {
  return PROMPT_CATEGORIES.find(c => c.id === id);
}

export function getAllPromptCategories(): PromptCategory[] {
  return PROMPT_CATEGORIES;
}