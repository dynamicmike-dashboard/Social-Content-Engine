import React from 'react';
import { PRICING_PLANS, getYearlyPrice } from './pricing';
import { 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Calendar, 
  ImageIcon, 
  Brain, 
  Zap, 
  Shield, 
} from 'lucide-react';

export function PricingCard({ plan, billingCycle }: { plan: typeof PRICING_PLANS[number]; billingCycle: 'monthly' | 'yearly' }) {
  const prices = getYearlyPrice(plan);
  const price = billingCycle === 'yearly' ? prices.yearlyMXN : plan.monthlyPriceMXN;
  const priceUSD = billingCycle === 'yearly' ? prices.yearlyUSD : plan.monthlyPriceUSD;
  const period = billingCycle === 'yearly' ? 'year' : 'month';

  return (
    <div className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
      plan.popular 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{plan.tagline}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-500">/{period}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {billingCycle === 'yearly' 
            ? `Billed ${prices.yearlyMXN.toLocaleString()} MXN yearly (${plan.yearlyDiscountPercent}% off)`
            : `${priceUSD} USD/month`}
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
        {plan.limitations.map((limitation: string, i: number) => (
          <li key={`lim-${i}`} className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
            <span className="text-gray-400 text-sm">{limitation}</span>
          </li>
        ))}
      </ul>

      <button 
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          plan.popular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {plan.ctaText}
      </button>
    </div>
  );
}

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'yearly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="ml-1 text-green-600 font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PRICING_PLANS.map(plan => (
            <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} />
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          All prices in MXN. USD prices shown for reference. 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Strategy',
      description: 'Not just content — a reasoned strategy with objectives, audience, messaging pillars, and reasoning behind every choice.',
    },
    {
      icon: Calendar,
      title: 'Visual 30-Day Calendar',
      description: '30 individual day cards in a responsive grid. Click any day to see its content, strategy, and image prompt.',
    },
    {
      icon: ImageIcon,
      title: 'Advanced Image Prompts',
      description: 'Every day includes a detailed image-generation prompt with composition, lighting, style, and brand guidance.',
    },
    {
      icon: Zap,
      title: 'Progressive Onboarding',
      description: 'Choose your depth: website research, basic questions, or full questionnaire. Save progress and return anytime.',
    },
    {
      icon: Zap,
      title: 'Sync & Refresh',
      description: 'Update your business context anytime. Press Sync to rebuild strategy and refresh outdated content.',
    },
    {
      icon: Shield,
      title: 'Brand-Safe Output',
      description: 'Exact prices, dates, offers, and logos come from your verified data — never invented by AI.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for 30 Days of Content
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From strategy to daily execution — every deliverable is grounded in your business context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Onboarding',
      description: 'Website research, basic questions, or full questionnaire — you decide the depth.',
    },
    {
      number: 2,
      title: 'AI Builds Your Strategy',
      description: 'Get a reasoned 30-day strategy with objectives, audience, messaging pillars, and content mix.',
    },
    {
      number: 3,
      title: 'Review Your 30-Day Calendar',
      description: 'Visual grid of 30 daily cards. Click any day for content, image prompt, and strategy.',
    },
    {
      number: 4,
      title: 'Sync & Improve Over Time',
      description: 'Update answers anytime, press Sync, and refresh outdated content with new context.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From onboarding to execution in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-16">
              <div className="absolute left-0 top-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    {
      q: 'What exactly do I get for my monthly subscription?',
      a: 'Access to the AI strategy engine, 30-day visual calendar, daily content with image prompts, progressive onboarding, and Sync capability. Exact features depend on your plan.'
    },
    {
      q: 'Can I change plans later?',
      a: 'Yes, you can upgrade or downgrade at any time. Changes take effect at your next billing cycle.'
    },
    {
      q: 'Is there a long-term contract?',
      a: 'No. All plans are month-to-month. Yearly plans offer a 20% discount but can be cancelled anytime (prorated refund).'
    },
    {
      q: 'How does the 14-day free trial work?',
      a: 'Sign up and get full access to your chosen plan for 14 days. No credit card required. Cancel anytime during trial.'
    },
    {
      q: 'Can I use my own brand assets and logos?',
      a: 'Yes. Upload your brand assets during onboarding. They\'re used in image prompts and content generation.'
    },
    {
      q: 'What platforms are supported?',
      a: 'Facebook, Instagram, LinkedIn, X (Twitter), and TikTok. Plan limits apply to number of platforms.'
    },
    {
      q: 'Is my data used to train AI models?',
      a: 'No. Your business context and generated content are never used for training. They remain private to your workspace.'
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-gray-50 rounded-xl p-6 transition-colors hover:bg-gray-100">
              <summary className="flex items-center justify-between cursor-pointer font-medium text-gray-900">
                {faq.q}
                <Sparkles className={`w-5 h-5 text-gray-400 transition-transform ${'group-open:rotate-180'}`} />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Content?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Start your 14-day free trial. No credit card required. See your 30-day strategy in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/auth/sign-up" 
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </a>
          <a 
            href="#pricing" 
            className="px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors border-2 border-blue-500"
          >
            View Pricing
          </a>
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="py-12 px-4 bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Social Content Engine</h3>
            <p className="text-sm">AI-powered 30-day content strategies for businesses that want to show up consistently.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2024 Social Content Engine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function SalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">Social Content Engine</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium">How It Works</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm font-medium">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/sign-in" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Sign In</a>
            <a href="/auth/sign-up" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  30 Days of Content.<br />
                  <span className="text-blue-600">Strategized. Scheduled. Ready.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-xl">
                  AI builds your reasoned 30-day strategy, visual calendar, daily content, and advanced image prompts — all grounded in your business context.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/auth/sign-up" 
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Start Free Trial
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    See How It Works
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-900 rounded-2xl p-4 aspect-square max-w-md mx-auto">
                  <div className="grid grid-cols-5 gap-2 h-64">
                    {['Awareness', 'Education', 'Trust', 'Engagement', 'Expertise', 'Promotion'].map((theme, i) => (
                      <div key={i} className="bg-gray-800 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                          <span className="text-xs text-blue-400 font-medium">{theme}</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded w-full mb-1"></div>
                        <div className="h-1 bg-gray-700 rounded w-3/4 mb-1"></div>
                        <div className="h-1 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <PricingSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
}

export default SalesPage;