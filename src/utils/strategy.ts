import { ContentPost, StrategyName, StrategyDistribution, STRATEGY_COLORS, DEFAULT_STRATEGY_DISTRIBUTION } from '../types';

export const STRATEGY_ORDER: StrategyName[] = [
  'EDUCATE', 'ENGAGE', 'AUTHORITY', 'STORY', 'PROMOTE'
];

export const STRATEGY_META: Record<StrategyName, { 
  label: string; 
  description: string; 
  icon: string;
  objective: string;
}> = {
  EDUCATE: {
    label: 'Educate',
    description: 'Teach valuable lessons, share expertise, answer common questions',
    icon: 'book-open',
    objective: 'Build trust by demonstrating expertise and helping your audience solve problems'
  },
  ENGAGE: {
    label: 'Engage',
    description: 'Spark conversations, ask questions, run polls, encourage interaction',
    icon: 'message-circle',
    objective: 'Boost algorithm visibility through meaningful comments and shares'
  },
  AUTHORITY: {
    label: 'Authority',
    description: 'Showcase credentials, share results, feature testimonials, prove expertise',
    icon: 'award',
    objective: 'Position yourself as the go-to expert in your field'
  },
  STORY: {
    label: 'Story',
    description: 'Share behind-the-scenes, founder journey, customer transformations',
    icon: 'heart',
    objective: 'Create emotional connection and humanize your brand'
  },
  PROMOTE: {
    label: 'Promote',
    description: 'Direct offers, limited-time deals, booking calls, clear CTAs',
    icon: 'megaphone',
    objective: 'Convert engaged followers into paying customers'
  }
};

export function getStrategyColor(strategy: StrategyName): { light: string; default: string; dark: string } {
  return STRATEGY_COLORS[strategy];
}

export function getStrategyLightColor(strategy: StrategyName): string {
  return STRATEGY_COLORS[strategy].light;
}

export function getStrategyDefaultColor(strategy: StrategyName): string {
  return STRATEGY_COLORS[strategy].default;
}

export function getStrategyDarkColor(strategy: StrategyName): string {
  return STRATEGY_COLORS[strategy].dark;
}

export function generateStrategyRotation(
  distribution: StrategyDistribution = DEFAULT_STRATEGY_DISTRIBUTION,
  totalPosts: number = 30
): StrategyName[] {
  const strategyCounts = { ...distribution };
  
  const weightedStrategies: StrategyName[] = [];
  STRATEGY_ORDER.forEach(strategy => {
    for (let i = 0; i < strategyCounts[strategy]; i++) {
      weightedStrategies.push(strategy);
    }
  });
  
  for (let i = weightedStrategies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weightedStrategies[i], weightedStrategies[j]] = [weightedStrategies[j], weightedStrategies[i]];
  }
  
  const result: StrategyName[] = [];
  const remaining = [...weightedStrategies];
  
  while (remaining.length > 0) {
    let placed = false;
    for (let i = 0; i < remaining.length; i++) {
      const strategy = remaining[i];
      const lastStrategy = result[result.length - 1];
      
      if (lastStrategy === 'PROMOTE' && strategy === 'PROMOTE') {
        continue;
      }
      
      if (lastStrategy === strategy && remaining.length > 1) {
        continue;
      }
      
      result.push(strategy);
      remaining.splice(i, 1);
      placed = true;
      break;
    }
    
    if (!placed && remaining.length > 0) {
      result.push(remaining.shift()!);
    }
  }
  
  return result.slice(0, totalPosts);
}

export function calculateStrategyDistribution(posts: ContentPost[]): Record<StrategyName, number> {
  const distribution: Record<StrategyName, number> = {
    EDUCATE: 0,
    ENGAGE: 0,
    AUTHORITY: 0,
    STORY: 0,
    PROMOTE: 0
  };
  
  posts.forEach(post => {
    if (post.strategyName in distribution) {
      distribution[post.strategyName]++;
    }
  });
  
  return distribution;
}

/**
 * Calculate strategy percentages using the largest remainder method
 * This ensures percentages always sum to exactly 100% (or 100.0)
 * Handles zero denominator gracefully
 */
