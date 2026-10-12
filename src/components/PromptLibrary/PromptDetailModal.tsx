import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { PromptDefinition, PromptInputField, PromptOutputField, PromptStatus } from '../../lib/prompts/types';

interface PromptDetailModalProps {
  prompt: PromptDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onExecute?: (promptId: string) => void;
}

const STATUS_CONFIG: Record<PromptStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; text: string }> = {
  implemented: { 
    label: 'Implemented', 
    color: '#065F46', 
    bg: '#D1FAE5', 
    border: '#10B981',
    icon: <CheckCircle className="w-4 h-4" />,
    text: '#065F46'
  },
  tested: { 
    label: 'Tested', 
    color: '#065F46', 
    bg: '#D1FAE5', 
    border: '#10B981',
    icon: <CheckCircle className="w-4 h-4" />,
    text: '#065F46'
  },
  experimental: { 
    label: 'Experimental', 
    color: '#92400E', 
    bg: '#FEF3C7', 
    border: '#F59E0B',
    icon: <Zap className="w-4 h-4" />,
    text: '#92400E'
  },
  planned: { 
    label: 'Planned', 
    color: '#475569', 
    bg: '#F1F5F9', 
    border: '#94A3B8',
    icon: <Clock className="w-4 h-4" />,
    text: '#475569'
  },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  string: { bg: '#DBEAFE', text: '#1D4ED8' },
  number: { bg: '#EDE9FE', text: '#7C3AED' },
  boolean: { bg: '#D1FAE5', text: '#059669' },
  array: { bg: '#FFEDD5', text: '#EA580C' },
  object: { bg: '#FCE7F3', text: '#BE185D' },
};

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onExecute,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !prompt) return null;

  const statusConfig = STATUS_CONFIG[prompt.status];
  const canExecute = prompt.status === 'implemented' || prompt.status === 'tested';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <span 
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              <span className="text-sm text-gray-500 font-mono">v{prompt.version}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{prompt.name}</h2>
            <p className="text-gray-600">{prompt.id} • {prompt.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Purpose & Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Purpose</h3>
            <p className="text-gray-600">{prompt.purpose}</p>
            <p className="text-gray-500 text-sm">{prompt.description}</p>
          </div>

          {/* Model Requirements */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Model Requirements</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                Preferred: {prompt.modelRequirements.preferred}
              </span>
              {prompt.modelRequirements.fallback?.map((m, i) => (
                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm">
                  Fallback: {m}
                </span>
              ))}
              {prompt.modelRequirements.temperature !== undefined && (
                <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm">
                  Temp: {prompt.modelRequirements.temperature}
                </span>
              )}
              {prompt.modelRequirements.maxTokens && (
                <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm">
                  Max Tokens: {prompt.modelRequirements.maxTokens}
                </span>
              )}
            </div>
          </div>

          {/* Inputs */}
          {prompt.inputs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Required Inputs
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">
                  {prompt.inputs.filter(i => i.required).length} required
                </span>
              </h3>
              <div className="space-y-3">
                {prompt.inputs.map((input: PromptInputField) => (
                  <div 
                    key={input.key} 
                    className={`p-4 rounded-xl border transition-colors ${
                      input.required 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{input.label}</span>
                          {input.required && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Required</span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[input.type]?.bg || 'bg-gray-100'} ${TYPE_COLORS[input.type]?.text || 'text-gray-700'}`}>
                            {input.type}
                          </span>
                          {input.source && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                              Source: {input.source}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{input.description}</p>
                        {input.validation && (
                          <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                            {input.validation.minLength && <span>Min length: {input.validation.minLength}</span>}
                            {input.validation.maxLength && <span>Max length: {input.validation.maxLength}</span>}
                            {input.validation.pattern && <span>Pattern: {input.validation.pattern}</span>}
                            {input.validation.enum && <span>Allowed: {input.validation.enum.join(', ')}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output Schema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Expected Output
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">
                {prompt.outputFields.length} fields
              </span>
            </h3>
            <div className="space-y-2">
              {prompt.outputFields.map((field: PromptOutputField) => (
                <div 
                  key={field.key} 
                  className={`p-3 rounded-lg border flex items-center gap-3 ${
                    field.required 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <code className="font-mono text-sm text-gray-900 bg-white px-2 py-0.5 rounded border">{field.key}</code>
                      {field.required && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">required</span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[field.type]?.bg || 'bg-gray-100'} ${TYPE_COLORS[field.type]?.text || 'text-gray-700'}`}>
                        {field.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{field.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Context Dependencies */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Context Dependencies</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.contextDependencies.requiresWorkshopContext && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">Workshop Context</span>
              )}
              {prompt.contextDependencies.requiresStrategy && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                  Strategy: {prompt.contextDependencies.requiresStrategy.join(', ')}
                </span>
              )}
              {prompt.contextDependencies.requiresCalendar && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">Calendar</span>
              )}
              {prompt.contextDependencies.requiresAssets && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">Assets</span>
              )}
              {prompt.contextDependencies.requiresOffers && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">Offers</span>
              )}
            </div>
          </div>

          {/* Approval Requirements */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Approval Requirements</h3>
            <div className="flex items-center gap-3">
              {prompt.approvalRequirements.requiresHumanReview ? (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-700">Requires human review at <strong>{prompt.approvalRequirements.reviewStage?.replace('_', ' ')}</strong></span>
                  {prompt.approvalRequirements.approverRoles?.length && (
                    <span className="text-gray-500 text-sm">Approvers: {prompt.approvalRequirements.approverRoles.join(', ')}</span>
                  )}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">No human review required</span>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900 font-mono">{prompt.createdAt}</span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 text-gray-900 font-mono">{prompt.updatedAt}</span>
              </div>
              {prompt.metadata.estimatedTokens && (
                <>
                  <div>
                    <span className="text-gray-500">Est. Input Tokens:</span>
                    <span className="ml-2 text-gray-900 font-mono">{prompt.metadata.estimatedTokens.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Output Tokens:</span>
                    <span className="ml-2 text-gray-900 font-mono">{prompt.metadata.estimatedTokens.output}</span>
                  </div>
                </>
              )}
              {prompt.metadata.estimatedCostUSD && (
                <div>
                  <span className="text-gray-500">Est. Cost:</span>
                  <span className="ml-2 text-gray-900 font-mono">${prompt.metadata.estimatedCostUSD.toFixed(4)}</span>
                </div>
              )}
              {prompt.metadata.avgLatencyMs && (
                <div>
                  <span className="text-gray-500">Avg Latency:</span>
                  <span className="ml-2 text-gray-900 font-mono">{prompt.metadata.avgLatencyMs}ms</span>
                </div>
              )}
              {prompt.metadata.tags?.length && (
                <div className="col-span-2">
                  <span className="text-gray-500">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prompt.metadata.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Cases */}
          {prompt.testCases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Test Cases</h3>
              <div className="space-y-2">
                {prompt.testCases.map((tc, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{tc.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${tc.shouldPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {tc.shouldPass ? 'Should Pass' : 'Should Fail'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{tc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Prompts */}
          {prompt.metadata.relatedPrompts?.length && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Related Prompts</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.metadata.relatedPrompts.map((id) => (
                  <span key={id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">{id}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
          >
            Close
          </button>
          {canExecute && onExecute && (
            <button
              onClick={() => onExecute(prompt.id)}
              className="px-6 py-2 bg-[#7FB3D5] text-white rounded-xl font-medium hover:bg-[#6DB0D0] transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Execute Prompt
            </button>
          )}
          {!canExecute && (
            <button
              className="px-6 py-2 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed flex items-center gap-2"
              disabled
            >
              <Clock className="w-4 h-4" />
              Not Available ({prompt.status})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};