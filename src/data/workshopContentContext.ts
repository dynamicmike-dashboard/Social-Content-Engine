export interface WorkshopContentContext {
  // Business/Event Identity
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventWebsite: string;
  industry: string;
  
  // Audience
  targetAudience: string;
  mainProblem: string;
  mainDesire: string;
  commonQuestions: string;
  commonObjections: string;
  
  // Offers & Expertise
  primaryOffer: string;
  secondaryOffers: string;
  expertiseTopics: string;
  
  // Brand Voice
  brandPersonality: string;
  brandTone: string;
  wordsToUse: string;
  
  // Content Boundaries
  contentBoundaries: string;
  accuracyRequirements: string;
  prohibitedTopics: string;
  
  // Conversion
  primaryCTA: string;
  ctaType: string;
  ctaValue: string;
  
  // Proof & Stories
  originStory: string;
  proofCredibility: string;
  memorableStories: string;
  
  // Calendar/Assets
  upcomingEvents: string;
  existingAssets: string;
  keyMessage: string;
}

/**
 * Transform questionnaire responses into structured workshop content context
 */
export function transformQuestionnaireToContext(
  responses: Record<string, string>
): WorkshopContentContext {
  // Helper to get response or empty string
  const get = (key: string) => responses[key]?.trim() || '';
  
  return {
    // Business/Event Identity
    eventName: get('business_name') || 'Playa Beach Volleyball Tournament',
    eventDescription: get('what_you_do') || get('tournament_description') || 'Annual international beach volleyball tournament in Playa del Carmen, Mexico.',
    eventLocation: get('business_location') || get('event_details') || 'Playa del Carmen, Quintana Roo, Mexico',
    eventWebsite: get('business_website') || 'https://playabeachvolleyball.com',
    industry: get('industry') || 'Sports & Events / Tourism',
    
    // Audience
    targetAudience: get('target_audience') || get('target_attendees') || 'Competitive and recreational beach volleyball players aged 18-45 from Mexico, USA, Canada, and Europe.',
    mainProblem: get('main_problem') || 'Players struggle to find well-organized international beach volleyball tournaments in prime beach destinations during winter months.',
    mainDesire: get('main_desire') || 'A professionally run, world-class beach volleyball tournament in a stunning Caribbean location.',
    commonQuestions: get('common_questions') || 'What skill divisions are offered? What\'s included in registration? Where do players stay? Is there a refund policy?',
    commonObjections: get('common_objections') || 'Travel costs to Mexico, February dates conflict with indoor volleyball season, uncertainty about skill level fit.',
    
    // Offers & Expertise
    primaryOffer: get('primary_offer') || 'Tournament registration: 4-person co-ed ($450/team), 2-person ($300/team). Includes 4+ days competition, welcome party, live streaming, awards.',
    secondaryOffers: get('secondary_offers') || 'Early bird pricing, free agent matching, spectator passes, VIP packages.',
    expertiseTopics: get('expertise_topics') || 'Beach volleyball tournament organization, international sports event management, player experience design.',
    
    // Brand Voice
    brandPersonality: get('brand_personality') || 'Energetic, welcoming, professional but not stiff. Community-first, player-focused, authentic.',
    brandTone: get('brand_tone') || 'Energetic and welcoming - like a friend inviting you to the best beach week of the year.',
    wordsToUse: get('words_to_use') || 'Epic, vibes, sandy toes, beach life, tournament mode, good vibes only, paradise found.',
    
    // Content Boundaries
    contentBoundaries: get('content_boundaries') || 'No political commentary, no medical/health claims, no sponsor criticism, no negative comments about competitors.',
    accuracyRequirements: get('accuracy_requirements') || 'Tournament dates, registration deadline, prices, venue address, registration link, contact email.',
    prohibitedTopics: get('prohibited_topics') || get('content_boundaries') || 'No political commentary, no medical claims, no sponsor criticism, no weather guarantees.',
    
    // Conversion
    primaryCTA: get('primary_cta') || 'Visit the website for more information and registration.',
    ctaType: 'DIRECT_LINK',
    ctaValue: get('business_website') || 'https://playabeachvolleyball.com',
    
    // Proof & Stories
    originStory: get('origin_story') || 'Founded by local beach volleyball enthusiasts who wanted to bring high-level competition to Playa del Carmen.',
    proofCredibility: get('proof_credibility') || '10+ years running, 85% return rate, featured in Volleyball Magazine, 50+ teams from 8 countries.',
    memorableStories: get('memorable_stories') || 'The 2024 finals comeback, the couple who met at the tournament, the local kid who went pro.',
    
    // Calendar/Assets
    upcomingEvents: get('upcoming_events') || 'Early bird ends Jan 15, venue confirmed, sponsor announcements weekly.',
    existingAssets: get('existing_assets') || '500+ photos from 2026, highlight reel, logo pack, drone footage, 20+ player testimonials.',
    keyMessage: get('key_message') || 'This isn\'t just a tournament - it\'s the best week of your year.',
  };
}

