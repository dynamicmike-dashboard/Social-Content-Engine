import type { PromptDefinition } from './types';
import { P01_DEFINITION } from './prompts/P01-business-audience-research';

// Placeholder definitions for P02-P09 (planned status)
const createPlaceholderPrompt = (id: string, name: string, description: string): PromptDefinition => ({
  id: id as PromptDefinition['id'],
  name,
  category: id as PromptDefinition['category'],
  version: '0.1.0',
  status: 'planned',
  purpose: `TODO: ${description}`,
  description: `Planned prompt for ${description}. Not yet implemented.`,
  systemPrompt: 'TODO: Implement system prompt',
  userPromptTemplate: 'TODO: Implement user prompt template',
  inputs: [],
  outputSchema: {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
  },
  outputFields: [],
  contextDependencies: {
    requiresWorkshopContext: true,
    requiresCalendar: false,
    requiresAssets: false,
    requiresOffers: false,
  },
  approvalRequirements: {
    requiresHumanReview: true,
    reviewStage: 'post_generation',
  },
  modelRequirements: {
    preferred: 'any',
  },
  metadata: {
    tags: ['planned'],
  },
  testCases: [],
  createdAt: '2026-10-11',
  updatedAt: '2026-10-11',
});

export const PROMPT_CATALOGUE: Record<string, PromptDefinition> = {
  P01: P01_DEFINITION,
  P02: createPlaceholderPrompt('P02', 'Strategy & Content Calendar', 'Content pillars, objectives, publishing plans and strategy distribution'),
  P03: createPlaceholderPrompt('P03', 'Individual Social Posts', 'Platform-specific posts, hooks, CTAs and format variations'),
  P04: createPlaceholderPrompt('P04', 'Visual Research & Asset Selection', 'Image requirements, asset recommendations and visual strategy'),
  P05: createPlaceholderPrompt('P05', 'Controlled Graphic Design', 'Layout specifications, editable text elements and brand-compliant templates'),
  P06: createPlaceholderPrompt('P06', 'AI Image Generation & Refinement', 'Image-generation instructions, prompt engineering and refinement loops'),
  P07: createPlaceholderPrompt('P07', 'Offers & Campaign Planning', 'Campaign plans based on approved offers, timelines and conversion funnels'),
  P08: createPlaceholderPrompt('P08', 'Quality Assurance', 'Factual accuracy, brand compliance, accessibility and policy checks'),
  P09: createPlaceholderPrompt('P09', 'Performance Analysis & Optimisation', 'Findings, insights and recommended improvements from performance data'),
};

export function getPromptDefinition(id: string): PromptDefinition | undefined {
  return PROMPT_CATALOGUE[id];
}

export function getAllPromptDefinitions(): PromptDefinition[] {
  return Object.values(PROMPT_CATALOGUE);
}

export function getPromptsByCategory(categoryId: string): PromptDefinition[] {
  return Object.values(PROMPT_CATALOGUE).filter(p => p.category === categoryId);
}

export function getImplementedPrompts(): PromptDefinition[] {
  return Object.values(PROMPT_CATALOGUE).filter(p => p.status === 'implemented' || p.status === 'tested');
}

export function getPromptStatusSummary(): Record<string, { implemented: number; tested: number; experimental: number; planned: number }> {
  const summary: Record<string, { implemented: number; tested: number; experimental: number; planned: number }> = {};
  
  for (const prompt of Object.values(PROMPT_CATALOGUE)) {
    const cat = prompt.category;
    if (!summary[cat]) {
      summary[cat] = { implemented: 0, tested: 0, experimental: 0, planned: 0 };
    }
    const status = prompt.status;
    if (status in summary[cat]) {
      (summary[cat] as Record<string, number>)[status]++;
    }
  }
  
  return summary;
}