export function calculateStrategyPercentages(
  distribution: Record<StrategyName, number>,
  totalPosts: number
): Record<StrategyName, { count: number; percentage: number; percentageRounded: number }> {
  if (totalPosts === 0) {
    return {
      EDUCATE: { count: 0, percentage: 0, percentageRounded: 0 },
      ENGAGE: { count: 0, percentage: 0, percentageRounded: 0 },
      AUTHORITY: { count: 0, percentage: 0, percentageRounded: 0 },
      STORY: { count: 0, percentage: 0, percentageRounded: 0 },
      PROMOTE: { count: 0, percentage: 0, percentageRounded: 0 }
    };
  }

  // Calculate exact percentages
  const exactPercentages = STRATEGY_ORDER.map(strategy => ({
    strategy,
    count: distribution[strategy] || 0,
    percentage: ((distribution[strategy] || 0) / totalPosts) * 100
  }));

  // Round down to get integer percentages
  const rounded = exactPercentages.map(p => ({
    ...p,
    percentageRounded: Math.floor(p.percentage)
  }));

  // Calculate remainder needed to reach 100
  const sumRounded = rounded.reduce((sum, p) => sum + p.percentageRounded, 0);
  const remainder = 100 - sumRounded;

  // Sort by fractional part (largest remainder first)
  const withFractions = exactPercentages.map((p, i) => ({
    ...p,
    percentageRounded: rounded[i].percentageRounded,
    fraction: p.percentage - Math.floor(p.percentage)
  }));

  withFractions.sort((a, b) => b.fraction - a.fraction);

  // Distribute remainder to largest fractions
  for (let i = 0; i < remainder; i++) {
    if (withFractions[i]) {
      withFractions[i].percentageRounded++;
    }
  }

  // Build result
  const result: Record<StrategyName, { count: number; percentage: number; percentageRounded: number }> = {
    EDUCATE: { count: 0, percentage: 0, percentageRounded: 0 },
    ENGAGE: { count: 0, percentage: 0, percentageRounded: 0 },
    AUTHORITY: { count: 0, percentage: 0, percentageRounded: 0 },
    STORY: { count: 0, percentage: 0, percentageRounded: 0 },
    PROMOTE: { count: 0, percentage: 0, percentageRounded: 0 }
  };

  withFractions.forEach(p => {
    result[p.strategy] = {
      count: p.count,
      percentage: Math.round(p.percentage * 10) / 10, // 1 decimal place
      percentageRounded: p.percentageRounded
    };
  });

  return result;
}

/**
 * Simple percentage calculation for display (1 decimal place)
 * Use calculateStrategyPercentages for guaranteed 100% sum
 */
export function getStrategyPercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 1000) / 10; // 1 decimal place
}

export interface StrategyHealthCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface StrategyHealthResult {
  status: 'healthy' | 'needs_attention' | 'critical';
  label: string;
  description: string;
  checks: StrategyHealthCheck[];
  score: number; // 0-100
}

/**
 * Calculate strategy health based on multiple criteria
 */
