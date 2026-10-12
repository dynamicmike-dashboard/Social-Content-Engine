// Gemini Provider Adapter
// Server-side only - uses Google Generative AI SDK

import { GoogleGenerativeAI, GenerativeModel, GenerationConfig, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ProviderAdapter, ProviderConfig, ProviderModel, GenerateOptions, GenerateResult, ProviderError, createProviderError } from './providers';

const GEMINI_CONFIG: ProviderConfig = {
  id: 'gemini',
  name: 'Google Gemini',
  models: [
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      contextWindow: 2000000,
      maxOutputTokens: 8192,
      supportsJsonMode: true,
      supportsFunctionCalling: true,
      pricing: { inputPer1k: 0.0035, outputPer1k: 0.0105 }
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      contextWindow: 1000000,
      maxOutputTokens: 8192,
      supportsJsonMode: true,
      supportsFunctionCalling: true,
      pricing: { inputPer1k: 0.000075, outputPer1k: 0.0003 }
    },
    {
      id: 'gemini-1.0-pro',
      name: 'Gemini 1.0 Pro',
      contextWindow: 32768,
      maxOutputTokens: 2048,
      supportsJsonMode: true,
      supportsFunctionCalling: false,
      pricing: { inputPer1k: 0.0005, outputPer1k: 0.0015 }
    }
  ],
  defaultModel: 'gemini-1.5-flash',
  supportsStructuredOutput: true,
  supportsStreaming: true,
  maxTokens: 8192,
  rateLimits: {
    requestsPerMinute: 60,
    tokensPerMinute: 1000000
  }
};

export class GeminiAdapter implements ProviderAdapter {
  readonly config = GEMINI_CONFIG;
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || null;
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    this.client = new GoogleGenerativeAI(key);
  }

  async validateConfig(): Promise<{ valid: boolean; error?: string }> {
    if (!this.apiKey) {
      return { valid: false, error: 'GEMINI_API_KEY not configured' };
    }
    if (!this.client) {
      return { valid: false, error: 'Client not initialized' };
    }
    try {
      // Test with a minimal request
      const model = this.client.getGenerativeModel({ model: this.config.defaultModel });
      await model.generateContent('test');
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Validation failed' };
    }
  }

  private getModel(modelId?: string): GenerativeModel {
    if (!this.client) {
      throw createProviderError('Gemini client not initialized. API key required.', 'UNAUTHORIZED', {
        provider: 'gemini',
        retryable: false
      });
    }
    const model = modelId || this.config.defaultModel;
    const modelConfig = this.config.models.find(m => m.id === model);
    if (!modelConfig) {
      throw createProviderError(`Model ${model} not supported`, 'INVALID_REQUEST', {
        provider: 'gemini',
        model,
        retryable: false
      });
    }
    return this.client.getGenerativeModel({ model });
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const startTime = Date.now();
    const model = this.getModel(options.model);

    const generationConfig: GenerationConfig = {
      temperature: options.temperature ?? 0.3,
      maxOutputTokens: options.maxTokens ?? this.config.maxTokens,
      candidateCount: 1,
    };

    if (options.jsonMode && options.responseSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = options.responseSchema as any;
    }

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    try {
      const prompt = options.systemPrompt 
        ? `${options.systemPrompt}\n\n${options.userPrompt}`
        : options.userPrompt;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw createProviderError('Empty response from model', 'PROVIDER_ERROR', {
          provider: 'gemini',
          model: options.model,
          retryable: true
        });
      }

      const latencyMs = Date.now() - startTime;

      // Extract usage metadata if available
      let usage: GenerateResult['usage'] = undefined;
      try {
        const usageMetadata = (response as any).usageMetadata;
        if (usageMetadata) {
          usage = {
            promptTokens: usageMetadata.promptTokenCount || 0,
            completionTokens: usageMetadata.candidatesTokenCount || 0,
            totalTokens: usageMetadata.totalTokenCount || 0,
          };
        }
      } catch {
        // Usage metadata not available
      }

      return {
        text,
        usage,
        model: options.model || this.config.defaultModel,
        provider: 'gemini',
        latencyMs,
        finishReason: (response as any).candidates?.[0]?.finishReason,
      };
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        throw error; // Already a ProviderError
      }
      throw this.mapError(error, options.model);
    }
  }

  private mapError(error: unknown, model?: string): ProviderError {
    const message = error instanceof Error ? error.message : String(error);
    
    // Check for specific error patterns
    if (message.includes('API_KEY') || message.includes('unauthorized') || message.includes('401')) {
      return createProviderError('Invalid or missing API key', 'UNAUTHORIZED', {
        provider: 'gemini',
        model,
        retryable: false
      });
    }
    if (message.includes('quota') || message.includes('429') || message.includes('rate limit')) {
      const retryAfter = message.includes('retryDelay') 
        ? parseInt(message.match(/retryDelay["']?\s*[:=]\s*["']?(\d+)/)?.[1] || '60000')
        : 60000;
      return createProviderError('Rate limit exceeded', 'RATE_LIMIT', {
        provider: 'gemini',
        model,
        retryable: true,
        retryAfterMs: retryAfter,
        statusCode: 429
      });
    }
    if (message.includes('timeout') || message.includes('ETIMEDOUT') || message.includes('deadline')) {
      return createProviderError('Request timeout', 'TIMEOUT', {
        provider: 'gemini',
        model,
        retryable: true
      });
    }
    if (message.includes('model') && (message.includes('not found') || message.includes('unavailable'))) {
      return createProviderError('Model unavailable', 'MODEL_UNAVAILABLE', {
        provider: 'gemini',
        model,
        retryable: true
      });
    }
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('internal')) {
      return createProviderError(`Provider error: ${message}`, 'PROVIDER_ERROR', {
        provider: 'gemini',
        model,
        retryable: true,
        statusCode: 500
      });
    }

    return createProviderError(`Generation failed: ${message}`, 'PROVIDER_ERROR', {
      provider: 'gemini',
      model,
      retryable: true
    });
  }
}

// Singleton instance for serverless environments
let geminiInstance: GeminiAdapter | null = null;

export function getGeminiAdapter(): GeminiAdapter {
  if (!geminiInstance) {
    geminiInstance = new GeminiAdapter();
  }
  return geminiInstance;
}

export function initializeGeminiAdapter(apiKey: string): GeminiAdapter {
  geminiInstance = new GeminiAdapter(apiKey);
  return geminiInstance;
}