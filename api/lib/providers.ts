// LLM Provider Abstraction Layer
// Server-side only - never expose to client

export type ProviderId = 'gemini' | 'openrouter' | 'anthropic' | 'openai';

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  models: ProviderModel[];
  defaultModel: string;
  supportsStructuredOutput: boolean;
  supportsStreaming: boolean;
  maxTokens: number;
  rateLimits?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface ProviderModel {
  id: string;
  name: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsJsonMode: boolean;
  supportsFunctionCalling: boolean;
  pricing?: {
    inputPer1k: number;
    outputPer1k: number;
  };
}

export interface GenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  responseSchema?: Record<string, unknown>;
}

export interface GenerateResult {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: ProviderId;
  latencyMs: number;
  finishReason?: string;
}

export interface ProviderError extends Error {
  code: 'RATE_LIMIT' | 'TIMEOUT' | 'INVALID_REQUEST' | 'PROVIDER_ERROR' | 'UNAUTHORIZED' | 'QUOTA_EXCEEDED' | 'MODEL_UNAVAILABLE' | 'UNKNOWN';
  retryable: boolean;
  statusCode?: number;
  provider?: ProviderId;
  model?: string;
  retryAfterMs?: number;
}

export interface ProviderAdapter {
  readonly config: ProviderConfig;
  generate(options: GenerateOptions): Promise<GenerateResult>;
  validateConfig(): Promise<{ valid: boolean; error?: string }>;
}

// Provider registry for white-label compatibility
export class ProviderRegistry {
  private static adapters: Map<ProviderId, ProviderAdapter> = new Map();
  private static defaultProvider: ProviderId | null = null;

  static register(adapter: ProviderAdapter): void {
    ProviderRegistry.adapters.set(adapter.config.id, adapter);
  }

  static get(id: ProviderId): ProviderAdapter | undefined {
    return ProviderRegistry.adapters.get(id);
  }

  static getDefault(): ProviderAdapter | undefined {
    if (ProviderRegistry.defaultProvider) {
      return ProviderRegistry.adapters.get(ProviderRegistry.defaultProvider);
    }
    // Return first available
    return ProviderRegistry.adapters.values().next().value;
  }

  static setDefault(id: ProviderId): void {
    if (!ProviderRegistry.adapters.has(id)) {
      throw new Error(`Provider ${id} not registered`);
    }
    ProviderRegistry.defaultProvider = id;
  }

  static list(): ProviderConfig[] {
    return Array.from(ProviderRegistry.adapters.values()).map(a => a.config);
  }
}

export function createProviderError(
  message: string,
  code: ProviderError['code'],
  options: {
    retryable?: boolean;
    statusCode?: number;
    provider?: ProviderId;
    model?: string;
    retryAfterMs?: number;
  } = {}
): ProviderError {
  const error = new Error(message) as ProviderError;
  error.code = code;
  error.retryable = options.retryable ?? false;
  error.statusCode = options.statusCode;
  error.provider = options.provider;
  error.model = options.model;
  error.retryAfterMs = options.retryAfterMs;
  return error;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    const providerError = error as ProviderError;
    return providerError.retryable === true;
  }
  // Network errors are generally retryable
  return error instanceof TypeError || error instanceof DOMException;
}

export function getRetryDelay(attempt: number, baseDelayMs: number = 1000, maxDelayMs: number = 30000): number {
  const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
  // Add jitter
  return delay + Math.random() * 1000;
}