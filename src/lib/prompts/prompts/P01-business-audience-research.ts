import type { PromptDefinition, PromptOutputSchema } from '../types';

export const P01_OUTPUT_SCHEMA: PromptOutputSchema = {
  type: 'object',
  properties: {
    audienceProfiles: {
      type: 'array',
      description: 'Detailed audience segments with demographics, psychographics, and behaviors',
      items: {
        type: 'object',
        properties: {
          segmentName: { type: 'string', description: 'Name of the audience segment' },
          description: { type: 'string', description: 'Detailed description of this segment' },
          demographics: {
            type: 'object',
            properties: {
              ageRange: { type: 'string' },
              gender: { type: 'string' },
              location: { type: 'string' },
              incomeLevel: { type: 'string' },
              occupation: { type: 'string' },
            },
            required: ['ageRange', 'location'],
          },
          psychographics: {
            type: 'object',
            properties: {
              values: { type: 'array', items: { type: 'string' } },
              interests: { type: 'array', items: { type: 'string' } },
              lifestyle: { type: 'string' },
              motivations: { type: 'array', items: { type: 'string' } },
            },
            required: ['values', 'interests'],
          },
          painPoints: { type: 'array', items: { type: 'string' }, description: 'Specific problems this segment faces' },
          desires: { type: 'array', items: { type: 'string' }, description: 'What this segment wants to achieve' },
          objections: { type: 'array', items: { type: 'string' }, description: 'Why they might not buy/register' },
          preferredChannels: { type: 'array', items: { type: 'string' }, description: 'Where they spend time online' },
          contentPreferences: { type: 'array', items: { type: 'string' }, description: 'Types of content they engage with' },
          buyingTriggers: { type: 'array', items: { type: 'string' }, description: 'What prompts them to take action' },
        },
        required: ['segmentName', 'description', 'demographics', 'psychographics', 'painPoints', 'desires'],
      },
      minItems: 1,
      maxItems: 5,
    },
    positioningStatement: {
      type: 'string',
      description: 'Clear positioning statement: For [target], [brand] is the [category] that [benefit] because [reason]',
    },
    uniqueValueProposition: {
      type: 'string',
      description: 'The single most compelling reason to choose this brand/event',
    },
    competitiveLandscape: {
      type: 'array',
      description: 'Key competitors and differentiation',
      items: {
        type: 'object',
        properties: {
          competitorName: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          weaknesses: { type: 'array', items: { type: 'string' } },
          ourAdvantage: { type: 'string', description: 'How we win against this competitor' },
        },
        required: ['competitorName', 'ourAdvantage'],
      },
      maxItems: 5,
    },
    messagingPillars: {
      type: 'array',
      description: '3-5 core messaging themes that resonate with all segments',
      items: {
        type: 'object',
        properties: {
          pillar: { type: 'string' },
          description: { type: 'string' },
          supportingPoints: { type: 'array', items: { type: 'string' } },
          targetSegments: { type: 'array', items: { type: 'string' } },
        },
        required: ['pillar', 'description', 'supportingPoints'],
      },
      minItems: 3,
      maxItems: 5,
    },
    recommendedTone: {
      type: 'string',
      description: 'Recommended brand tone for this audience',
    },
    keywordsToUse: { type: 'array', items: { type: 'string' } },
    keywordsToAvoid: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'audienceProfiles',
    'positioningStatement',
    'uniqueValueProposition',
    'messagingPillars',
    'recommendedTone',
  ],
  additionalProperties: false,
};

export const P01_SYSTEM_PROMPT = `You are an expert business strategist and audience researcher. Your job is to analyze business context and produce structured audience research that will drive content strategy.

OUTPUT FORMAT: You MUST return valid JSON that matches the provided schema exactly. No extra commentary, no markdown formatting, no explanatory text - only the JSON object.

KEY PRINCIPLES:
- Base all insights on the provided context, not assumptions
- Be specific and actionable - avoid generic marketing speak
- Identify real pain points and desires from the context
- Position against actual competitors mentioned or implied
- Define messaging pillars that can be executed in content
- Tone must match the brand personality provided`;

