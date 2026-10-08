import { QuestionnaireSection, QuestionnaireQuestion, QuestionnaireContextLevel } from '../types';

// Single level for workshop - event-focused questionnaire
export const WORKSHOP_QUESTIONNAIRE_LEVEL: QuestionnaireContextLevel = 'build_strategy';

export const WORKSHOP_QUESTIONNAIRE_SECTIONS: QuestionnaireSection[] = [
  {
    id: 'tournament_overview',
    title: 'Tournament Overview',
    description: 'Tell us about your event in your own words',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 1,
    isOptional: false,
    questions: [
      {
        id: 'tournament_description',
        sectionId: 'tournament_overview',
        questionNumber: 1,
        questionCategory: 'BUSINESS',
        question: 'Tell me about the tournament in your own words.',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'What is it? What makes it special? Who runs it?',
        placeholder: 'e.g., Annual beach volleyball tournament in Playa del Carmen, attracting players from across North America...'
      },
      {
        id: 'event_details',
        sectionId: 'tournament_overview',
        questionNumber: 2,
        questionCategory: 'BUSINESS',
        question: 'Key details for the February 2027 event.',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Dates, venue, categories, expected numbers - whatever you know so far',
        placeholder: 'e.g., February 14-21, 2027 | Playa del Carmen main beach | 4-person co-ed, 2-person men\'s/women\'s | ~200 teams expected...'
      },
      {
        id: 'target_attendees',
        sectionId: 'tournament_overview',
        questionNumber: 3,
        questionCategory: 'CUSTOMER',
        question: 'Who do you most want to attend?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Player types, skill levels, demographics, geographic regions',
        placeholder: 'e.g., Competitive amateur players 20-40, college/club alumni, recreational players looking for their first tournament...'
      }
    ]
  },
  {
    id: 'experience_value',
    title: 'Experience & Value',
    description: 'What makes attending worthwhile',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 2,
    isOptional: false,
    questions: [
      {
        id: 'attendee_experience',
        sectionId: 'experience_value',
        questionNumber: 4,
        questionCategory: 'CUSTOMER',
        question: 'What will someone experience if they attend?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Atmosphere, activities, social events, competition format, extras',
        placeholder: 'e.g., 4 days of competition, welcome party, player lounge, live streaming, awards ceremony, beach side events, sponsor village...'
      },
      {
        id: 'why_attend',
        sectionId: 'experience_value',
        questionNumber: 5,
        questionCategory: 'CUSTOMER',
        question: 'Why should someone choose this tournament over others?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Your unique differentiators - location, format, community, prizes, organization',
        placeholder: 'e.g., Only beach volleyball tournament in Playa del Carmen in February, perfect weather, established 10+ year history, professional organization...'
      },
      {
        id: 'hesitations',
        sectionId: 'experience_value',
        questionNumber: 6,
        questionCategory: 'CUSTOMER',
        question: 'Why might someone hesitate to register?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Cost, travel, skill level concerns, timing, competing events - be honest so we can address them',
        placeholder: 'e.g., Travel costs to Mexico, February dates conflict with indoor season, players unsure of skill level fit...'
      },
      {
        id: 'common_questions',
        sectionId: 'experience_value',
        questionNumber: 7,
        questionCategory: 'CUSTOMER',
        question: 'What questions do people repeatedly ask?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'FAQs that come up again and again - registration, format, accommodation, equipment, rules',
        placeholder: 'e.g., Do I need a partner? What skill division? Where to stay? What\'s included in registration? Is there a refund policy?'
      }
    ]
  },
  {
    id: 'story_authority',
    title: 'Story & Authority',
    description: 'The tournament\'s history and proof',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 3,
    isOptional: false,
    questions: [
      {
        id: 'origin_story',
        sectionId: 'story_authority',
        questionNumber: 8,
        questionCategory: 'BRAND',
        question: 'What\'s the story behind the tournament?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'How/why did it start? Who founded it? What was the vision?',
        placeholder: 'e.g., Founded in 2015 by local beach volleyball enthusiasts who wanted to bring high-level competition to Playa del Carmen...'
      },
      {
        id: 'proof_credibility',
        sectionId: 'story_authority',
        questionNumber: 9,
        questionCategory: 'COMPETITION',
        question: 'What proof do you already have?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Past attendance numbers, testimonials, media coverage, returning teams, sponsor logos, photos/video',
        placeholder: 'e.g., 1,200+ players served over 9 years, 85% return rate, featured in Volleyball Magazine, 50+ teams from 8 countries in 2026...'
      },
      {
        id: 'stories_moments',
        sectionId: 'story_authority',
        questionNumber: 10,
        questionCategory: 'BRAND',
        question: 'What stories or moments from previous tournaments can we tell?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Memorable matches, player journeys, community impact, behind-the-scenes moments',
        placeholder: 'e.g., The 2024 finals comeback, the husband-wife duo who met at the tournament, the local kid who went pro...'
      }
    ]
  },
  {
    id: 'conversion',
    title: 'Registration & Conversion',
    description: 'How you turn interest into registrations',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 4,
    isOptional: false,
    questions: [
      {
        id: 'primary_cta',
        sectionId: 'conversion',
        questionNumber: 11,
        questionCategory: 'CONVERSION',
        question: 'What is the ONE main action you want people to take?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'This becomes the primary CTA across all content',
        placeholder: 'Visit the website for more information and registration.'
      }
    ]
  },
  {
    id: 'accuracy_boundaries',
    title: 'Accuracy & Boundaries',
    description: 'Guardrails for content generation',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 5,
    isOptional: false,
    questions: [
      {
        id: 'accuracy_requirements',
        sectionId: 'accuracy_boundaries',
        questionNumber: 12,
        questionCategory: 'CONTENT',
        question: 'What information must always be accurate?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Dates, prices, registration deadlines, venue, rules, categories, contact info - anything that would cause problems if wrong',
        placeholder: 'e.g., Tournament dates (Feb 14-21, 2027), registration deadline, prices per team, venue address, registration link, contact email...'
      },
      {
        id: 'content_boundaries',
        sectionId: 'accuracy_boundaries',
        questionNumber: 13,
        questionCategory: 'CONTENT',
        question: 'What should we NOT talk about?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Subjects, people, organizations, competitors, controversial topics, political/religious subjects, sensitive issues, claims, jokes, opinions you want to avoid',
        placeholder: 'e.g., No political commentary, no comments on other tournaments, no medical/health claims, no speculation on weather, no sponsor criticism...'
      }
    ]
  },
  {
    id: 'voice_personality',
    title: 'Voice & Personality',
    description: 'How the tournament sounds and feels',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 6,
    isOptional: false,
    questions: [
      {
        id: 'words_to_avoid',
        sectionId: 'voice_personality',
        questionNumber: 14,
        questionCategory: 'BRAND',
        question: 'What words, phrases or styles don\'t you want used?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Corporate speak, slang, overly casual language, specific terms that don\'t fit',
        placeholder: 'e.g., "Crush it," "dominate," overly aggressive language, corporate jargon like "synergy" or "leverage"...'
      },
      {
        id: 'natural_description',
        sectionId: 'voice_personality',
        questionNumber: 15,
        questionCategory: 'BRAND',
        question: 'How would you naturally describe the tournament to someone over a coffee/beer?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'This helps us nail your authentic voice',
        placeholder: 'e.g., "It\'s the best week of the year - great volleyball, perfect weather, amazing people. You show up, play hard, make friends, and leave with stories..."'
      },
      {
        id: 'content_personality',
        sectionId: 'voice_personality',
        questionNumber: 16,
        questionCategory: 'BRAND',
        question: 'What personality should the content have?',
        response: '',
        required: true,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Energetic, welcoming, professional, community-focused, inspiring, authentic',
        placeholder: 'e.g., Energetic and welcoming - like a friend inviting you to the best beach week of the year. Professional but not stiff. Community-first...'
      }
    ]
  },
  {
    id: 'calendar_assets',
    title: 'Calendar & Assets',
    description: 'What\'s happening and what you already have',
    contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
    order: 7,
    isOptional: true,
    questions: [
      {
        id: 'upcoming_events',
        sectionId: 'calendar_assets',
        questionNumber: 17,
        questionCategory: 'CONTENT',
        question: 'What\'s happening during the next 30-60 days?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Registration milestones, early bird deadlines, announcements, partner announcements, venue confirmations',
        placeholder: 'e.g., Early bird pricing ends Jan 15, venue confirmed Feb 1, sponsor announcements weekly, player registration opens...'
      },
      {
        id: 'existing_assets',
        sectionId: 'calendar_assets',
        questionNumber: 18,
        questionCategory: 'CONTENT',
        question: 'What content/assets already exist?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Photos, videos, logos, brand guidelines, past marketing materials, player testimonials, drone footage of venue',
        placeholder: 'e.g., 500+ photos from 2026 event, 2-minute highlight reel, tournament logo pack, venue drone footage, 20+ player testimonials...'
      },
      {
        id: 'key_memory',
        sectionId: 'calendar_assets',
        questionNumber: 19,
        questionCategory: 'BRAND',
        question: 'If people remember ONE thing about the event, what should it be?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'The single message or feeling that should stick',
        placeholder: 'e.g., "This isn\'t just a tournament - it\'s the best week of your year."'
      },
      {
        id: 'additional_notes',
        sectionId: 'calendar_assets',
        questionNumber: 20,
        questionCategory: 'CONTENT',
        question: 'Anything else we should know?',
        response: '',
        required: false,
        completed: false,
        contextLevel: WORKSHOP_QUESTIONNAIRE_LEVEL,
        helpText: 'Special partnerships, unique rules, community initiatives, sustainability efforts, charity components',
        placeholder: 'e.g., Partnering with local turtle conservation, 10% of proceeds to youth volleyball in Quintana Roo, carbon-neutral initiative...'
      }
    ]
  }
];