export function calculateStrategyHealth(posts: ContentPost[]): StrategyHealthResult {
  const totalPosts = posts.length;
  const distribution = calculateStrategyDistribution(posts);
  const percentages = calculateStrategyPercentages(distribution, totalPosts);
  
  const checks: StrategyHealthCheck[] = [];
  
  // 1. Total posts check
  if (totalPosts === 0) {
    checks.push({
      name: 'Total Posts',
      passed: false,
      message: 'No content planned yet',
      severity: 'error'
    });
  } else if (totalPosts < 20) {
    checks.push({
      name: 'Total Posts',
      passed: false,
      message: `Only ${totalPosts} posts (recommended: 30)`,
      severity: 'warning'
    });
  } else {
    checks.push({
      name: 'Total Posts',
      passed: true,
      message: `${totalPosts} posts planned`,
      severity: 'info'
    });
  }

  // 2. Category balance check
  const targetDistribution = DEFAULT_STRATEGY_DISTRIBUTION;
  let categoryBalancePassed = true;
  let categoryBalanceMessage = 'Balanced distribution';
  
  if (totalPosts > 0) {
    const deviations = STRATEGY_ORDER.map(strategy => {
      const actualPct = percentages[strategy].percentage;
      const targetPct = (targetDistribution[strategy] / 30) * 100;
      return Math.abs(actualPct - targetPct);
    });
    
    const maxDeviation = Math.max(...deviations);
    if (maxDeviation > 15) {
      categoryBalancePassed = false;
      categoryBalanceMessage = `Distribution skewed (max deviation: ${maxDeviation.toFixed(1)}%)`;
    } else if (maxDeviation > 8) {
      categoryBalancePassed = false;
      categoryBalanceMessage = `Slightly imbalanced (max deviation: ${maxDeviation.toFixed(1)}%)`;
    }
  }
  
  checks.push({
    name: 'Category Balance',
    passed: categoryBalancePassed,
    message: categoryBalanceMessage,
    severity: categoryBalancePassed ? 'info' : 'warning'
  });

  // 3. Promotional content check
  const promoteCount = distribution.PROMOTE;
  const promotePct = totalPosts > 0 ? (promoteCount / totalPosts) * 100 : 0;
  let promoPassed = true;
  let promoMessage = `${promoteCount} promotional posts (${promotePct.toFixed(1)}%)`;
  
  if (promotePct > 25) {
    promoPassed = false;
    promoMessage = `High promotional content: ${promoteCount} posts (${promotePct.toFixed(1)}% - recommended max 20%)`;
  } else if (promotePct > 20) {
    promoPassed = false;
    promoMessage = `Slightly promotional: ${promoteCount} posts (${promotePct.toFixed(1)}%)`;
  }
  
  checks.push({
    name: 'Promotional Content',
    passed: promoPassed,
    message: promoMessage,
    severity: promoPassed ? 'info' : 'warning'
  });

  // 4. CTA Coverage check
  const postsWithCTA = posts.filter(p => p.cta && p.cta.trim().length > 0).length;
  const ctaCoverage = totalPosts > 0 ? (postsWithCTA / totalPosts) * 100 : 0;
  let ctaPassed = ctaCoverage === 100;
  let ctaMessage = `${postsWithCTA}/${totalPosts} posts have CTAs (${ctaCoverage.toFixed(0)}%)`;
  
  if (ctaCoverage < 80) {
    ctaPassed = false;
  }
  
  checks.push({
    name: 'CTA Coverage',
    passed: ctaPassed,
    message: ctaMessage,
    severity: ctaPassed ? 'info' : 'warning'
  });

  // 5. Platform coverage check
  const platformsUsed = new Set(posts.map(p => p.platform));
  const platformCoverage = platformsUsed.size;
  let platformMessage = `${platformCoverage} platforms used`;
  
  // Check if client has enabled platforms configured (would come from client profile)
  // For now, check against minimum expected
  const minPlatforms = 3; // FB, IG, LI minimum
  let platformPassed = platformCoverage >= minPlatforms;
  
  if (platformCoverage < minPlatforms) {
    platformMessage += ` (minimum ${minPlatforms} recommended)`;
  }
  
  checks.push({
    name: 'Platform Coverage',
    passed: platformPassed,
    message: platformMessage,
    severity: platformPassed ? 'info' : 'warning'
  });

  // 6. Format diversity check
  const formatsUsed = new Set(posts.map(p => p.format));
  const formatCount = formatsUsed.size;
  let formatPassed = formatCount >= 3;
  let formatMessage = `${formatCount} content formats used`;
  
  if (!formatPassed) {
    formatMessage += ' (recommend 3+ for variety)';
  }
  
  checks.push({
    name: 'Format Diversity',
    passed: formatPassed,
    message: formatMessage,
    severity: formatPassed ? 'info' : 'warning'
  });

  // 7. Customer journey coverage (based on strategy distribution)
  const journeyStages = {
    KNOW: distribution.STORY,
    TRUST: distribution.EDUCATE + distribution.AUTHORITY,
    ENGAGE: distribution.ENGAGE,
    CONSIDER: distribution.PROMOTE,
    ACT: distribution.PROMOTE
  };
  
  const missingStages = Object.entries(journeyStages)
    .filter(([, count]) => count === 0)
    .map(([stage]) => stage);
  
  let journeyPassed = missingStages.length === 0;
  let journeyMessage = missingStages.length === 0 
    ? 'All journey stages covered'
    : `Missing stages: ${missingStages.join(', ')}`;
  
  checks.push({
    name: 'Customer Journey',
    passed: journeyPassed,
    message: journeyMessage,
    severity: journeyPassed ? 'info' : 'warning'
  });

  // Calculate overall status
  const passedChecks = checks.filter(c => c.passed).length;
  const totalChecks = checks.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  
  let status: 'healthy' | 'needs_attention' | 'critical';
  let label: string;
  let description: string;
  
  if (score >= 85) {
    status = 'healthy';
    label = 'Balanced';
    description = 'Strategy is well-balanced and ready for approval';
  } else if (score >= 60) {
    status = 'needs_attention';
    label = 'Needs Attention';
    description = 'Some areas need adjustment before approval';
  } else {
    status = 'critical';
    label = 'Critical Issues';
    description = 'Major strategy issues need resolution';
  }

  return {
    status,
    label,
    description,
    checks,
    score
  };
}

export function getStrategyById(strategies: Array<{id: string; name: StrategyName}>, id: string) {
  return strategies.find(s => s.id === id);
}

export function getStrategyByName(strategies: Array<{id: string; name: StrategyName}>, name: StrategyName) {
  return strategies.find(s => s.name === name);
}