export const P01_USER_PROMPT_TEMPLATE = `Analyze the following business context and produce comprehensive audience research and positioning.

BUSINESS CONTEXT:
{{#if workshopContext.eventName}}Event/Business Name: {{workshopContext.eventName}}{{/if}}
{{#if workshopContext.eventDescription}}Description: {{workshopContext.eventDescription}}{{/if}}
{{#if workshopContext.eventLocation}}Location: {{workshopContext.eventLocation}}{{/if}}
{{#if workshopContext.industry}}Industry: {{workshopContext.industry}}{{/if}}

AUDIENCE:
{{#if workshopContext.targetAudience}}Target Audience: {{workshopContext.targetAudience}}{{/if}}
{{#if workshopContext.mainProblem}}Main Problem: {{workshopContext.mainProblem}}{{/if}}
{{#if workshopContext.mainDesire}}Main Desire: {{workshopContext.mainDesire}}{{/if}}
{{#if workshopContext.commonQuestions}}Common Questions: {{workshopContext.commonQuestions}}{{/if}}
{{#if workshopContext.commonObjections}}Common Objections: {{workshopContext.commonObjections}}{{/if}}

OFFERS & EXPERTISE:
{{#if workshopContext.primaryOffer}}Primary Offer: {{workshopContext.primaryOffer}}{{/if}}
{{#if workshopContext.secondaryOffers}}Secondary Offers: {{workshopContext.secondaryOffers}}{{/if}}
{{#if workshopContext.expertiseTopics}}Expertise Topics: {{workshopContext.expertiseTopics}}{{/if}}

BRAND VOICE:
{{#if workshopContext.brandPersonality}}Brand Personality: {{workshopContext.brandPersonality}}{{/if}}
{{#if workshopContext.brandTone}}Brand Tone: {{workshopContext.brandTone}}{{/if}}
{{#if workshopContext.wordsToUse}}Words to Use: {{workshopContext.wordsToUse}}{{/if}}

CONTENT BOUNDARIES:
{{#if workshopContext.contentBoundaries}}Content Boundaries: {{workshopContext.contentBoundaries}}{{/if}}
{{#if workshopContext.prohibitedTopics}}Prohibited Topics: {{workshopContext.prohibitedTopics}}{{/if}}
{{#if workshopContext.accuracyRequirements}}Accuracy Requirements: {{workshopContext.accuracyRequirements}}{{/if}}

CONVERSION:
{{#if workshopContext.primaryCTA}}Primary CTA: {{workshopContext.primaryCTA}}{{/if}}
{{#if workshopContext.ctaType}}CTA Type: {{workshopContext.ctaType}}{{/if}}
{{#if workshopContext.ctaValue}}CTA Value: {{workshopContext.ctaValue}}{{/if}}

PROOF & STORIES:
{{#if workshopContext.originStory}}Origin Story: {{workshopContext.originStory}}{{/if}}
{{#if workshopContext.proofCredibility}}Proof/Credibility: {{workshopContext.proofCredibility}}{{/if}}
{{#if workshopContext.memorableStories}}Memorable Stories: {{workshopContext.memorableStories}}{{/if}}

CALENDAR & ASSETS:
{{#if workshopContext.upcomingEvents}}Upcoming Events: {{workshopContext.upcomingEvents}}{{/if}}
{{#if workshopContext.existingAssets}}Existing Assets: {{workshopContext.existingAssets}}{{/if}}
{{#if workshopContext.keyMessage}}Key Message: {{workshopContext.keyMessage}}{{/if}}

{{#if strategy}}CURRENT STRATEGY FOCUS: {{strategy}}{{/if}}

TASK: Produce audience research with:
1. 3-5 distinct audience segments with demographics, psychographics, pain points, desires, objections
2. A clear positioning statement following: "For [target], [brand] is the [category] that [benefit] because [reason]"
3. Unique value proposition (one compelling sentence)
4. Competitive landscape (2-4 competitors with our advantages)
5. 3-5 messaging pillars with supporting points
6. Recommended tone, keywords to use/avoid

All output must be grounded in the provided context. Do not invent facts not in evidence.`;

export const P01_INPUTS = [
  {
    key: 'workshopContext',
    label: 'Workshop Context',
    description: 'Full workshop content context from questionnaire',
    type: 'object' as const,
    required: true,
    source: 'workshop_context' as const,
  },
  {
    key: 'strategy',
    label: 'Strategy Focus',
    description: 'Optional strategy to focus research for',
    type: 'string' as const,
    required: false,
    source: 'strategy' as const,
  },
];