// Helper to get flat question list for workshop
export function getWorkshopQuestions(): QuestionnaireQuestion[] {
  return WORKSHOP_QUESTIONNAIRE_SECTIONS.flatMap(section => section.questions);
}

export function getWorkshopQuestionCounts(): { total: number; required: number } {
  const questions = getWorkshopQuestions();
  return {
    total: questions.length,
    required: questions.filter(q => q.required).length
  };
}

// Workshop level metadata (single level)
export const WORKSHOP_LEVEL_METADATA = {
  label: 'Tournament Content Strategy',
  description: '~20 questions. Give the AI enough context to create content that\'s genuinely specific to your tournament.',
  questionCount: 20,
  requiredCount: 16,
  estimatedTimeMinutes: 15,
  isRecommended: true,
  sections: WORKSHOP_QUESTIONNAIRE_SECTIONS.length
} as const;

// ============================================
// WORKSHOP DEMO PRE-FILL DATA
// Maps tournament answers to build_strategy questionnaire format
// ============================================

export const WORKSHOP_DEMO_PREFILL: Record<string, string> = {
  // Business Identity
  business_name: 'Playa Beach Volleyball Tournament',
  business_location: 'Playa del Carmen, Quintana Roo, Mexico',
  business_website: 'https://playabeachvolleyball.com',
  what_you_do: 'Annual international beach volleyball tournament held in Playa del Carmen, Mexico, featuring competitive and recreational divisions for players from around the world.',
  industry: 'Sports & Events / Tourism',

  // Customer Insights
  target_audience: 'Competitive and recreational beach volleyball players aged 18-45 from Mexico, USA, Canada, and Europe. Includes college/club alumni, recreational league players, and first-time tournament participants. Values: community, competition, travel, beach lifestyle.',
  main_problem: 'Players struggle to find well-organized international beach volleyball tournaments in prime beach destinations during winter months. Many tournaments are poorly organized, lack professional infrastructure, or are in less desirable locations.',
  main_desire: 'A professionally run, world-class beach volleyball tournament in a stunning Caribbean location with great competition, social events, and a vacation atmosphere.',
  common_questions: 'What skill divisions are offered? What\'s included in registration? Where do players stay? Is there a refund policy? Can I register as a free agent? What\'s the competition format?',
  common_objections: 'Travel costs to Mexico, February dates conflict with indoor volleyball season, uncertainty about skill level fit, concerns about tournament organization quality, safety concerns in Mexico.',

  // Expertise Areas
  primary_offer: 'Tournament registration packages: 4-person co-ed ($450/team), 2-person men\'s/women\'s ($300/team). Includes: 4+ days competition, welcome party, player lounge, live streaming, awards ceremony, sponsor village access.',
  secondary_offers: 'Early bird pricing (save $50/team by Jan 15), free agent matching service, spectator passes, VIP packages with premium seating and exclusive events.',
  expertise_topics: 'Beach volleyball tournament organization, international sports event management, player experience design, beach volleyball technique, tournament logistics, sports tourism in Mexico.',

  // Brand Personality
  brand_personality: 'Energetic, welcoming, professional but not stiff. Like a friend inviting you to the best beach week of the year. Community-first, player-focused, authentic.',
  brand_tone: 'Energetic and welcoming - like a friend inviting you to the best beach week of the year. Professional but not stiff. Community-first. Uses contractions, conversational.',
  words_to_use: 'Epic, vibes, sandy toes, beach life, tournament mode, good vibes only, paradise found, serve it up, dig deep, championship energy.',

  // Workshop-specific fields (these don't directly map but provide context)
  // Content boundaries / prohibited topics
  content_boundaries: 'No political commentary, no comments on other tournaments, no medical/health claims, no speculation on weather, no sponsor criticism, no negative comments about competitors or other tournaments.',
  // Accuracy requirements
  accuracy_requirements: 'Tournament dates (Feb 14-21, 2027), registration deadline, prices per team, venue address, registration link, contact email, division rules, refund policy.',
  // CTA
  primary_cta: 'Visit the website for more information and registration.',
  // Prohibited topics
  prohibited_topics: 'No political commentary, no medical/health claims, no sponsor criticism, no negative comments about other tournaments, no weather guarantees, no unverified attendance numbers.',
} as const;

// Helper to apply workshop demo pre-fill to build_strategy questionnaire
export function getWorkshopDemoPrefillForBuildStrategy(): Record<string, string> {
  return WORKSHOP_DEMO_PREFILL;
}

export function getWorkshopDemoPrefillKeys(): string[] {
  return Object.keys(WORKSHOP_DEMO_PREFILL);
}