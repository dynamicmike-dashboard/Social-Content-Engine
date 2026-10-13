// Pricing configuration - single source of truth for plans
export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for solopreneurs and small businesses',
    monthlyPriceMXN: 499,
    monthlyPriceUSD: 29,
    yearlyDiscountPercent: 20,
    features: [
      '30-day AI content strategy',
      'Visual 30-day calendar',
      'Daily content with image prompts',
      'Website research onboarding',
      'Basic questionnaire (12 questions)',
      'Up to 30 posts/month',
      '2 platforms (FB + IG)',
      'Email support',
    ],
    limitations: [
      'No Sync/refresh capability',
      'No advanced image prompts',
      'No team collaboration',
    ],
    ctaText: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For growing businesses and agencies',
    monthlyPriceMXN: 1299,
    monthlyPriceUSD: 75,
    yearlyDiscountPercent: 20,
    features: [
      'Everything in Starter',
      'Full questionnaire (28 questions)',
      'Sync & context versioning',
      'Advanced image prompts per day',
      'Sync/refresh anytime',
      'Up to 100 posts/month',
      '5 platforms (FB, IG, LI, TW, TK)',
      'Priority email support',
      'Strategy rationale document',
    ],
    limitations: [
      'No team collaboration',
      'No white-label',
    ],
    ctaText: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For agencies and teams',
    monthlyPriceMXN: 2999,
    monthlyPriceUSD: 175,
    yearlyDiscountPercent: 20,
    features: [
      'Everything in Growth',
      'Team collaboration (5 seats)',
      'Client workspaces',
      'Approval workflows',
      'White-label reports',
      'Unlimited posts/month',
      'All platforms',
      'Phone + priority support',
      'Custom onboarding',
      'API access',
    ],
    limitations: [],
    ctaText: 'Contact Sales',
    popular: false,
  },
] as const;

export type PricingPlanId = typeof PRICING_PLANS[number]['id'];

export function getPlanById(id: PricingPlanId) {
  return PRICING_PLANS.find(p => p.id === id);
}

export function getYearlyPrice(plan: typeof PRICING_PLANS[number]) {
  const yearlyMXN = Math.round(plan.monthlyPriceMXN * 12 * (1 - plan.yearlyDiscountPercent / 100));
  const yearlyUSD = Math.round(plan.monthlyPriceUSD * 12 * (1 - plan.yearlyDiscountPercent / 100));
  return { yearlyMXN, yearlyUSD };
}