/**
 * Check if a topic is prohibited based on content boundaries
 */
export function isTopicProhibited(topic: string, context: WorkshopContentContext): boolean {
  const prohibited = context.prohibitedTopics.toLowerCase();
  const topicLower = topic.toLowerCase();
  
  // Check for explicit prohibited terms
  const prohibitedTerms = prohibited
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0);
  
  return prohibitedTerms.some(term => topicLower.includes(term));
}

/**
 * Get allowed topics for content generation (filtering out prohibited)
 */
export function getAllowedTopics(
  suggestedTopics: string[],
  context: WorkshopContentContext
): string[] {
  return suggestedTopics.filter(topic => !isTopicProhibited(topic, context));
}

/**
 * Get the primary CTA from context
 */
export function getPrimaryCTA(context: WorkshopContentContext): { text: string; type: string; value: string } {
  return {
    text: context.primaryCTA,
    type: context.ctaType,
    value: context.ctaValue,
  };
}

/**
 * Generate strategy-specific topics based on context
 */
export function generateStrategyTopics(context: WorkshopContentContext): Record<string, string[]> {
  const base = {
    EDUCATE: [
      `How to prepare for ${context.eventName}`,
      `Beach volleyball rules every player should know`,
      `Training tips for tournament success`,
      `Beach volleyball techniques: serving, passing, setting`,
      `Nutrition and hydration for tournament play`,
      `Mental preparation for competition`,
      `Understanding beach volleyball rules and formats`,
      `Recovery strategies between matches`,
    ],
    ENGAGE: [
      `What's your favorite ${context.eventName} memory?`,
      `Tag your tournament partner!`,
      `Poll: Indoor vs Beach - which do you prefer?`,
      `Caption this tournament photo`,
      `What's your pre-match ritual?`,
      `Rate your excitement for ${context.eventName} 1-10`,
      `Share your best beach volleyball tip`,
      `Who's your dream tournament partner?`,
    ],
    AUTHORITY: [
      `Why ${context.eventName} sets the standard for beach tournaments`,
      `${context.proofCredibility}`,
      `Expert insights: What makes a tournament world-class`,
      `Behind the scenes: Organizing an international tournament`,
      `Player testimonials: Why pros choose ${context.eventName}`,
      `The science of beach volleyball court design`,
      `How we ensure fair competition across skill levels`,
      `Safety protocols that set us apart`,
    ],
    STORY: [
      `${context.originStory}`,
      `${context.memorableStories}`,
      `Player journey: From first tournament to champion`,
      `The couple who met at ${context.eventName}`,
      `Local impact: How the tournament transforms Playa del Carmen`,
      `Volunteer stories: The heart behind the tournament`,
      `A day in the life of a tournament director`,
      `From spectator to competitor: One player's journey`,
    ],
    PROMOTE: [
      `Early bird pricing ends soon - register for ${context.eventName}`,
      `${context.primaryOffer}`,
      `Limited spots remaining for ${context.eventName}`,
      `Bring your team to paradise - ${context.eventLocation}`,
      `${context.primaryCTA}`,
      `VIP packages available - exclusive access`,
      `Free agent? We'll match you with a team!`,
      `Last chance: Registration closes soon`,
    ],
  };
  
  return base;
}

/**
 * Generate post topics for a specific strategy using context
 */
export function getTopicsForStrategy(strategy: string, context: WorkshopContentContext): string[] {
  const topics = generateStrategyTopics(context);
  return topics[strategy as keyof typeof topics] || [];
}