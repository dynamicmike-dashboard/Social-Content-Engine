import { ContentPost, StrategyName, PlatformContent, ContentFormat, ContentStatus } from '../types';
import { WorkshopContentContext, transformQuestionnaireToContext, getTopicsForStrategy } from './workshopContentContext';

const STRATEGY_ORDER: StrategyName[] = ['EDUCATE', 'ENGAGE', 'AUTHORITY', 'STORY', 'PROMOTE'];
const FORMATS: ContentFormat[] = ['IMAGE', 'CAROUSEL', 'SHORT_VIDEO', 'REEL', 'TEXT', 'STORY', 'POLL', 'QUESTION'];

// Get workshop content context from localStorage (if available)
export function getWorkshopContext(): WorkshopContentContext | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedResponses = localStorage.getItem('questionnaireResponses');
    const savedLevel = localStorage.getItem('questionnaireLevel');
    
    if (savedResponses && savedLevel === 'build_strategy') {
      const responses = JSON.parse(savedResponses);
      return transformQuestionnaireToContext(responses);
    }
  } catch (e) {
    console.warn('Failed to load workshop context:', e);
  }
  return null;
}

// Generate personalized platform content based on workshop context
function generatePersonalizedPlatformContent(
  strategy: StrategyName, 
  _day: number, 
  topic: string, 
  context: WorkshopContentContext
): Record<string, PlatformContent> {
  const baseTopic = topic.toLowerCase();
  const eventName = context.eventName;
  const eventLocationShort = context.eventLocation.split(',')[0];
  
  // Base platform content templates with personalization
  const platformContent: Record<string, PlatformContent> = {
    FACEBOOK: {
      hook: `🌟 Discover how ${topic} transforms your ${eventName} experience — Read our latest insights!`,
      caption: `At ${eventName}, we believe ${baseTopic} is essential for an epic tournament experience. Here's why...\n\nWe've helped hundreds of players achieve amazing results by focusing on what matters most. Want to know our secret? Link in bio! 👇\n\n#${eventName.replace(/\s+/g, '')} #BeachVolleyball #PlayaDelCarmen #TournamentLife`,
      cta: 'Read Full Article',
      hashtags: `#${eventName.replace(/\s+/g, '')} #BeachVolleyball #PlayaDelCarmen #TournamentLife`,
      ctaType: 'DIRECT_LINK',
      ctaValue: 'https://playabeachvolleyball.com/article',
      ctaReason: 'Directs traffic to tournament website for deeper engagement and registration',
      visualConcept: `Professional lifestyle photo showing ${baseTopic} in action at ${eventLocationShort}, warm Caribbean lighting, diverse players competing`,
      visualDimensions: '1200x630 (link share) / 1080x1080 (feed)',
      format: 'IMAGE',
      platformNotes: 'Optimized for link sharing; use engaging thumbnail; first 125 chars critical',
      alternativeHooks: []
    },
    INSTAGRAM: {
      hook: `✨ ${topic} changed everything for our tournament experience!`,
      caption: `Swipe to see the transformation 👉 \n\n${baseTopic} isn't just a strategy — it's a mindset shift. We've seen players go from nervous first-timers to tournament champions using this exact approach.\n\nSave this post for later! 💾\n\n#${eventName.replace(/\s+/g, '')} #BeachVolleyballLife #PlayaDelCarmen #TournamentVibes #BeachLife #VolleyballCommunity`,
      cta: 'Save for Later',
      hashtags: `#${eventName.replace(/\s+/g, '')} #BeachVolleyballLife #PlayaDelCarmen #TournamentVibes #BeachLife #VolleyballCommunity #SportsEvents`,
      ctaType: 'KEYWORD',
      ctaValue: 'SAVE',
      ctaReason: 'Triggers DM automation with saved content delivery',
      visualConcept: `Carousel: 1) Before/After player journey 2) Key tournament statistic 3) Player quote 3) Step-by-step guide 4) CTA to register`,
      visualDimensions: '1080x1080 (feed) / 1080x1920 (reels)',
      format: 'CAROUSEL',
      platformNotes: 'Carousel format for swipe-through; save CTA triggers automation; use 30+ hashtags in first comment',
      alternativeHooks: []
    },
    LINKEDIN: {
      hook: `Industry Insight: Why ${topic} matters more than ever for sports tournament growth`,
      caption: `In today's competitive sports event landscape, ${baseTopic} isn't just an option—it's a necessity. Our research shows tournaments that prioritize this see 40% better player retention.\n\nHere's our 3-step framework:\n1️⃣ Identify the player need\n2️⃣ Build the tournament experience\n3️⃣ Measure & iterate\n\nWhat's your biggest challenge with ${baseTopic}? Comment below 👇\n\n#SportsEvents #EventManagement #BeachVolleyball #SportsBusiness #TournamentOrganization`,
      cta: 'Connect with us',
      hashtags: '#SportsEvents #EventManagement #BeachVolleyball #SportsBusiness #TournamentOrganization',
      ctaType: 'CONVERSATION',
      ctaValue: 'Comment your biggest challenge for a personalized reply',
      ctaReason: 'Drives comments to boost algorithm reach; conversation starter',
      visualConcept: `Professional tournament director photo + data visualization graphic showing 40% player retention improvement`,
      visualDimensions: '1200x627 (article) / 1080x1080 (post)',
      format: 'IMAGE',
      platformNotes: 'Native document/article format performs best; tag relevant companies; 3-5 hashtags max',
      alternativeHooks: []
    },
    TWITTER: {
      hook: `🧵 Thread: The truth about ${baseTopic} that nobody tells tournament organizers`,
      caption: `1/ ${baseTopic} is misunderstood by 90% of sports event organizers.\n\n2/ Most think it's about [common misconception]. It's actually about [truth].\n\n3/ Here's the framework we use for ${eventName}:\n\n4/ Step 1: [Action]\n5/ Step 2: [Action]\n6/ Step 3: [Action]\n\n7/ Results: Player satisfaction went from 60% to 95% in 2 years.\n\n8/ Want the template? Retweet + Follow 👇\n\n#SportsEvents #BeachVolleyball #EventManagement #Thread`,
      cta: 'Retweet for template',
      hashtags: '#SportsEvents #BeachVolleyball #EventManagement #Thread',
      ctaType: 'ENGAGEMENT',
      ctaValue: 'Retweet + Follow for DM template',
      ctaReason: 'Viral mechanic: retweet amplifies reach, follow builds audience',
      visualConcept: `Thread header graphic with step numbers; each tweet can have supporting visual`,
      visualDimensions: '1600x900 (thread header) / 1200x675 (per tweet)',
      format: 'TEXT',
      platformNotes: 'Thread format; pin first tweet; engage with replies in first hour',
      alternativeHooks: []
    },
    TIKTOK: {
      hook: `POV: You finally cracked the code on ${baseTopic} 🤯`,
      caption: `Stop overcomplicating ${baseTopic}! Here's the simple 3-step system that changed everything for ${eventName} players:\n\n1️⃣ [Step 1]\n2️⃣ [Step 2]  \n3️⃣ [Step 3]\n\nThe results speak for themselves 📈\n\n#${eventName.replace(/\s+/g, '')} #BeachVolleyball #PlayaDelCarmen #TournamentTips #SportsTips #BeachLife`,
      cta: 'Follow for Part 2!',
      hashtags: `#${eventName.replace(/\s+/g, '')} #BeachVolleyball #PlayaDelCarmen #TournamentTips #SportsTips #BeachLife #MexicoEvents`,
      ctaType: 'ENGAGEMENT',
      ctaValue: 'Follow for more beach volleyball tournament content',
      ctaReason: 'Follow CTA builds audience for future content distribution',
      visualConcept: `Fast-paced: hook (0-3s) → problem (3-5s) → solution (5-15s) → results (15-20s) → CTA (20-30s)`,
      visualDimensions: '1080x1920 (9:16 vertical)',
      format: 'SHORT_VIDEO',
      platformNotes: 'Vertical video; hook in first 3 seconds; trending beach audio; captions burned in; post 1-3pm or 7-9pm',
      alternativeHooks: []
    }
  };
  
  // Strategy-specific adjustments with personalization
  if (strategy === 'PROMOTE') {
    platformContent.FACEBOOK.cta = 'Register for Tournament';
    platformContent.FACEBOOK.ctaType = 'DIRECT_LINK';
    platformContent.FACEBOOK.ctaValue = 'https://playabeachvolleyball.com/register';
    platformContent.FACEBOOK.ctaReason = 'Direct registration link for high-intent players';
    
    platformContent.INSTAGRAM.cta = 'DM us "REGISTER"';
    platformContent.INSTAGRAM.ctaType = 'KEYWORD';
    platformContent.INSTAGRAM.ctaValue = 'REGISTER';
    platformContent.INSTAGRAM.ctaReason = 'Triggers registration link automation via DM';
    
    platformContent.LINKEDIN.cta = 'Register Your Team';
    platformContent.LINKEDIN.ctaType = 'DIRECT_LINK';
    platformContent.LINKEDIN.ctaValue = 'https://playabeachvolleyball.com/register';
    platformContent.LINKEDIN.ctaReason = 'Professional registration link for team captains';
    
    platformContent.TWITTER.cta = 'Reply "TEAM" for details';
    platformContent.TWITTER.ctaType = 'KEYWORD';
    platformContent.TWITTER.ctaValue = 'TEAM';
    platformContent.TWITTER.ctaReason = 'Triggers DM with registration link';
    
    platformContent.TIKTOK.cta = 'Link in bio to register your team';
    platformContent.TIKTOK.ctaType = 'DIRECT_LINK';
    platformContent.TIKTOK.ctaValue = 'https://playabeachvolleyball.com/register';
    platformContent.TIKTOK.ctaReason = 'Bio link is only clickable CTA on TikTok';
  } else if (strategy === 'ENGAGE') {
    platformContent.FACEBOOK.cta = 'Share your tournament story!';
    platformContent.FACEBOOK.ctaType = 'KEYWORD';
    platformContent.FACEBOOK.ctaValue = 'STORY';
    platformContent.FACEBOOK.ctaReason = 'Triggers automated response with discussion prompt';
    
    platformContent.INSTAGRAM.cta = 'Vote for your favorite moment!';
    platformContent.INSTAGRAM.ctaType = 'KEYWORD';
    platformContent.INSTAGRAM.ctaValue = 'VOTE';
    platformContent.INSTAGRAM.ctaReason = 'Triggers poll results via DM automation';
    
    platformContent.LINKEDIN.cta = 'Comment your tournament experience';
    platformContent.LINKEDIN.ctaType = 'CONVERSATION';
    platformContent.LINKEDIN.ctaValue = 'Share your favorite tournament memory';
    platformContent.LINKEDIN.ctaReason = 'Drives meaningful comments for algorithm boost';
    
    platformContent.TWITTER.cta = 'Retweet if you love beach volleyball';
    platformContent.TWITTER.ctaType = 'ENGAGEMENT';
    platformContent.TWITTER.ctaValue = 'RT + Follow for tournament updates';
    platformContent.TWITTER.ctaReason = 'Viral mechanic amplifies reach';
    
    platformContent.TIKTOK.cta = 'Comment your favorite tournament moment!';
    platformContent.TIKTOK.ctaType = 'ENGAGEMENT';
    platformContent.TIKTOK.ctaValue = 'Comment for personalized tip';
    platformContent.TIKTOK.ctaReason = 'Comments drive TikTok algorithm distribution';
  }
  
  // Apply prohibited topics filter
  const prohibitedTerms = context.prohibitedTopics.toLowerCase().split(',').map(t => t.trim()).filter(t => t.length > 0);
  
  // Check if any content violates prohibited topics
  Object.values(platformContent).forEach(content => {
    const fullContent = `${content.hook} ${content.caption} ${content.cta} ${content.hashtags} ${content.visualConcept}`.toLowerCase();
    const hasProhibited = prohibitedTerms.some(term => fullContent.includes(term));
    if (hasProhibited) {
      console.warn(`Prohibited topic detected in ${strategy} content, content may need review`);
    }
  });
  
  return platformContent;
}

