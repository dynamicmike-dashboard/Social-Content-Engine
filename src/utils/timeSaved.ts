import { TimeSavedConfig, TimeSavedResult, ContentPost } from '../types';

/**
 * Default time assumptions for content creation (in minutes)
 */
export const DEFAULT_TIME_CONFIG: TimeSavedConfig = {
  ideaGenerationMinutes: 15,
  writingMinutes: 30,
  designMinutes: 20,
  editingMinutes: 10,
  schedulingMinutes: 5,
  hourlyRateMXN: 500 // Default hourly rate in MXN
};

/**
 * Calculate time saved based on approved/published content and user configuration
 * 
 * IMPORTANT: This is an ESTIMATE based on assumptions, not actual measured time.
 * Only counts time for capabilities that are actually connected/implemented.
 * 
 * @param posts - All content posts for the period
 * @param config - User's time assumptions and hourly rate
 * @param capabilities - Which features are actually connected (scheduling, video, etc.)
 * @returns TimeSavedResult with breakdown and MXN value
 */
export function calculateTimeSaved(
  posts: ContentPost[],
  config: TimeSavedConfig = DEFAULT_TIME_CONFIG,
  capabilities: {
    schedulingConnected: boolean;
    videoGenerationConnected: boolean;
    imageGenerationConnected: boolean;
  } = { schedulingConnected: false, videoGenerationConnected: false, imageGenerationConnected: false }
): TimeSavedResult {
  // Only count posts that are approved or beyond (ready for use)
  const readyPosts = posts.filter(p => 
    ['APPROVED', 'SCHEDULED', 'PUBLISHED'].includes(p.status)
  );

  const totalPosts = readyPosts.length;
  
  if (totalPosts === 0) {
    return {
      totalMinutes: 0,
      totalHours: 0,
      valueMXN: 0,
      breakdown: {
        ideaGeneration: 0,
        writing: 0,
        design: 0,
        editing: 0,
        scheduling: 0
      }
    };
  }

  // Calculate per-post time based on format and connected capabilities
  let totalIdeaGeneration = 0;
  let totalWriting = 0;
  let totalDesign = 0;
  let totalEditing = 0;
  let totalScheduling = 0;

  readyPosts.forEach(post => {
    // Base time per post (always saved)
    totalIdeaGeneration += config.ideaGenerationMinutes;
    totalWriting += config.writingMinutes;
    totalEditing += config.editingMinutes;

    // Design time depends on format and connected image generation
    const isVideo = ['SHORT_VIDEO', 'REEL'].includes(post.format);
    const isCarousel = post.format === 'CAROUSEL';
    const isImage = ['IMAGE', 'CAROUSEL'].includes(post.format);
    
    if (isVideo) {
      if (capabilities.videoGenerationConnected) {
        totalDesign += config.designMinutes; // Video generation saves design time
      } else {
        totalDesign += config.designMinutes * 2; // Manual video creation takes longer
      }
    } else if (isCarousel) {
      if (capabilities.imageGenerationConnected) {
        totalDesign += config.designMinutes * 1.5; // Multiple images
      } else {
        totalDesign += config.designMinutes * 2;
      }
    } else if (isImage) {
      if (capabilities.imageGenerationConnected) {
        totalDesign += config.designMinutes;
      } else {
        totalDesign += config.designMinutes * 1.5;
      }
    } else {
      // Text, STORY, POLL, QUESTION - minimal design
      totalDesign += config.designMinutes * 0.5;
    }

    // Scheduling time only saved if publishing is connected
    if (capabilities.schedulingConnected) {
      totalScheduling += config.schedulingMinutes;
    }
  });

  const totalMinutes = Math.round(
    totalIdeaGeneration + totalWriting + totalDesign + totalEditing + totalScheduling
  );
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // 1 decimal place
  const valueMXN = Math.round(totalHours * config.hourlyRateMXN);

  return {
    totalMinutes,
    totalHours,
    valueMXN,
    breakdown: {
      ideaGeneration: Math.round(totalIdeaGeneration),
      writing: Math.round(totalWriting),
      design: Math.round(totalDesign),
      editing: Math.round(totalEditing),
      scheduling: Math.round(totalScheduling)
    }
  };
}

/**
 * Get a human-readable description of what's included in the estimate
 */
export function getTimeSavedDescription(capabilities: {
  schedulingConnected: boolean;
  videoGenerationConnected: boolean;
  imageGenerationConnected: boolean;
}): string {
  const parts = [
    'Content strategy & ideation',
    'Copywriting',
    'Editing & review'
  ];

  if (capabilities.imageGenerationConnected) {
    parts.push('AI image generation');
  } else {
    parts.push('Image search & design');
  }

  if (capabilities.videoGenerationConnected) {
    parts.push('AI video generation');
  } else {
    parts.push('Video concept & scripting');
  }

  if (capabilities.schedulingConnected) {
    parts.push('Auto-scheduling');
  } else {
    parts.push('Manual scheduling (not included)');
  }

  return parts.join(' • ');
}

/**
 * Format MXN currency for display
 */
export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get default config from localStorage or return defaults
 */
export function getStoredTimeConfig(): TimeSavedConfig {
  if (typeof window === 'undefined') return DEFAULT_TIME_CONFIG;
  
  try {
    const stored = localStorage.getItem('timeSavedConfig');
    if (stored) {
      return { ...DEFAULT_TIME_CONFIG, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_TIME_CONFIG;
}

/**
 * Save config to localStorage
 */
export function saveTimeConfig(config: TimeSavedConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('timeSavedConfig', JSON.stringify(config));
  }
}