export const P01_DEFINITION: PromptDefinition = {
  id: 'P01',
  name: 'Business & Audience Research',
  category: 'P01',
  version: '1.0.0',
  status: 'implemented',
  purpose: 'Generate detailed audience profiles, positioning, and messaging pillars from workshop context',
  description: 'Transforms questionnaire responses into structured audience research with segments, positioning, competitive analysis, and messaging pillars. This is the foundation prompt that feeds all downstream content generation.',
  systemPrompt: P01_SYSTEM_PROMPT,
  userPromptTemplate: P01_USER_PROMPT_TEMPLATE,
  inputs: P01_INPUTS,
  outputSchema: P01_OUTPUT_SCHEMA,
  outputFields: [
    { key: 'audienceProfiles', label: 'Audience Profiles', description: 'Detailed audience segments', type: 'array', required: true },
    { key: 'positioningStatement', label: 'Positioning Statement', description: 'Standard positioning format', type: 'string', required: true },
    { key: 'uniqueValueProposition', label: 'Unique Value Proposition', description: 'Single compelling reason to choose', type: 'string', required: true },
    { key: 'competitiveLandscape', label: 'Competitive Landscape', description: 'Competitors and differentiation', type: 'array', required: false },
    { key: 'messagingPillars', label: 'Messaging Pillars', description: 'Core messaging themes', type: 'array', required: true },
    { key: 'recommendedTone', label: 'Recommended Tone', description: 'Brand tone for content', type: 'string', required: true },
    { key: 'keywordsToUse', label: 'Keywords to Use', description: 'Approved vocabulary', type: 'array', required: false },
    { key: 'keywordsToAvoid', label: 'Keywords to Avoid', description: 'Prohibited vocabulary', type: 'array', required: false },
  ],
  contextDependencies: {
    requiresWorkshopContext: true,
    requiresStrategy: undefined,
    requiresCalendar: false,
    requiresAssets: false,
    requiresOffers: false,
  },
  approvalRequirements: {
    requiresHumanReview: true,
    reviewStage: 'post_generation',
    approverRoles: ['strategist', 'client'],
  },
  modelRequirements: {
    preferred: 'gemini-pro',
    fallback: ['gpt-4o', 'claude-3.5-sonnet'],
    temperature: 0.3,
    maxTokens: 4000,
  },
  metadata: {
    estimatedTokens: { input: 2500, output: 3000 },
    estimatedCostUSD: 0.015,
    avgLatencyMs: 3000,
    tags: ['foundation', 'audience', 'positioning', 'strategy-input'],
    relatedPrompts: ['P02', 'P03', 'P08'],
  },
  testCases: [
    {
      name: 'Workshop Tournament Context',
      description: 'Playa Beach Volleyball Tournament workshop demo data',
      inputs: {
        workshopContext: {
          eventName: 'Playa Beach Volleyball Tournament',
          eventDescription: 'Annual international beach volleyball tournament in Playa del Carmen, Mexico',
          eventLocation: 'Playa del Carmen, Quintana Roo, Mexico',
          industry: 'Sports & Events / Tourism',
          targetAudience: 'Competitive and recreational beach volleyball players aged 18-45 from Mexico, USA, Canada, and Europe',
          mainProblem: 'Players struggle to find well-organized international beach volleyball tournaments in prime beach destinations during winter months',
          mainDesire: 'A professionally run, world-class beach volleyball tournament in a stunning Caribbean location',
          commonQuestions: 'What skill divisions? What\'s included? Where to stay? Refund policy? Free agent registration?',
          commonObjections: 'Travel costs, February dates conflict with indoor season, skill level uncertainty, safety concerns',
          primaryOffer: 'Tournament registration: 4-person co-ed ($450/team), 2-person ($300/team)',
          secondaryOffers: 'Early bird pricing, free agent matching, spectator passes, VIP packages',
          expertiseTopics: 'Beach volleyball tournament organization, international sports event management',
          brandPersonality: 'Energetic, welcoming, professional but not stiff. Community-first, player-focused, authentic.',
          brandTone: 'Energetic and welcoming - like a friend inviting you to the best beach week of the year.',
          wordsToUse: 'Epic, vibes, sandy toes, beach life, tournament mode, good vibes only, paradise found',
          contentBoundaries: 'No political commentary, no medical claims, no sponsor criticism, no negative competitor comments',
          accuracyRequirements: 'Tournament dates (Feb 14-21, 2027), registration deadline, prices, venue, registration link, contact email',
          prohibitedTopics: 'No political commentary, no medical claims, no sponsor criticism, no weather guarantees',
          primaryCTA: 'Visit the website for more information and registration.',
          ctaType: 'DIRECT_LINK',
          ctaValue: 'https://playabeachvolleyball.com',
          originStory: 'Founded in 2015 by local beach volleyball enthusiasts',
          proofCredibility: '10+ years running, 85% return rate, featured in Volleyball Magazine, 50+ teams from 8 countries',
          memorableStories: '2024 finals comeback, couple who met at tournament, local kid who went pro',
          upcomingEvents: 'Early bird ends Jan 15, venue confirmed, sponsor announcements weekly',
          existingAssets: '500+ photos from 2026, highlight reel, logo pack, drone footage, 20+ testimonials',
          keyMessage: 'This isn\'t just a tournament - it\'s the best week of your year.',
        },
      },
      expectedOutputShape: {
        audienceProfiles: [{ segmentName: 'string' }],
        positioningStatement: 'string',
        uniqueValueProposition: 'string',
        messagingPillars: [{ pillar: 'string' }],
        recommendedTone: 'string',
      },
      shouldPass: true,
    },
  ],
  createdAt: '2026-10-11',
  updatedAt: '2026-10-11',
};