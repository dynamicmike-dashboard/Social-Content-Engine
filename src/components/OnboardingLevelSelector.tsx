import { useState } from 'react';
import { QuestionnaireContextLevel } from '../types';
import { LEVEL_METADATA } from '../data/questionnaireData';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface LevelDisplayConfig {
  id: QuestionnaireContextLevel;
  icon: string;
  color: string;
  borderColor: string;
  features: string[];
}

const LEVEL_DISPLAY: Record<QuestionnaireContextLevel, LevelDisplayConfig> = {
  quick_start: {
    id: 'quick_start',
    icon: '🚀',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500',
    features: ['Business basics', 'Target audience', 'Main goal'],
  },
  build_strategy: {
    id: 'build_strategy',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500',
    features: ['Business identity', 'Customer insights', 'Expertise areas', 'Brand personality', 'Primary goal'],
  },
  deep_context: {
    id: 'deep_context',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500',
    features: ['Full brand voice', 'Customer objections', 'Personal stories', 'Expertise proof', 'Content boundaries', 'Proof & credibility', 'Conversion setup', 'AI accuracy rules'],
  },
};

interface OnboardingLevelSelectorProps {
  onSelect: (level: QuestionnaireContextLevel) => void;
  currentLevel?: QuestionnaireContextLevel;
  levelMetadata?: typeof LEVEL_METADATA;
}

export const OnboardingLevelSelector = ({ 
  onSelect, 
  currentLevel,
  levelMetadata = LEVEL_METADATA 
}: OnboardingLevelSelectorProps) => {
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  const levels: QuestionnaireContextLevel[] = ['quick_start', 'build_strategy', 'deep_context'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">How much should the AI know about your business?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The more context you provide, the more your content will sound like <em>you</em>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((levelId) => {
          const meta = levelMetadata[levelId];
          const display = LEVEL_DISPLAY[levelId];
          const isSelected = currentLevel === levelId;
          const isHovered = hoveredLevel === levelId;
          
          return (
            <button
              key={levelId}
              onClick={() => onSelect(levelId)}
              onMouseEnter={() => setHoveredLevel(levelId)}
              onMouseLeave={() => setHoveredLevel(null)}
              className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected 
                  ? `border-2 ${display.borderColor} shadow-lg shadow-[color-mix(in_srgb,${display.borderColor.replace('border-','')} 20%, transparent)]`
                  : isHovered
                  ? 'border-gray-300 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${display.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-50')} 0%, ${display.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-100')} 100%)`
                  : isHovered
                  ? 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
                  : 'white',
              }}
            >
              {/* Recommended badge */}
              {meta.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4"
                  style={{ background: display.color }}
                >
                  {display.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{meta.label}</h3>
                <p className="text-sm text-gray-500">{meta.questionCount} questions</p>
              </div>

              <p className="text-gray-600 text-sm mb-4">{meta.description}</p>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <span>⏱</span>
                  <span>{meta.estimatedTimeMinutes} min</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>❓</span>
                  <span>{meta.questionCount} questions</span>
                </span>
                {meta.requiredCount < meta.questionCount && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <span>⚠</span>
                    <span>{meta.questionCount - meta.requiredCount} optional</span>
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {display.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(levelId);
                }}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {currentLevel === levelId ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Selected</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Select
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        You can always add more context later. Your content gets smarter as we learn more about your business.
      </p>
    </div>
  );
};

export default OnboardingLevelSelector;