function getStrategyForDay(day: number): StrategyName {
  const distribution = { EDUCATE: 8, ENGAGE: 6, AUTHORITY: 5, STORY: 5, PROMOTE: 6 };
  const rotation: StrategyName[] = [];
  STRATEGY_ORDER.forEach(s => {
    for (let i = 0; i < distribution[s]; i++) rotation.push(s);
  });
  for (let i = rotation.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rotation[i], rotation[j]] = [rotation[j], rotation[i]];
  }
  const result: StrategyName[] = [];
  const remaining = [...rotation];
  while (remaining.length > 0) {
    let placed = false;
    for (let i = 0; i < remaining.length; i++) {
      const strategy = remaining[i];
      const lastStrategy = result[result.length - 1];
      if (lastStrategy === 'PROMOTE' && strategy === 'PROMOTE') continue;
      if (lastStrategy === strategy && remaining.length > 1) continue;
      result.push(strategy);
      remaining.splice(i, 1);
      placed = true;
      break;
    }
    if (!placed && remaining.length > 0) result.push(remaining.shift()!);
  }
  return result[day % result.length];
}

// Generate personalized MOCK_POSTS based on workshop context
export function generateMockPosts(): ContentPost[] {
  const context = getWorkshopContext();
  const defaultContext = context || transformQuestionnaireToContext({});
  
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const strategy = getStrategyForDay(i);
    const strategyTopics = getTopicsForStrategy(strategy, defaultContext);
    const topic = strategyTopics[i % strategyTopics.length] || `Day ${day} ${strategy} content`;
    const date = new Date(2026, 9, day).toISOString().split('T')[0];
    
    // Get platform content with personalization
    const platformContent = generatePersonalizedPlatformContent(strategy, day, topic, defaultContext);
    
    // Generate hook variations for the primary platform (Facebook)
    const primary = platformContent.FACEBOOK;
    const hookVariations = [
      { id: `hook-${strategy}-FACEBOOK-curiosity`, text: `The secret to ${topic.toLowerCase()} that most ${defaultContext.targetAudience.split(' ').slice(0,2).join(' ')} miss`, approach: 'curiosity', isPrimary: true, reason: 'Opens a curiosity gap that drives clicks and saves' },
      { id: `hook-${strategy}-FACEBOOK-problem`, text: `Struggling with ${topic.toLowerCase()}? You're not alone — here's the fix`, approach: 'problem', isPrimary: false, reason: 'Leads with the pain point to immediately resonate' },
      { id: `hook-${strategy}-FACEBOOK-contrarian`, text: `Why everything you know about ${topic.toLowerCase()} might be wrong`, approach: 'contrarian', isPrimary: false, reason: 'Challenges assumptions to stop the scroll' },
      { id: `hook-${strategy}-FACEBOOK-question`, text: `What if ${topic.toLowerCase()} could be 10x easier?`, approach: 'question', isPrimary: false, reason: 'Invites mental engagement and comments' }
    ];
    
    let status: ContentStatus;
    if (day <= 5) status = 'APPROVED';
    else if (day <= 10) status = 'CLIENT_REVIEW';
    else if (day <= 12) status = 'CHANGES_REQUESTED';
    else if (day <= 15) status = 'SCHEDULED';
    else if (day <= 18) status = 'PUBLISHED';
    else if (day <= 20) status = 'REJECTED';
    else if (day <= 25) status = 'GENERATED';
    else status = 'DRAFT';
    
    return {
      id: `post-${day}`,
      clientId: 'demo-client-001',
      date,
      scheduledTime: new Date(2026, 9, day, 10, 0).toISOString(),
      platform: 'FACEBOOK',
      strategyId: `strategy-${strategy}`,
      strategyName: strategy,
      strategyColor: '#3B82F6',
      format: FORMATS[day % FORMATS.length],
      topic,
      objective: `Drive ${strategy.toLowerCase()} engagement for ${defaultContext.eventName}`,
      hook: primary.hook,
      alternativeHooks: hookVariations.map(h => h.text),
      caption: primary.caption,
      shortCaption: primary.caption.substring(0, 120) + '...',
      cta: primary.cta,
      ctaType: primary.ctaType,
      ctaValue: primary.ctaValue,
      hashtags: primary.hashtags,
      imagePrompt: `Professional photo showing ${topic.toLowerCase()}, ${defaultContext.eventLocation}, natural lighting, beach volleyball atmosphere`,
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + day}?w=800`,
      videoConcept: `Short video explaining ${topic.toLowerCase()} with animated graphics`,
      videoScript: `Hook: ${primary.hook}\n\nBody: ${primary.caption}\n\nCTA: ${primary.cta}`,
      firstComment: 'First! Thanks for sharing this valuable insight 🙌',
      aiInstructions: `Use ${defaultContext.brandTone} tone. ${defaultContext.accuracyRequirements}`,
      status,
      clientNotes: status === 'CHANGES_REQUESTED' ? 'Please make the tone more conversational' : undefined,
      revisionRequest: status === 'CHANGES_REQUESTED' ? 'Make it more conversational and less formal' : undefined,
      approvedAt: status === 'APPROVED' || status === 'SCHEDULED' || status === 'PUBLISHED' ? new Date(2026, 9, day - 1, 14, 0).toISOString() : undefined,
      publishedAt: status === 'PUBLISHED' ? new Date(2026, 9, day, 10, 0).toISOString() : undefined,
      externalPostId: status === 'PUBLISHED' ? `fb_${Date.now()}_${day}` : undefined,
      createdAt: new Date(2026, 9, 1, 9, 0).toISOString(),
      updatedAt: new Date(2026, 9, day, 9, 0).toISOString(),
      platformContent
    };
  });
}

const MOCK_POSTS: ContentPost[] = generateMockPosts();

MOCK_POSTS.forEach(post => {
  const strategyColors: Record<string, string> = {
    EDUCATE: '#3B82F6',
    ENGAGE: '#10B981',
    AUTHORITY: '#8B5CF6',
    STORY: '#F97316',
    PROMOTE: '#EC4899'
  };
  post.strategyColor = strategyColors[post.strategyName];
});

// Demo mode flag - can be toggled
let demoMode = true;

export function setDemoMode(enabled: boolean) {
  demoMode = enabled;
}

export function isDemoModeEnabled(): boolean {
  return demoMode;
}

// API client for live mode
const API_BASE = '/api';

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const dataService = {
  // Demo mode toggle
  setDemoMode,
  isDemoMode: isDemoModeEnabled,

  // Posts
  getPosts: async (): Promise<ContentPost[]> => {
    if (demoMode) {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_POSTS), 300));
    }
    return apiRequest<ContentPost[]>('/calendar?month=2026-10');
  },
  
  getPost: async (id: string): Promise<ContentPost | null> => {
    if (demoMode) {
      return new Promise((resolve) => setTimeout(() => {
        const post = MOCK_POSTS.find(p => p.id === id);
        resolve(post || null);
      }, 100));
    }
    return apiRequest<ContentPost>(`/content/${id}`);
  },
  
  updatePostStatus: async (id: string, status: ContentStatus, notes?: string): Promise<ContentPost> => {
    if (demoMode) {
      return new Promise((resolve, reject) => setTimeout(() => {
        const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
        if (postIndex === -1) {
          reject(new Error('Post not found'));
          return;
        }
        const post = MOCK_POSTS[postIndex];
        post.status = status;
        post.updatedAt = new Date().toISOString();
        
        if (status === 'APPROVED') post.approvedAt = new Date().toISOString();
        if (status === 'PUBLISHED') post.publishedAt = new Date().toISOString();
        if (status === 'CHANGES_REQUESTED') post.revisionRequest = notes;
        if (notes) post.clientNotes = notes;
        
        resolve({ ...post });
      }, 200));
    }
    // For live mode, use specific endpoints
    const endpoints: Partial<Record<ContentStatus, string>> = {
      APPROVED: 'approve',
      REJECTED: 'reject',
      GENERATED: 'regenerate'
    };
    const endpoint = endpoints[status];
    if (endpoint) {
      return apiRequest<ContentPost>(`/content/${id}/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ reason: notes, revisionRequest: notes })
      });
    }
    throw new Error(`No live endpoint for status ${status}`);
  },
  
  updatePost: async (id: string, updates: Partial<ContentPost>): Promise<ContentPost> => {
    if (demoMode) {
      return new Promise((resolve, reject) => setTimeout(() => {
        const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
        if (postIndex === -1) {
          reject(new Error('Post not found'));
          return;
        }
        MOCK_POSTS[postIndex] = { ...MOCK_POSTS[postIndex], ...updates, updatedAt: new Date().toISOString() };
        resolve(MOCK_POSTS[postIndex]);
      }, 200));
    }
    return apiRequest<ContentPost>(`/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },
  
  deletePost: async (id: string): Promise<void> => {
    if (demoMode) {
      return new Promise((resolve, reject) => setTimeout(() => {
        const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
        if (postIndex === -1) {
          reject(new Error('Post not found'));
          return;
        }
        MOCK_POSTS.splice(postIndex, 1);
        resolve();
      }, 200));
    }
    // Would need DELETE endpoint
    throw new Error('Delete not implemented in live mode');
  },
  
  bulkUpdateStatus: async (ids: string[], status: ContentStatus): Promise<void> => {
    if (demoMode) {
      return new Promise((resolve) => setTimeout(() => {
        ids.forEach(id => {
          const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
          if (postIndex !== -1) {
            MOCK_POSTS[postIndex].status = status;
            MOCK_POSTS[postIndex].updatedAt = new Date().toISOString();
          }
        });
        resolve();
      }, 300));
    }
    throw new Error('Bulk update not implemented in live mode');
  },

  // Questionnaire
  getQuestionnaire: async () => {
    if (demoMode) {
      // Return demo questionnaire structure
      return {
        questions: [
          { id: '1', questionNumber: 1, questionCategory: 'BUSINESS', question: 'What is your business name, location, service area, and website?', response: '', required: true, completed: false },
          { id: '2', questionNumber: 2, questionCategory: 'BUSINESS', question: 'What does your business do, and who does it serve?', response: '', required: true, completed: false },
          // ... more questions
        ],
        progress: { completed: 0, total: 28, requiredCompleted: 0, requiredTotal: 28 },
        canSubmit: false
      };
    }
    return apiRequest<any>('/questionnaire');
  },
  
  saveQuestionnaireAnswer: async (responseId: string, response: string) => {
    if (demoMode) {
      return { id: responseId, response, completed: true, updatedAt: new Date().toISOString() };
    }
    return apiRequest<any>(`/questionnaire/${responseId}`, {
      method: 'PATCH',
      body: JSON.stringify({ response })
    });
  },
  
  submitQuestionnaire: async (month: string) => {
    if (demoMode) {
      // Simulate job creation
      return { jobId: `demo-job-${Date.now()}`, status: 'QUEUED', message: 'Demo: Generation job queued' };
    }
    return apiRequest<any>('/questionnaire/submit', {
      method: 'POST',
      body: JSON.stringify({ month })
    });
  },
  
  // Generation jobs
  getGenerationJob: async (jobId: string) => {
    if (demoMode) {
      return {
        jobId,
        status: 'SUCCEEDED',
        progress: { stage: 'complete', progress: 100, message: 'Demo complete', postsGenerated: 30, totalPosts: 30 }
      };
    }
    return apiRequest<any>(`/generation-jobs/${jobId}`);
  },
  
  // Client profile
  getClientProfile: async () => {
    if (demoMode) {
      return {
        businessName: 'Demo Business Co.',
        contactName: 'Demo Owner',
        email: 'demo@example.com',
        servicePackage: 'PRO',
        timeZone: 'America/Cancun',
        contentApprovalRequired: true
      };
    }
    return apiRequest<any>('/client/profile');
  },
  
  updateClientProfile: async (updates: Partial<any>) => {
    if (demoMode) {
      return { ...updates, updatedAt: new Date().toISOString() };
    }
    return apiRequest<any>('/client/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  generateMockPosts,
};