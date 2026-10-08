import { QuestionnaireSection, QuestionnaireQuestion, QuestionnaireContextLevel } from '../types';

export const QUESTIONNAIRE_SECTIONS: Record<QuestionnaireContextLevel, QuestionnaireSection[]> = {
  quick_start: [
    {
      id: 'business_basics',
      title: 'Business Basics',
      description: 'The essentials to get started',
      contextLevel: 'quick_start',
      order: 1,
      isOptional: false,
      questions: [
        {
          id: 'business_name',
          sectionId: 'business_basics',
          questionNumber: 1,
          questionCategory: 'BUSINESS',
          question: 'What is your business name?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'Your legal or trading name',
          placeholder: 'e.g., Maya\'s Yoga Studio'
        },
        {
          id: 'business_location',
          sectionId: 'business_basics',
          questionNumber: 2,
          questionCategory: 'BUSINESS',
          question: 'Where is your business located? (City, State/Country)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'Helps with local content and time zones',
          placeholder: 'e.g., Playa del Carmen, Mexico'
        },
        {
          id: 'business_website',
          sectionId: 'business_basics',
          questionNumber: 3,
          questionCategory: 'BUSINESS',
          question: 'What is your website URL?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'For link-in-bio and traffic driving',
          placeholder: 'https://yourwebsite.com'
        },
        {
          id: 'what_you_do',
          sectionId: 'business_basics',
          questionNumber: 4,
          questionCategory: 'BUSINESS',
          question: 'What does your business do in one sentence?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'Your elevator pitch',
          placeholder: 'e.g., I help busy professionals find calm through online yoga classes'
        }
      ]
    },
    {
      id: 'target_audience',
      title: 'Your Audience',
      description: 'Who you\'re creating content for',
      contextLevel: 'quick_start',
      order: 2,
      isOptional: false,
      questions: [
        {
          id: 'target_audience',
          sectionId: 'target_audience',
          questionNumber: 5,
          questionCategory: 'CUSTOMER',
          question: 'Who is your ideal customer? Describe them.',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'Demographics, role, lifestyle, pain points',
          placeholder: 'e.g., Women 30-50, corporate jobs, high stress, want flexibility'
        },
        {
          id: 'main_problem',
          sectionId: 'target_audience',
          questionNumber: 6,
          questionCategory: 'CUSTOMER',
          question: 'What is the #1 problem your customer wants solved?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'The core pain point you address',
          placeholder: 'e.g., No time for self-care, chronic back pain from sitting'
        }
      ]
    },
    {
      id: 'primary_goal',
      title: 'Your Goal',
      description: 'What you want content to achieve',
      contextLevel: 'quick_start',
      order: 3,
      isOptional: false,
      questions: [
        {
          id: 'primary_goal',
          sectionId: 'primary_goal',
          questionNumber: 7,
          questionCategory: 'CONVERSION',
          question: 'What is the ONE thing you want people to do after seeing your content?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'quick_start',
          helpText: 'Book a call, buy a product, sign up, visit website, etc.',
          placeholder: 'e.g., Book a free 15-min discovery call'
        }
      ]
    }
  ],

  build_strategy: [
    {
      id: 'business_identity',
      title: 'Business Identity',
      description: 'Core business information',
      contextLevel: 'build_strategy',
      order: 1,
      isOptional: false,
      questions: [
        {
          id: 'business_name',
          sectionId: 'business_identity',
          questionNumber: 1,
          questionCategory: 'BUSINESS',
          question: 'What is your business name?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Maya\'s Yoga Studio'
        },
        {
          id: 'business_location',
          sectionId: 'business_identity',
          questionNumber: 2,
          questionCategory: 'BUSINESS',
          question: 'Where is your business located? (City, State/Country)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Playa del Carmen, Mexico'
        },
        {
          id: 'business_website',
          sectionId: 'business_identity',
          questionNumber: 3,
          questionCategory: 'BUSINESS',
          question: 'What is your website URL?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'https://yourwebsite.com'
        },
        {
          id: 'what_you_do',
          sectionId: 'business_identity',
          questionNumber: 4,
          questionCategory: 'BUSINESS',
          question: 'What does your business do? (2-3 sentences)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., I help busy professionals find calm through online yoga classes designed for tight schedules...'
        },
        {
          id: 'industry',
          sectionId: 'business_identity',
          questionNumber: 5,
          questionCategory: 'BUSINESS',
          question: 'What industry are you in?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Health & Wellness / Online Education'
        }
      ]
    },
    {
      id: 'customer_insights',
      title: 'Customer Insights',
      description: 'Deep understanding of who you serve',
      contextLevel: 'build_strategy',
      order: 2,
      isOptional: false,
      questions: [
        {
          id: 'target_audience',
          sectionId: 'customer_insights',
          questionNumber: 6,
          questionCategory: 'CUSTOMER',
          question: 'Describe your ideal customer in detail.',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Women 30-50, corporate professionals, $75k+ income, value wellness but struggle with time...'
        },
        {
          id: 'main_problem',
          sectionId: 'customer_insights',
          questionNumber: 7,
          questionCategory: 'CUSTOMER',
          question: 'What is their #1 problem or pain point?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Chronic stress, no time for self-care, back pain from desk work'
        },
        {
          id: 'main_desire',
          sectionId: 'customer_insights',
          questionNumber: 8,
          questionCategory: 'CUSTOMER',
          question: 'What is their #1 desire or outcome?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Feel calm and energized daily, without adding more to their plate'
        },
        {
          id: 'common_questions',
          sectionId: 'customer_insights',
          questionNumber: 9,
          questionCategory: 'CUSTOMER',
          question: 'What are the top 3 questions they ask before buying?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., How much time? Do I need experience? What equipment?'
        },
        {
          id: 'common_objections',
          sectionId: 'customer_insights',
          questionNumber: 10,
          questionCategory: 'CUSTOMER',
          question: 'What are their main objections to buying?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Too busy, not flexible enough, can\'t afford it'
        }
      ]
    },
    {
      id: 'expertise_areas',
      title: 'Your Expertise',
      description: 'What you know and teach',
      contextLevel: 'build_strategy',
      order: 3,
      isOptional: false,
      questions: [
        {
          id: 'primary_offer',
          sectionId: 'expertise_areas',
          questionNumber: 11,
          questionCategory: 'OFFER',
          question: 'What is your main paid offer?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., 8-week "Yoga for Busy Professionals" program - $297'
        },
        {
          id: 'secondary_offers',
          sectionId: 'expertise_areas',
          questionNumber: 12,
          questionCategory: 'OFFER',
          question: 'Other offers? (Free lead magnet, low-ticket, high-ticket)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Free 7-day challenge, $27 mini-course, $2000 1:1 coaching'
        },
        {
          id: 'expertise_topics',
          sectionId: 'expertise_areas',
          questionNumber: 13,
          questionCategory: 'OFFER',
          question: 'What topics are you an expert in? (List 5-10)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Stress reduction, desk yoga, breathing techniques, habit formation, nervous system regulation'
        }
      ]
    },
    {
      id: 'brand_personality',
      title: 'Brand Personality',
      description: 'How you sound and show up',
      contextLevel: 'build_strategy',
      order: 4,
      isOptional: false,
      questions: [
        {
          id: 'brand_personality',
          sectionId: 'brand_personality',
          questionNumber: 14,
          questionCategory: 'BRAND',
          question: 'If your brand were a person, how would you describe them?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Warm, knowledgeable friend who makes things simple. Encouraging but not pushy.'
        },
        {
          id: 'brand_tone',
          sectionId: 'brand_personality',
          questionNumber: 15,
          questionCategory: 'BRAND',
          question: 'What tone should your content use?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., Conversational, authoritative but accessible, slightly witty'
        },
        {
          id: 'words_to_use',
          sectionId: 'brand_personality',
          questionNumber: 16,
          questionCategory: 'BRAND',
          question: 'Words/phrases you LOVE to use?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'build_strategy',
          placeholder: 'e.g., "Simple," "sustainable," "real life," "bite-sized"'
        }
      ]
    }
  ],

  deep_context: [
    {
      id: 'business_foundation',
      title: 'Business Foundation',
      description: 'Complete business context',
      contextLevel: 'deep_context',
      order: 1,
      isOptional: false,
      questions: [
        {
          id: 'business_name',
          sectionId: 'business_foundation',
          questionNumber: 1,
          questionCategory: 'BUSINESS',
          question: 'What is your business name?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Maya\'s Yoga Studio'
        },
        {
          id: 'business_location',
          sectionId: 'business_foundation',
          questionNumber: 2,
          questionCategory: 'BUSINESS',
          question: 'Where is your business located? (Full address optional)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Playa del Carmen, Quintana Roo, Mexico'
        },
        {
          id: 'business_website',
          sectionId: 'business_foundation',
          questionNumber: 3,
          questionCategory: 'BUSINESS',
          question: 'What is your website URL?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'https://yourwebsite.com'
        },
        {
          id: 'social_urls',
          sectionId: 'business_foundation',
          questionNumber: 4,
          questionCategory: 'BUSINESS',
          question: 'Social media URLs (Facebook, Instagram, LinkedIn, TikTok)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Paste URLs, one per line'
        },
        {
          id: 'what_you_do',
          sectionId: 'business_foundation',
          questionNumber: 5,
          questionCategory: 'BUSINESS',
          question: 'What does your business do? (Full description)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Full description of services, approach, methodology...'
        },
        {
          id: 'industry',
          sectionId: 'business_foundation',
          questionNumber: 6,
          questionCategory: 'BUSINESS',
          question: 'What industry/niche are you in?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Online wellness education for corporate professionals'
        },
        {
          id: 'years_in_business',
          sectionId: 'business_foundation',
          questionNumber: 7,
          questionCategory: 'BUSINESS',
          question: 'How many years have you been in business?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., 3 years'
        },
        {
          id: 'team_size',
          sectionId: 'business_foundation',
          questionNumber: 8,
          questionCategory: 'BUSINESS',
          question: 'Team size (including contractors)?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Just me + 1 VA'
        }
      ]
    },
    {
      id: 'customer_deep_dive',
      title: 'Customer Deep Dive',
      description: 'Comprehensive customer understanding',
      contextLevel: 'deep_context',
      order: 2,
      isOptional: false,
      questions: [
        {
          id: 'target_audience_detailed',
          sectionId: 'customer_deep_dive',
          questionNumber: 9,
          questionCategory: 'CUSTOMER',
          question: 'Describe your ideal customer in full detail (demographics, psychographics, lifestyle)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Age, gender, income, job, family, values, fears, aspirations, daily routine...'
        },
        {
          id: 'main_problem',
          sectionId: 'customer_deep_dive',
          questionNumber: 10,
          questionCategory: 'CUSTOMER',
          question: 'What is their #1 pressing problem? (The one keeping them up at night)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Be specific - not just "stress" but "waking at 3am anxious about tomorrow\'s presentation"'
        },
        {
          id: 'main_desire',
          sectionId: 'customer_deep_dive',
          questionNumber: 11,
          questionCategory: 'CUSTOMER',
          question: 'What is their #1 desired transformation?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'The specific outcome they\'d pay anything for'
        },
        {
          id: 'common_questions',
          sectionId: 'customer_deep_dive',
          questionNumber: 12,
          questionCategory: 'CUSTOMER',
          question: 'Top 5-10 questions they ask before buying?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'List every question you hear repeatedly'
        },
        {
          id: 'common_objections',
          sectionId: 'customer_deep_dive',
          questionNumber: 13,
          questionCategory: 'CUSTOMER',
          question: 'All objections to buying? (Price, time, trust, self-doubt, etc.)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Every reason they say "not now" or "not me"'
        },
        {
          id: 'where_they_hang_out',
          sectionId: 'customer_deep_dive',
          questionNumber: 14,
          questionCategory: 'CUSTOMER',
          question: 'Where do they spend time online? (Platforms, groups, influencers, podcasts)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Instagram, LinkedIn, specific Facebook groups, podcasts they listen to...'
        },
        {
          id: 'buying_triggers',
          sectionId: 'customer_deep_dive',
          questionNumber: 15,
          questionCategory: 'CUSTOMER',
          question: 'What triggers them to finally buy? (Life events, pain thresholds, seasons)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., New Year, burnout diagnosis, birthday milestone, job change'
        }
      ]
    },
    {
      id: 'offers_pricing',
      title: 'Offers & Pricing',
      description: 'Complete offer ladder',
      contextLevel: 'deep_context',
      order: 3,
      isOptional: false,
      questions: [
        {
          id: 'primary_offer',
          sectionId: 'offers_pricing',
          questionNumber: 16,
          questionCategory: 'OFFER',
          question: 'Main paid offer - name, price, what\'s included, duration',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., "Yoga for Busy Professionals" - 8 weeks - $297 - 16 video classes + workbook + community'
        },
        {
          id: 'secondary_offers',
          sectionId: 'offers_pricing',
          questionNumber: 17,
          questionCategory: 'OFFER',
          question: 'Full offer ladder (free → low → mid → high ticket)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Free: 7-day challenge | $27: Desk Yoga Mini | $297: 8-week | $2000: 1:1 coaching'
        },
        {
          id: 'pricing_rationale',
          sectionId: 'offers_pricing',
          questionNumber: 18,
          questionCategory: 'OFFER',
          question: 'Why these prices? (Cost-based, value-based, market-based?)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Value-based: saves 10hrs/week = $500+ value at $50/hr'
        },
        {
          id: 'payment_options',
          sectionId: 'offers_pricing',
          questionNumber: 19,
          questionCategory: 'OFFER',
          question: 'Payment options? (Payment plans, subscriptions, one-time)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Pay in full or 3 payments of $109'
        }
      ]
    },
    {
      id: 'brand_voice',
      title: 'Brand Voice & Messaging',
      description: 'How you communicate',
      contextLevel: 'deep_context',
      order: 4,
      isOptional: false,
      questions: [
        {
          id: 'brand_personality',
          sectionId: 'brand_voice',
          questionNumber: 20,
          questionCategory: 'BRAND',
          question: 'If your brand were a person, describe them fully',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Personality traits, values, quirks, how they make people feel...'
        },
        {
          id: 'brand_tone',
          sectionId: 'brand_voice',
          questionNumber: 21,
          questionCategory: 'BRAND',
          question: 'Tone of voice guidelines (formal/casual, serious/playful, expert/friend)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Warm expert - like a knowledgeable friend. Never corporate. Use contractions.'
        },
        {
          id: 'words_to_use',
          sectionId: 'brand_voice',
          questionNumber: 22,
          questionCategory: 'BRAND',
          question: 'Words/phrases you LOVE and use often',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., "Simple," "sustainable," "real life," "bite-sized," "permission to rest"'
        },
        {
          id: 'words_to_avoid',
          sectionId: 'brand_voice',
          questionNumber: 23,
          questionCategory: 'BRAND',
          question: 'Words/phrases you NEVER use',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., "Crush it," "hustle," "grind," "should," "must," overly medical terms'
        },
        {
          id: 'brand_values',
          sectionId: 'brand_voice',
          questionNumber: 24,
          questionCategory: 'BRAND',
          question: 'Top 3-5 brand values that guide everything',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Simplicity, Sustainability, Compassion, Evidence-based, Accessibility'
        },
        {
          id: 'brand_story',
          sectionId: 'brand_voice',
          questionNumber: 25,
          questionCategory: 'BRAND',
          question: 'Your origin story - why did you start this business?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'The personal moment that led to this work...'
        }
      ]
    },
    {
      id: 'content_strategy',
      title: 'Content Strategy & Boundaries',
      description: 'What you will and won\'t create',
      contextLevel: 'deep_context',
      order: 5,
      isOptional: false,
      questions: [
        {
          id: 'content_pillars',
          sectionId: 'content_strategy',
          questionNumber: 26,
          questionCategory: 'CONTENT',
          question: 'Your 3-5 content pillars (topics you rotate through)',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., 1) Stress science 2) Desk-friendly movement 3) Nervous system regulation 4) Real student stories 5) Myth-busting'
        },
        {
          id: 'content_boundaries',
          sectionId: 'content_strategy',
          questionNumber: 27,
          questionCategory: 'CONTENT',
          question: 'Topics you will NOT cover (boundaries)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., No medical advice, no diet culture, no spiritual bypassing, no before/after photos'
        },
        {
          id: 'preferred_formats',
          sectionId: 'content_strategy',
          questionNumber: 28,
          questionCategory: 'CONTENT',
          question: 'Preferred content formats? (Reels, carousels, stories, lives, written)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Love reels for tips, carousels for education, stories for behind-scenes'
        },
        {
          id: 'posting_frequency',
          sectionId: 'content_strategy',
          questionNumber: 29,
          questionCategory: 'CONTENT',
          question: 'Ideal posting frequency per platform?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., IG: 5x/week feed + daily stories | LI: 2x/week | TikTok: 3x/week'
        },
        {
          id: 'content_inspiration',
          sectionId: 'content_strategy',
          questionNumber: 30,
          questionCategory: 'CONTENT',
          question: 'Accounts/creators whose content style you admire?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Tag 3-5 accounts + what you like about each'
        }
      ]
    },
    {
      id: 'proof_credibility',
      title: 'Proof & Credibility',
      description: 'Evidence that builds trust',
      contextLevel: 'deep_context',
      order: 6,
      isOptional: true,
      questions: [
        {
          id: 'testimonials',
          sectionId: 'proof_credibility',
          questionNumber: 31,
          questionCategory: 'COMPETITION',
          question: 'Best client testimonials (paste 3-5 with results)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: '"Maya\'s program eliminated my chronic back pain in 3 weeks!" - Sarah, Marketing Director'
        },
        {
          id: 'case_studies',
          sectionId: 'proof_credibility',
          questionNumber: 32,
          questionCategory: 'COMPETITION',
          question: 'Detailed case studies (client situation → your solution → measurable result)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'Before/after with specific metrics'
        },
        {
          id: 'credentials',
          sectionId: 'proof_credibility',
          questionNumber: 33,
          questionCategory: 'COMPETITION',
          question: 'Certifications, degrees, awards, media features, notable clients',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., E-RYT 500, featured in Well+Good, worked with Google/Spotify employees'
        },
        {
          id: 'social_proof_numbers',
          sectionId: 'proof_credibility',
          questionNumber: 34,
          questionCategory: 'COMPETITION',
          question: 'Impressive numbers? (Clients served, hours taught, countries reached, etc.)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., 2,400+ students, 15 countries, 50,000+ hours taught'
        },
        {
          id: 'competitive_advantage',
          sectionId: 'proof_credibility',
          questionNumber: 35,
          questionCategory: 'COMPETITION',
          question: 'What makes you DIFFERENT from competitors? (Your unique method/approach)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Only program combining nervous system science + 10-min daily format for corporate professionals'
        }
      ]
    },
    {
      id: 'conversion_setup',
      title: 'Conversion Setup',
      description: 'How you turn followers into clients',
      contextLevel: 'deep_context',
      order: 7,
      isOptional: true,
      questions: [
        {
          id: 'primary_cta',
          sectionId: 'conversion_setup',
          questionNumber: 36,
          questionCategory: 'CONVERSION',
          question: 'Primary CTA (the ONE action you want most)?',
          response: '',
          required: true,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Book free discovery call / Join free 7-day challenge / Download guide'
        },
        {
          id: 'secondary_cta',
          sectionId: 'conversion_setup',
          questionNumber: 37,
          questionCategory: 'CONVERSION',
          question: 'Secondary CTAs for different funnel stages?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Follow → Save post → DM "GUIDE" → Free challenge → Paid program'
        },
        {
          id: 'lead_magnet',
          sectionId: 'conversion_setup',
          questionNumber: 38,
          questionCategory: 'CONVERSION',
          question: 'Lead magnet details (what, format, delivery method)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., "5-Minute Desk Reset" PDF + video, delivered via ManyChat/email'
        },
        {
          id: 'sales_process',
          sectionId: 'conversion_setup',
          questionNumber: 39,
          questionCategory: 'CONVERSION',
          question: 'Sales process after lead magnet? (Email sequence, DM conversation, call, webinar)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., 5-email nurture → DM conversation → 15-min call → Proposal'
        },
        {
          id: 'booking_link',
          sectionId: 'conversion_setup',
          questionNumber: 40,
          questionCategory: 'CONVERSION',
          question: 'Booking/calendar link (Calendly, Acuity, etc.)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'https://calendly.com/yourname/discovery'
        }
      ]
    },
    {
      id: 'ai_accuracy_rules',
      title: 'AI Accuracy Rules',
      description: 'Guardrails for AI-generated content',
      contextLevel: 'deep_context',
      order: 8,
      isOptional: true,
      questions: [
        {
          id: 'never_claim',
          sectionId: 'ai_accuracy_rules',
          questionNumber: 41,
          questionCategory: 'CONTENT',
          question: 'What should AI NEVER claim/promise on your behalf?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., "Cure anxiety," "guaranteed results," "medical advice," "lose 10lbs in a week"'
        },
        {
          id: 'must_include',
          sectionId: 'ai_accuracy_rules',
          questionNumber: 42,
          questionCategory: 'CONTENT',
          question: 'What must AI ALWAYS include? (Disclaimers, specific phrasing, legal)',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., "Not medical advice. Consult your doctor." + Always use "supports" not "fixes"'
        },
        {
          id: 'technical_accuracy',
          sectionId: 'ai_accuracy_rules',
          questionNumber: 43,
          questionCategory: 'CONTENT',
          question: 'Technical details AI often gets wrong about your field?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., Vagus nerve specifics, cortisol timing, yoga anatomy cues, breath counts'
        },
        {
          id: 'compliance_notes',
          sectionId: 'ai_accuracy_rules',
          questionNumber: 44,
          questionCategory: 'CONTENT',
          question: 'Industry compliance/legal requirements for content?',
          response: '',
          required: false,
          completed: false,
          contextLevel: 'deep_context',
          placeholder: 'e.g., HIPAA, FTC disclosure, yoga alliance scope of practice, financial disclaimers'
        }
      ]
    }
  ]
};

