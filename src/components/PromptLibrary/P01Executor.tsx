import React, { useState, useCallback, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X, 
  RefreshCw, 
  FileJson,
  Copy,
  Download,
  Users,
  Target,
  ShieldCheck,
  MessageSquare,
  WifiOff
} from 'lucide-react';
import { 
  PromptDefinition, 
  PromptContext, 
  RenderedPrompt, 
  ValidationResult,
  validatePromptOutput,
  renderPrompt,
  getPromptRegistry,
  formatValidationErrors,
} from '../../lib/prompts';
import { WorkshopContentContext } from '../../data/workshopContentContext';
import { getWorkshopContext } from '../../data/dataService';

// P01 Output type for proper typing
interface P01Output {
  audienceProfiles?: Array<{
    segmentName: string;
    description: string;
    demographics: { ageRange: string; location: string; gender?: string; incomeLevel?: string; occupation?: string };
    psychographics: { values: string[]; interests: string[]; lifestyle: string; motivations: string[] };
    painPoints: string[];
    desires: string[];
    objections: string[];
    preferredChannels: string[];
    contentPreferences: string[];
    buyingTriggers: string[];
  }>;
  positioningStatement?: string;
  uniqueValueProposition?: string;
  competitiveLandscape?: Array<{
    competitorName: string;
    strengths: string[];
    weaknesses: string[];
    ourAdvantage: string;
  }>;
  messagingPillars?: Array<{
    pillar: string;
    description: string;
    supportingPoints: string[];
    targetSegments: string[];
  }>;
  recommendedTone?: string;
  keywordsToUse?: string[];
  keywordsToAvoid?: string[];
}

interface P01ExecutorProps {
  onResult?: (result: {
    success: boolean;
    data?: unknown;
    validation?: ValidationResult;
    error?: string;
    rawResponse?: string;
    latencyMs?: number;
    retryable?: boolean;
    retryAfterMs?: number;
    attempt?: number;
  }) => void;
}

