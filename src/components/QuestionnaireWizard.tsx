import { useState, useEffect, useCallback, useMemo } from 'react';
import { QuestionnaireSection, QuestionnaireQuestion } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, Save, Loader2, AlertCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

interface QuestionnaireWizardProps {
  sections: QuestionnaireSection[];
  level: 'quick_start' | 'build_strategy' | 'deep_context';
  initialResponses?: Record<string, string>;
  onSave: (responses: Record<string, string>) => Promise<void>;
  onSubmit: (responses: Record<string, string>) => Promise<void>;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isSubmitting: boolean;
  progress: {
    completed: number;
    total: number;
    requiredCompleted: number;
    requiredTotal: number;
    sectionProgress: Record<string, { completed: number; total: number }>;
  };
  isDemoMode?: boolean;
}

const renderQuestionInput = (question: QuestionnaireQuestion, response: string, onChange: (id: string, value: string) => void, error?: string) => {
  const isTextarea = question.question.length > 100 || question.placeholder?.includes('detail') || question.placeholder?.includes('full');
  
  return (
    <div className="space-y-2">
      <label htmlFor={question.id} className="block text-sm font-medium text-gray-900">
        {question.question}
        {question.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {question.helpText && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          {question.helpText}
        </p>
      )}
      {isTextarea ? (
        <textarea
          id={question.id}
          value={response}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${question.id}-error` : question.helpText ? `${question.id}-help` : undefined}
        />
      ) : (
        <input
          type="text"
          id={question.id}
          value={response}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${question.id}-error` : question.helpText ? `${question.id}-help` : undefined}
        />
      )}
      {error && (
        <p id={`${question.id}-error`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export const QuestionnaireWizard = ({
  sections,
  level,
  initialResponses = {},
  onSave,
  onSubmit,
  onBack,
  onNext,
  canGoBack,
  isSubmitting,
  progress,
  isDemoMode = true,
}: QuestionnaireWizardProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Initialize responses
  useEffect(() => {
    setResponses(initialResponses || {});
  }, [initialResponses]);

  // Auto-save on response change
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave(responses);
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [responses, onSave]);

  // Validate current section
  const validateCurrentSection = useCallback(() => {
    const currentSection = sections[currentSectionIndex];
    const errors: Record<string, string> = {};
    
    if (!currentSection) return true;
    
    currentSection.questions.forEach(question => {
      if (question.required && (!responses[question.id] || !responses[question.id].trim())) {
        errors[question.id] = 'This field is required';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [responses, currentSectionIndex, sections]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
      } else {
        onNext();
      }
    } else {
      setShowValidationErrors(true);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (validateCurrentSection()) {
      await onSubmit(responses);
    } else {
      setShowValidationErrors(true);
    }
  };

  const getCompletionPercentage = () => {
    if (progress.total === 0) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  };

  const getRequiredCompletionPercentage = () => {
    if (progress.requiredTotal === 0) return 0;
    return Math.round((progress.requiredCompleted / progress.requiredTotal) * 100);
  };

  // Calculate progress from responses
  const calculatedProgress = useMemo(() => {
    let completed = 0;
    let requiredCompleted = 0;
    let requiredTotal = 0;
    const sectionProgress: Record<string, { completed: number; total: number }> = {};
    
    sections.forEach(section => {
      let sectionCompleted = 0;
      section.questions.forEach(q => {
        const hasResponse = responses[q.id] && responses[q.id].trim().length > 0;
        if (hasResponse) {
          completed++;
          sectionCompleted++;
        }
        if (q.required) {
          requiredTotal++;
          if (hasResponse) requiredCompleted++;
        }
      });
      sectionProgress[section.id] = { completed: sectionCompleted, total: section.questions.length };
    });
    
    const total = sections.flatMap(s => s.questions).length;
    const canSubmit = requiredCompleted === requiredTotal && requiredTotal > 0;
    
    return { completed, total, requiredCompleted, requiredTotal, sectionProgress, canSubmit };
  }, [responses, sections]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Progress Header */}
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {level === 'quick_start' ? 'Quick Start' : 
               level === 'build_strategy' ? 'Build My Strategy' : 'Deep Context'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {calculatedProgress.completed} of {calculatedProgress.total} questions answered
              {calculatedProgress.requiredTotal > 0 && ` • ${calculatedProgress.requiredCompleted}/{calculatedProgress.requiredTotal} required`}
            </p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </div>
        
        {/* Required progress indicator */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Required: {calculatedProgress.requiredCompleted}/{calculatedProgress.requiredTotal}</span>
          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${getRequiredCompletionPercentage()}%` }}
            />
          </div>
        </div>
        
        {/* Save indicator */}
        {showSaveIndicator && (
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600">
            <Save className="w-3.5 h-3.5" />
            <span>Saved automatically</span>
          </div>
        )}
      </div>

      {/* Sections / Questions */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isDemoMode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-amber-700">⚠</span>
              <span className="text-sm text-amber-800">
                Demo mode: Changes are not persisted. Data resets on refresh.
              </span>
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => {
            const isCurrentSection = sectionIndex === currentSectionIndex;
            const sectionProgress = calculatedProgress.sectionProgress[section.id] || { completed: 0, total: 0 };
            
            return (
              <div 
                key={section.id} 
                className={cn(
                  'rounded-xl border transition-all duration-200',
                  isCurrentSection ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-gray-300',
                  isCurrentSection && 'shadow-sm'
                )}
              >
                {/* Section Header */}
                <button
                  onClick={() => handleSectionToggle(section.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                  aria-expanded={expandedSections[section.id] || isCurrentSection}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <ChevronDown 
                      className={cn('w-5 h-5 text-gray-400 transition-transform duration-200', (expandedSections[section.id] || isCurrentSection) && 'rotate-180')}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {sectionProgress.completed}/{sectionProgress.total}
                      </span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                          style={{ width: sectionProgress.total > 0 ? `${(sectionProgress.completed / sectionProgress.total) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                <div 
                  className={cn('overflow-hidden transition-all duration-300', expandedSections[section.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}
                  style={{ paddingBottom: expandedSections[section.id] ? '24px' : '0' }}
                >
                  <div className="px-4 pb-4 space-y-6">
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        {renderQuestionInput(
                          question,
                          responses[question.id] || '',
                          handleResponseChange,
                          showValidationErrors ? validationErrors[question.id] : undefined
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 sticky bottom-0">
        <div className="flex items-center justify-between">
          {/* Progress summary */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {calculatedProgress.completed}/{calculatedProgress.total} answered
              {calculatedProgress.requiredTotal > 0 && ` • ${calculatedProgress.requiredCompleted}/{calculatedProgress.requiredTotal} required`}
            </span>
            {calculatedProgress.canSubmit && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                Ready to submit
              </span>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={!canGoBack || isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {sections.length > 1 && currentSectionIndex < sections.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !calculatedProgress.canSubmit}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireWizard;