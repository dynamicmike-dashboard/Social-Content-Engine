import { ContentPost, StrategyType, Platform } from '../types';

// Demo Mode Indicator
export const IS_DEMO_MODE = true; 

const MOCK_PLATFORM_CONTENT = {
    hook: "Most local businesses make this mistake...",
    caption: "Is your business missing out on local leads? Check out our latest tip.",
    ctaType: 'KEYWORD' as const,
    ctaValue: 'MENU'
};

const MOCK_POSTS: ContentPost[] = Array.from({ length: 30 }, (_, i) => {
  const strategies: StrategyType[] = ['EDUCATE', 'ENGAGE', 'AUTHORITY', 'STORY', 'PROMOTE'];
  const strategy = strategies[i % strategies.length];
  const date = new Date(2026, 9, i + 1).toISOString();
  
  return {
    id: `post-${i + 1}`,
    date,
    strategy,
    title: `Sample Post ${i + 1}: ${strategy} Focus`,
    format: i % 4 === 0 ? 'VIDEO' : i % 4 === 1 ? 'IMAGE' : 'CAROUSEL',
    status: 'DRAFT',
    platformContent: {
        FACEBOOK: MOCK_PLATFORM_CONTENT,
        INSTAGRAM: MOCK_PLATFORM_CONTENT,
        LINKEDIN: MOCK_PLATFORM_CONTENT,
        TIKTOK: { ...MOCK_PLATFORM_CONTENT, hook: "Short TikTok hook..." }
    },
    alternativeHooks: ["Curiosity hook", "Problem hook", "Direct benefit hook"],
    visualConcept: 'Relaxing spa aesthetic',
  };
});

export const dataService = {
  getPosts: async (clientId?: string): Promise<ContentPost[]> => {
    if (IS_DEMO_MODE) {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_POSTS), 300));
    }
    
    if (!clientId) return [];
    // Here we would implement real Teable API calls:
    // GET /table/tblza9csBxLaPAkRkQS/record?filter...
    return []; 
  },
  
  updatePostStatus: async (id: string, status: ContentPost['status']): Promise<ContentPost> => {
    // Implement with Teable API PATCH
    throw new Error('Not implemented');
  }
};
