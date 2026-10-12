import { transformQuestionnaireToContext } from '../data/workshopContentContext';

// Test data factories
export const createMockStrategyDistribution = (
  overrides: Partial<Record<string, number>> = {}
): Record<string, number> => ({
  EDUCATE: 8,
  ENGAGE: 6,
  AUTHORITY: 5,
  STORY: 5,
  PROMOTE: 6,
  ...overrides,
});

export const createMockQuestionnaireResponses = (
  overrides: Record<string, string> = {}
): Record<string, string> => ({
  business_name: 'Test Tournament',
  business_location: 'Test City, Test Country',
  business_website: 'https://test.com',
  what_you_do: 'Test business description',
  target_audience: 'Test audience',
  main_problem: 'Test problem',
  main_desire: 'Test desire',
  primary_offer: 'Test offer',
  secondary_offers: 'Other offers',
  expertise_topics: 'Test expertise',
  brand_personality: 'Test personality',
  brand_tone: 'Test tone',
  words_to_use: 'Test words',
  primary_goal: 'Test goal',
  ...overrides,
});

export function createMockContext(overrides = {}) {
  return transformQuestionnaireToContext({
    business_name: 'Playa Beach Volleyball Tournament',
    business_location: 'Playa del Carmen, Quintana Roo, Mexico',
    business_website: 'https://playabeachvolleyball.com',
    what_you_do: 'Annual international beach volleyball tournament in Playa del Carmen, Mexico, featuring competitive and recreational divisions for players from around the world.',
    industry: 'Sports & Events / Tourism',
    target_audience: 'Competitive and recreational beach volleyball players aged 18-45 from Mexico, USA, Canada, and Europe. Includes college/club alumni, recreational league players, and first-time tournament participants. Values: community, competition, travel, beach lifestyle.',
    main_problem: 'Players struggle to find well-organized international beach volleyball tournaments in prime beach destinations during winter months. Many tournaments are poorly organized, lack proper infrastructure, or are in less desirable locations.',
    main_desire: 'A professionally run, world-class beach volleyball tournament in a stunning Caribbean location with great competition, social events, and a vacation atmosphere.',
    common_questions: 'What skill divisions are offered? What\'s included in registration? Where do players stay? Is there a refund policy? Can I register as a free agent?',
    common_objections: 'Travel costs to Mexico, February dates conflict with indoor volleyball season, players unsure of skill level fit, safety concerns in Mexico.',
    origin_story: 'Founded in 2015 by local beach volleyball enthusiasts who wanted to bring high-level competition to Playa del Carmen. Started with 50 teams, now hosts 200+ teams annually from 15+ countries.',
    proof_credibility: '10+ years running, 85% return rate, featured in Volleyball Magazine, 50+ teams from 8 countries in 2026, partnered with FIVB and NORCECA.',
    memorable_stories: 'The 2024 finals comeback where Team Mexico came back from 0-2 down to win 3-2. The couple who met at the 2022 tournament and got engaged on the beach. The local kid from Playa who went pro after being discovered at the tournament.',
    primary_cta: 'Visit the website for more information and registration.',
    content_boundaries: 'No political commentary, no medical/health claims, no sponsor criticism, no weather guarantees, no negative comments about other tournaments.',
    accuracy_requirements: 'Tournament dates (Feb 14-21, 2027), registration deadline (Jan 15, 2027), prices per team (\$450 co-ed, \$300 pairs), venue address (Playa del Carmen main beach), registration link (playabeachvolleyball.com/register), contact email (info@playabeachvolleyball.com).',
    prohibited_topics: 'No political commentary, no medical/health claims, no sponsor criticism, no weather guarantees, no negative comments about competitors, no unverified health claims.',
    ...overrides,
  });
}

export const mockStrategyDistribution = {
  EDUCATE: 8,
  ENGAGE: 6,
  AUTHORITY: 5,
  STORY: 5,
  PROMOTE: 6,
};

export const mockWorkshopContext = {
  eventName: 'Test Tournament',
  eventDescription: 'A test tournament',
  eventLocation: 'Test City, Test Country',
  eventWebsite: 'https://test.com',
  industry: 'Sports & Events',
  targetAudience: 'Test audience',
  mainProblem: 'Test problem',
  mainDesire: 'Test desire',
  commonQuestions: 'Test questions',
  commonObjections: 'Test objections',
  originStory: 'Origin story',
  proofCredibility: 'Proof',
  memorableStories: 'Stories',
  primaryOffer: 'Main offer',
  secondaryOffers: 'Other offers',
  expertiseTopics: 'Expertise areas',
  brandPersonality: 'Test personality',
  brandTone: 'Test tone',
  wordsToUse: 'Test words',
  contentBoundaries: 'Test boundaries',
  accuracyRequirements: 'Test accuracy',
  prohibitedTopics: 'Test prohibited',
  primaryCTA: 'Visit website',
  ctaType: 'DIRECT_LINK',
  ctaValue: 'https://test.com',
  upcomingEvents: 'Upcoming events',
  existingAssets: 'Assets',
  keyMessage: 'Key message',
};