export const P01Executor: React.FC<P01ExecutorProps> = ({ onResult }) => {
  const [step, setStep] = useState<'idle' | 'gathering' | 'validating' | 'rendering' | 'executing' | 'validating-output' | 'complete' | 'error'>('idle');
  const [context, setContext] = useState<WorkshopContentContext | null>(null);
  const [prompt, setPrompt] = useState<PromptDefinition | null>(null);
  const [renderedPrompt, setRenderedPrompt] = useState<RenderedPrompt | { error: string } | null>(null);
  const [executionResult, setExecutionResult] = useState<{
    success: boolean;
    data?: unknown;
    validation?: ValidationResult;
    error?: string;
    rawResponse?: string;
    latencyMs?: number;
    retryable?: boolean;
    retryAfterMs?: number;
    attempt?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load context and prompt on mount
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        setStep('gathering');
        
        // Get workshop context from localStorage
        const workshopContext = getWorkshopContext();
        
        if (!workshopContext) {
          throw new Error('No workshop context found. Please complete the onboarding questionnaire first.');
        }
        
        setContext(workshopContext);
        
        // Get P01 prompt definition
        const registry = getPromptRegistry();
        const p01 = registry.getPrompt('P01');
        
        if (!p01) {
          throw new Error('P01 prompt not found in registry');
        }
        
        setPrompt(p01);
        setStep('validating');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setStep('error');
      }
    };
    
    loadPrompt();
  }, []);

  // Validate inputs and render prompt when context and prompt are ready
  useEffect(() => {
    if (!context || !prompt || step !== 'validating') return;
    
    const validateAndRender = () => {
      try {
        setStep('rendering');
        
        const promptContext: PromptContext = {
          workshopContext: context,
          customInputs: {},
        };
        
        const rendered = renderPrompt('P01', promptContext);
        
        if ('error' in rendered) {
          throw new Error(rendered.error);
        }
        
        if (rendered.missingRequired.length > 0) {
          throw new Error(`Missing required inputs: ${rendered.missingRequired.join(', ')}`);
        }
        
        setRenderedPrompt(rendered);
        setStep('executing');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Validation failed');
        setStep('error');
      }
    };
    
    validateAndRender();
  }, [context, prompt, step]);

  // Execute prompt via API
  const executePrompt = useCallback(async (attempt = 0) => {
    if (!prompt || !renderedPrompt || 'error' in renderedPrompt) return;
    
    try {
      setStep('executing');
      
      const apiUrl = '/api/prompts/execute';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for Clerk session
        body: JSON.stringify({
          promptId: 'P01',
          systemPrompt: renderedPrompt.systemPrompt,
          userPrompt: renderedPrompt.userPrompt,
          model: prompt.modelRequirements.preferred !== 'any' ? prompt.modelRequirements.preferred : undefined,
          temperature: prompt.modelRequirements.temperature,
          maxTokens: prompt.modelRequirements.maxTokens,
          jsonMode: true,
          responseSchema: prompt.outputSchema,
          retryAttempt: attempt,
        }),
      });

      const result = await response.json();

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        setError(result.error || 'Authentication required');
        setExecutionResult({
          success: false,
          error: result.error,
          retryable: false,
        });
        setStep('error');
        onResult?.({
          success: false,
          error: result.error,
          retryable: false,
        });
        return;
      }

      if (!result.success) {
        // Handle retryable errors
        if (result.retryable && result.attempt !== undefined) {
          // Wait for retry delay
          const delayMs = result.retryAfterMs || 2000;
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return executePrompt(result.attempt);
        }
        
        // Non-retryable error
        setError(result.error || 'Execution failed');
        setExecutionResult({
          success: false,
          error: result.error,
          retryable: false,
          attempt: result.attempt,
        });
        setStep('error');
        onResult?.({
          success: false,
          error: result.error,
          retryable: false,
        });
        return;
      }

      // Success - validate output
      const rawText = result.data?.text || '';
      let parsedOutput: unknown;
      
      try {
        parsedOutput = JSON.parse(rawText);
      } catch {
        throw new Error('Invalid JSON response from provider');
      }

      setStep('validating-output');
      
      // Validate against JSON Schema
      const validation = validatePromptOutput(prompt.outputSchema, 'P01', parsedOutput);
      
      const executionResult = {
        success: validation.valid,
        data: validation.valid ? parsedOutput : undefined,
        validation,
        error: validation.valid ? undefined : formatValidationErrors(validation.errors),
        rawResponse: rawText,
        latencyMs: result.data?.latencyMs,
        retryable: false,
      };
      
      setExecutionResult(executionResult);
      
      if (validation.valid) {
        setStep('complete');
      } else {
        setStep('error');
        setError(`Validation failed: ${formatValidationErrors(validation.errors)}`);
      }
      
      onResult?.(executionResult);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Execution failed';
      
      // Check if it's a network error (retryable)
      const isNetworkError = err instanceof TypeError || err instanceof DOMException;
      
      if (isNetworkError && attempt < 3) {
        const delayMs = 1000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return executePrompt(attempt + 1);
      }
      
      setError(errorMessage);
      const result = {
        success: false,
        error: errorMessage,
        retryable: isNetworkError && attempt < 3,
        attempt,
      };
      setExecutionResult(result);
      setStep('error');
      onResult?.(result);
    }
  }, [prompt, renderedPrompt, onResult]);

  const handleRetry = useCallback(() => {
    setRetryCount(c => c + 1);
    setError(null);
    if (step === 'executing' || step === 'validating-output') {
      executePrompt();
    } else {
      setStep('validating');
    }
  }, [executePrompt, step]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleDownload = useCallback((data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  if (step === 'idle' || step === 'gathering' || step === 'validating' || step === 'rendering') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <div>
            <h3 className="font-semibold text-gray-900">Preparing P01 Execution</h3>
            <p className="text-gray-600 text-sm">
              {step === 'gathering' && 'Gathering workshop context...'}
              {step === 'validating' && 'Validating inputs...'}
              {step === 'rendering' && 'Rendering prompt templates...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'executing' || step === 'validating-output') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <div>
            <h3 className="font-semibold text-gray-900">
              {step === 'executing' ? 'Executing Prompt' : 'Validating Output'}
            </h3>
            <p className="text-gray-600 text-sm">
              {step === 'executing' 
                ? 'Calling AI provider...' 
                : 'Validating response against JSON Schema...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

if (step === 'error') {
    const isRetryable = executionResult?.retryable === true;
    const retryAfter = executionResult?.retryAfterMs;
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              {executionResult?.attempt !== undefined && (
                <p className="text-red-600 text-xs mt-1">Attempt {executionResult.attempt + 1} of 3</p>
              )}
            </div>
          </div>
          {isRetryable && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 text-sm">
                <WifiOff className="w-4 h-4" />
                <span>
                  {retryAfter ? `Retrying automatically in ${Math.ceil(retryAfter / 1000)}s...` : 'Auto-retry in progress...'}
                </span>
              </div>
            </div>
          )}
          {(!isRetryable || retryCount >= 3) && (
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {isRetryable ? 'Retry Now' : `Retry (${retryCount + 1}/3)`}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'complete' && executionResult) {
    const data = executionResult.data as P01Output;
    const latencyMs = executionResult.latencyMs || 0;
    
    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="flex items_center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">P01 Execution Complete</h3>
            <p className="text-green-700 text-sm mt-1">
              Output validated successfully against JSON Schema • {latencyMs}ms
            </p>
          </div>
        </div>

        {/* Output Tabs */}
        <div className="space-y-4">
          <div className="border-b border-gray-200">
            <nav className="flex gap-1" aria-label="Output sections">
              {[
                { key: 'audienceProfiles', label: 'Audience Profiles', icon: Users },
                { key: 'positioningStatement', label: 'Positioning', icon: Target },
                { key: 'uniqueValueProposition', label: 'UVP', icon: Zap },
                { key: 'competitiveLandscape', label: 'Competitors', icon: ShieldCheck },
                { key: 'messagingPillars', label: 'Messaging Pillars', icon: MessageSquare },
                { key: 'toneKeywords', label: 'Tone & Keywords', icon: FileJson },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Audience Profiles */}
          {data.audienceProfiles && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7FB3D5]" />
                Audience Profiles ({Array.isArray(data.audienceProfiles) ? data.audienceProfiles.length : 0})
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {(Array.isArray(data.audienceProfiles) ? data.audienceProfiles : []).map((profile: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <h5 className="font-medium text-gray-900 mb-2">{profile.segmentName}</h5>
                    <p className="text-gray-600 text-sm mb-3">{profile.description}</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Demographics:</span> <span className="text-gray-900 ml-2">{profile.demographics?.ageRange}, {profile.demographics?.location}</span></div>
                      <div><span className="text-gray-500">Values:</span> <span className="text-gray-900 ml-2">{profile.psychographics?.values?.join(', ')}</span></div>
                      <div><span className="text-gray-500">Interests:</span> <span className="text-gray-900 ml-2">{profile.psychographics?.interests?.join(', ')}</span></div>
                      <div><span className="text-gray-500">Pain Points:</span> <span className="text-gray-900 ml-2">{profile.painPoints?.join(', ')}</span></div>
                      <div><span className="text-gray-500">Desires:</span> <span className="text-gray-900 ml-2">{profile.desires?.join(', ')}</span></div>
                      <div><span className="text-gray-500">Objections:</span> <span className="text-gray-900 ml-2">{profile.objections?.join(', ')}</span></div>
                      <div><span className="text-gray-500">Channels:</span> <span className="text-gray-900 ml-2">{profile.preferredChannels?.join(', ')}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positioning Statement */}
          {data.positioningStatement && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                Positioning Statement
              </h4>
              <p className="text-gray-700 italic">"{data.positioningStatement}"</p>
            </div>
          )}

          {/* Unique Value Proposition */}
          {data.uniqueValueProposition && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Unique Value Proposition
              </h4>
              <p className="text-gray-700 font-medium">"{data.uniqueValueProposition}"</p>
            </div>
          )}

          {/* Competitive Landscape */}
          {data.competitiveLandscape && Array.isArray(data.competitiveLandscape) && data.competitiveLandscape.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Competitive Landscape
              </h4>
              <div className="space-y-3">
                {data.competitiveLandscape.map((comp: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{comp.competitorName}</h5>
                        <p className="text-gray-600 text-sm mt-1">{comp.ourAdvantage}</p>
                      </div>
                    </div>
                    {comp.strengths?.length && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {comp.strengths.map((s: string, j: number) => (
                          <span key={j} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Strength: {s}</span>
                        ))}
                      </div>
                    )}
                    {comp.weaknesses?.length && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {comp.weaknesses.map((w: string, j: number) => (
                          <span key={j} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Weakness: {w}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messaging Pillars */}
          {data.messagingPillars && Array.isArray(data.messagingPillars) && data.messagingPillars.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Messaging Pillars
              </h4>
              <div className="space-y-3">
                {data.messagingPillars.map((pillar: any, i: number) => (
                  <div key={i} className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <h5 className="font-medium text-gray-900 mb-1">{pillar.pillar}</h5>
                    <p className="text-gray-600 text-sm mb-2">{pillar.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {pillar.supportingPoints?.map((point: string, j: number) => (
                        <span key={j} className="px-2 py-0.5 bg-white text-gray-700 rounded text-xs border">{point}</span>
                      ))}
                    </div>
                    {pillar.targetSegments?.length && (
                      <div className="mt-2 text-xs text-gray-500">
                        Targets: {pillar.targetSegments.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tone & Keywords */}
          {(data.recommendedTone || data.keywordsToUse || data.keywordsToAvoid) && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-gray-600" />
                Tone & Keywords
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                {data.recommendedTone && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <h5 className="font-medium text-gray-900 mb-2">Recommended Tone</h5>
                    <p className="text-gray-700">{data.recommendedTone}</p>
                  </div>
                )}
                {data.keywordsToUse && Array.isArray(data.keywordsToUse) && data.keywordsToUse.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h5 className="font-medium text-gray-900 mb-2">Keywords to Use</h5>
                    <div className="flex flex-wrap gap-1">
                      {data.keywordsToUse.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.keywordsToAvoid && Array.isArray(data.keywordsToAvoid) && data.keywordsToAvoid.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h5 className="font-medium text-gray-900 mb-2">Keywords to Avoid</h5>
                    <div className="flex flex-wrap gap-1">
                      {data.keywordsToAvoid.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw JSON Output */}
          <div className="p-4 bg-gray-900 border border-gray-700 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-100 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-gray-400" />
                Raw JSON Output
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(executionResult.rawResponse || '')}
                  className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleDownload(executionResult.data, 'p01-output.json')}
                  className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            <pre className="text-gray-300 text-xs overflow-x-auto font-mono whitespace-pre-wrap max-h-96">
              {executionResult.rawResponse}
            </pre>
          </div>

          {/* Validation Details */}
          {executionResult.validation && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">Validation Details</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-sm font-medium ${
                    executionResult.validation.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {executionResult.validation.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Errors:</span>
                  <span className="ml-2 text-gray-900 font-mono">{executionResult.validation.errors.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Warnings:</span>
                  <span className="ml-2 text-gray-900 font-mono">{executionResult.validation.warnings.length}</span>
                </div>
              </div>
              {executionResult.validation.warnings.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-900 mb-2">Warnings</h5>
                  <ul className="space-y-1 text-sm text-amber-700">
                    {executionResult.validation.warnings.map((w, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{w.field}: {w.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {executionResult.validation.errors.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-900 mb-2">Errors</h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    {executionResult.validation.errors.map((e, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        <span>{e.field}: {e.message} ({e.code})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Retry Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleRetry}
              className="w-full px-6 py-3 bg-[#7FB3D5] text-white rounded-xl font-medium hover:bg-[#6DB0D0] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Execute Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}