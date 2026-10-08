import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: "How much would you charge me for an hour of your time?",
    subtitle: "Your expertise has value. Let's quantify it.",
    icon: '💰',
    bgColor: 'from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
    animation: 'slideUp'
  },
  {
    id: 2,
    title: "How many hours are you spending every month creating social media content?",
    subtitle: "The hidden cost of DIY social media",
    icon: '⏰',
    bgColor: 'from-blue-50 to-cyan-50',
    accentColor: 'text-blue-600',
    animation: 'slideUp'
  },
  {
    id: 3,
    title: "What if your entire month was strategically planned for you — and all you had to do was review and approve it?",
    subtitle: "From chaos to clarity in one click",
    icon: '✨',
    bgColor: 'from-purple-50 to-pink-50',
    accentColor: 'text-purple-600',
    animation: 'slideUp'
  },
  {
    id: 4,
    title: "CHAOS → STRATEGY → CONTENT → REVIEW → APPROVAL → ACTION",
    subtitle: "Your new workflow in 6 steps",
    icon: '🔄',
    bgColor: 'from-green-50 to-teal-50',
    accentColor: 'text-green-600',
    animation: 'flow',
    workflowSteps: [
      { label: 'CHAOS', desc: 'Random posting, no strategy', current: true, icon: '🌪️' },
      { label: 'STRATEGY', desc: '30-day content plan', current: true, icon: '🎯' },
      { label: 'CONTENT', desc: 'Platform-specific posts', current: true, icon: '📝' },
      { label: 'REVIEW', desc: 'Client feedback loop', current: true, icon: '👀' },
      { label: 'APPROVAL', desc: 'One-click approval', current: true, icon: '✅' },
      { label: 'PUBLISH', desc: 'Auto-publish to platforms', current: false, icon: '🚀' },
      { label: 'LEADS', desc: 'Capture & track enquiries', current: false, icon: '🎯' },
      { label: 'AUTOMATION TRIGGER', desc: 'Keyword auto-response', current: false, icon: '⚡' },
      { label: 'AI QUALIFICATION', desc: 'Score & prioritize leads', current: false, icon: '🤖' },
    ]
  },
  {
    id: 5,
    title: "You stay in control. We take the work off your plate.",
    subtitle: "Your expertise. Our execution. Your approval.",
    icon: '🤝',
    bgColor: 'from-indigo-50 to-blue-50',
    accentColor: 'text-indigo-600',
    animation: 'slideUp',
    features: [
      { text: '30-day strategic content calendar', current: true },
      { text: 'Platform-optimized posts (FB, IG, LI, X, TikTok)', current: true },
      { text: 'AI-generated hooks, captions, hashtags, CTAs', current: true },
      { text: 'Alternative hooks with strategic rationale', current: true },
      { text: 'Visual concepts with dimensions & formats', current: true },
      { text: 'One-click approve/edit/regenerate workflow', current: true },
      { text: 'Strategy health score & time-saved estimates', current: false },
      { text: 'Publishing automation', current: false },
      { text: 'Keyword automation', current: false },
      { text: 'Lead capture & CRM', current: false },
      { text: 'AI lead qualification', current: false },
      { text: 'Analytics feedback loop', current: false },
    ]
  }
];

export const SalesIntro = ({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    const timer = setTimeout(() => setShowNext(true), reducedMotion ? 100 : 2500);
    return () => clearTimeout(timer);
  }, [currentStep, reducedMotion]);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setShowContent(false);
      setShowNext(false);
      setTimeout(() => setCurrentStep(currentStep + 1), reducedMotion ? 0 : 300);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const step = STEPS[currentStep];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      nextStep();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentStep > 0) {
        setShowContent(false);
        setShowNext(false);
        setTimeout(() => setCurrentStep(currentStep - 1), 300);
      }
    } else if (e.key === 'Escape') {
      handleSkip();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  if (currentStep === 0 && !showContent) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center z-50">
        <div className="text-center p-8 max-w-2xl mx-4">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-6">
              <span style={{fontSize: '48px'}}>🚀</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Social Content Engine
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Let's take a quick tour of how we'll transform your social media workflow.
            </p>
            <button
              onClick={() => { setShowContent(true); setShowNext(false); }}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              Start Tour
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd> to advance
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: step.bgColor }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="w-full max-w-3xl mx-4">
        {/* Skip button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/50 transition-colors"
            aria-label="Skip intro"
          >
            Skip
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-1 rounded transition-all duration-500 ${
                  index <= currentStep
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <span className="text-white/70 text-sm ml-4">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>

        {/* Main content */}
        <div 
          className={`text-center transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ animationDuration: reducedMotion ? '0ms' : '600ms' }}
        >
          <div className="mb-8">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6"
              style={{ background: step.bgColor }}
            >
              <span style={{fontSize: '48px'}}>{step.icon}</span>
            </div>
            <h1 
              id="intro-title"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            >
              {step.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {step.subtitle}
            </p>
          </div>

          {/* Step-specific content */}
{currentStep === 3 && step.workflowSteps && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {step.workflowSteps.map((item, i) => (
                <div 
                  key={i}
                  className={`bg-white/80 backdrop-blur p-4 rounded-xl border border-white/50 transition-all duration-500 hover:shadow-lg ${!reducedMotion ? 'transition-all' : ''} ${!item.current ? 'opacity-60' : ''}`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-3xl">{item.icon || '📋'}</div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.label}</h4>
                    {!item.current && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">COMING NEXT</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-12 p-6 bg-white/80 backdrop-blur rounded-2xl border border-white/50">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-100 rounded-xl">
                  <span style={{fontSize: '32px'}}>🤝</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">You stay in control</h3>
                  <p className="text-gray-600">We create. You approve. You own the relationship.</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="p-4 bg-green-100 rounded-xl">
                  <span style={{fontSize: '32px'}}>🛡️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">We take the work</h3>
                  <p className="text-gray-600">Strategy, writing, design, scheduling — handled.</p>
                </div>
              </div>
            </div>
          )}

          {/* Features list for step 4 */}
          {currentStep === 4 && step.features && !reducedMotion && (
            <div className="mt-12 text-left max-w-xl mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">What you get:</h3>
              <ul className="space-y-3">
                {step.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur rounded-xl border border-white/50 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature.text}</span>
                    {!feature.current && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">COMING NEXT</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div 
          className={`mt-10 flex justify-between items-center ${showNext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transition: `opacity ${reducedMotion ? '0ms' : '300ms'} ease-out, transform ${reducedMotion ? '0ms' : '300ms'} ease-out`, transitionDelay: reducedMotion ? '0ms' : '400ms' }}
        >
          <button
            onClick={() => {
              setShowContent(false);
              setShowNext(false);
              setTimeout(() => setCurrentStep(currentStep - 1), 300);
            }}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
            }`}
            aria-label="Previous step"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg flex items-center gap-2"
                aria-label="Next step"
              >
                Next
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <kbd className="px-2 py-1 bg-gray-100 rounded mr-1">←</kbd>
          <kbd className="px-2 py-1 bg-gray-100 rounded mr-1">→</kbd>
          <kbd className="px-2 py-1 bg-gray-100 rounded mr-1">Space</kbd>
          <kbd className="px-2 py-1 bg-gray-100 rounded mr-1">Esc</kbd>
          <span className="ml-2">to navigate</span>
        </div>
      </div>
    </div>
  );
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return reduced;
}