// Helper to get flat question list for a level
export function getQuestionsForLevel(level: QuestionnaireContextLevel): QuestionnaireQuestion[] {
  const sections = QUESTIONNAIRE_SECTIONS[level];
  return sections.flatMap(section => section.questions);
}

// Helper to get question counts
export function getQuestionCounts(): Record<QuestionnaireContextLevel, { total: number; required: number }> {
  const result: Record<QuestionnaireContextLevel, { total: number; required: number }> = {
    quick_start: { total: 0, required: 0 },
    build_strategy: { total: 0, required: 0 },
    deep_context: { total: 0, required: 0 }
  };

  (Object.keys(QUESTIONNAIRE_SECTIONS) as QuestionnaireContextLevel[]).forEach(level => {
    const questions = getQuestionsForLevel(level);
    result[level] = {
      total: questions.length,
      required: questions.filter(q => q.required).length
    };
  });

  return result;
}

// Level metadata for UI
export const LEVEL_METADATA = {
  quick_start: {
    label: 'Quick Start',
    description: '7 questions. Get your 30-day content plan in minutes.',
    questionCount: 7,
    requiredCount: 7,
    estimatedTimeMinutes: 5,
    isRecommended: false,
    sections: QUESTIONNAIRE_SECTIONS.quick_start.length
  },
  build_strategy: {
    label: 'Build My Strategy',
    description: '~16 questions. Give the AI enough context to create content that\'s genuinely specific to your business.',
    questionCount: 16,
    requiredCount: 16,
    estimatedTimeMinutes: 15,
    isRecommended: true,
    sections: QUESTIONNAIRE_SECTIONS.build_strategy.length
  },
  deep_context: {
    label: 'Deep Context',
    description: '40+ optional questions. Maximum context for highly personalised content.',
    questionCount: 44,
    requiredCount: 25, // First 5 sections required, last 3 optional
    estimatedTimeMinutes: 30,
    isRecommended: false,
    sections: QUESTIONNAIRE_SECTIONS.deep_context.length
  }
} as const;