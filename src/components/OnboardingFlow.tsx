import { useState, useEffect, useCallback, useMemo } from 'react';
import { QuestionnaireContextLevel, OnboardingFlowState, StrategyDistribution } from '../types';
import { OnboardingLevelSelector } from './OnboardingLevelSelector';
import { QuestionnaireWizard } from './QuestionnaireWizard';
import { StrategyOverview } from './StrategyOverview';
import { CalendarView } from './CalendarView';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { QUESTIONNAIRE_SECTIONS, LEVEL_METADATA } from '../data/questionnaireData';

interface OnboardingFlowProps {
  onComplete: () => void;
  demoMode?: boolean;
}

export const OnboardingFlow = ({ onComplete, demoMode = true }: OnboardingFlowProps) => {
  const [state, setState] = useState<OnboardingFlowState>({
    step: 'welcome',
    selectedLevel: null,
    questionnaireCompleted: false,
    strategyConfirmed: false,
    clientId: null,
    questionnaireRevision: 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [questionnaireResponses, setQuestionnaireResponses] = useState<Record<string, string>>({});
  const [strategyDist, setStrategyDist] = useState<StrategyDistribution>({
    EDUCATE: 8,
    ENGAGE: 6,
    AUTHORITY: 5,
    STORY: 5,
    PROMOTE: 6,
  });
  const [isDemoMode] = useState(demoMode);

  // Get sections for current level
  const currentSections = useMemo(() => {
    if (!state.selectedLevel) return [];
    return QUESTIONNAIRE_SECTIONS[state.selectedLevel];
  }, [state.selectedLevel]);

  // Handle level selection
  const handleLevelSelect = useCallback((level: QuestionnaireContextLevel) => {
    setState(prev => ({
      ...prev,
      step: 'questionnaire',
      selectedLevel: level,
    }));
  }, []);

  // Handle questionnaire save
  const handleQuestionnaireSave = useCallback(async (responses: Record<string, string>) => {
    setQuestionnaireResponses(responses);
    if (isDemoMode) {
      localStorage.setItem('questionnaireResponses', JSON.stringify(responses));
      localStorage.setItem('questionnaireLevel', state.selectedLevel || '');
    } else {
      console.log('Saving questionnaire responses:', responses);
    }
  }, [isDemoMode, state.selectedLevel]);

  // Handle questionnaire submit
  const handleQuestionnaireSubmit = useCallback(async (responses: Record<string, string>) => {
    setIsLoading(true);
    try {
      setQuestionnaireResponses(responses);
      if (!isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setState(prev => ({
        ...prev,
        step: 'strategy',
        questionnaireCompleted: true,
        questionnaireRevision: prev.questionnaireRevision + 1,
      }));
    } catch (error) {
      console.error('Failed to submit questionnaire:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  // Handle strategy confirmation
  const handleStrategyConfirm = useCallback((distribution: StrategyDistribution) => {
    setStrategyDist(distribution);
    setState(prev => ({
      ...prev,
      step: 'calendar',
      strategyConfirmed: true,
    }));
  }, []);

  // Handle calendar view - defined inline where used

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Load initial data
  useEffect(() => {
    if (isDemoMode) {
      const savedResponses = localStorage.getItem('questionnaireResponses');
      const savedLevel = localStorage.getItem('questionnaireLevel') as QuestionnaireContextLevel | null;
      if (savedResponses) {
        setQuestionnaireResponses(JSON.parse(savedResponses));
      }
      if (savedLevel && !state.selectedLevel) {
        setState(prev => ({ ...prev, selectedLevel: savedLevel }));
      }
    }
  }, [isDemoMode, state.selectedLevel]);

  const currentStep = state.step;
  const isWelcome = currentStep === 'welcome';
  const isSelectLevel = currentStep === 'select_level';
  const isQuestionnaire = currentStep === 'questionnaire';
  const isStrategy = currentStep === 'strategy';
  const isCalendar = currentStep === 'calendar';
  const isComplete = currentStep === 'complete';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Progress indicator at top */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Onboarding</span>
              <div className="flex gap-1">
                {['welcome', 'select_level', 'questionnaire', 'strategy', 'calendar', 'complete'].map((step, index) => (
                  <div 
                    key={step}
                    className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      ['welcome', 'select_level', 'questionnaire', 'strategy', 'calendar', 'complete'].indexOf(state.step) >= index
                        ? 'bg-emerald-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            {isDemoMode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-xs text-amber-700">
                <span>🔬</span>
                <span>Demo Mode</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {isLoading && (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">{isLoading ? 'Loading...' : 'Saving...'}</p>
              </div>
            </div>
          )}

          <div className="min-h-[calc(100vh-120px)] flex flex-col">
            {/* Welcome Step */}
            {isWelcome && (
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-3xl w-full text-center">
                  <div className="mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Social Content Engine</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Create a month of strategic social media content in minutes. 
                      Answer a few questions, review your strategy, and approve your calendar.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setState(prev => ({ ...prev, step: 'select_level' }))}
                      className="w-full md:w-1/2 mx-auto py-4 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => setState(prev => ({ ...prev, step: 'select_level', isDemoMode: false }))}
                      className="w-full md:w-1/2 mx-auto py-4 px-8 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Continue without demo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Select Level Step */}
            {isSelectLevel && (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="max-w-4xl w-full">
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">How much should the AI know?</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      The more context you give, the more your content sounds like <em>you</em>.
                    </p>
                  </div>
                  
                  <OnboardingLevelSelector 
                    onSelect={handleLevelSelect}
                    currentLevel={state.selectedLevel ?? undefined}
                    levelMetadata={LEVEL_METADATA}
                  />
                </div>
              </div>
            )}

            {/* Questionnaire Step */}
            {isQuestionnaire && currentSections.length > 0 && (
              <div className="flex-1">
                <QuestionnaireWizard
                  sections={currentSections}
                  level={state.selectedLevel || 'build_strategy'}
                  initialResponses={questionnaireResponses}
                  onSave={handleQuestionnaireSave}
                  onSubmit={handleQuestionnaireSubmit}
                  onBack={() => setState(prev => ({ ...prev, step: 'select_level' }))}
                  onNext={() => {}}
                  canGoBack={true}
                  isSubmitting={isLoading}
                  progress={{
                    completed: 0,
                    total: 0,
                    requiredCompleted: 0,
                    requiredTotal: 0,
                    sectionProgress: {},
                  }}
                  isDemoMode={isDemoMode}
                />
              </div>
            )}

            {/* Strategy Overview Step */}
            {isStrategy && (
              <div className="flex-1">
                <StrategyOverview 
                  onGenerate={handleStrategyConfirm}
                  initialDistribution={strategyDist}
                />
              </div>
            )}

            {/* Calendar Step */}
            {isCalendar && (
              <div className="flex-1">
                <CalendarView 
                  onComplete={() => setState(prev => ({ ...prev, step: 'complete' }))}
                />
              </div>
            )}

            {/* Complete Step */}
            {isComplete && (
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-2xl w-full text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-emerald-100 mb-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">You're all set!</h1>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto">
                      Your 30-day content calendar is ready. Review, approve, and watch your social media come to life.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleComplete}
                      className="w-full md:w-1/2 mx-auto py-4 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30"
                    >
                      View My Calendar
                    </button>
                    <button
                      onClick={() => setState(prev => ({ ...prev, step: 'calendar' }))}
                      className="w-full md:w-1/2 mx-auto py-4 px-8 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Review Calendar First
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
            <p>Social Content Engine — Your entire month of strategic social media, planned and ready for approval.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingFlow;