import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createProviderError, 
  isRetryableError, 
  getRetryDelay,
  ProviderRegistry,
  ProviderAdapter,
  ProviderConfig,
  GenerateResult,
  ProviderId,
  ProviderError,
} from '../lib/providers/providers';

// Mock provider adapter for testing
const createMockAdapter = (shouldFail = false, errorCode?: ProviderError['code']): ProviderAdapter => {
  const config: ProviderConfig = {
    id: 'gemini' as ProviderId,
    name: 'Mock Provider',
    models: [{
      id: 'mock-model',
      name: 'Mock',
      contextWindow: 4096,
      maxOutputTokens: 2048,
      supportsJsonMode: true,
      supportsFunctionCalling: false,
    }],
    defaultModel: 'mock-model',
    supportsStructuredOutput: true,
    supportsStreaming: false,
    maxTokens: 2048,
  };

  return {
    config,
    async generate() {
      if (shouldFail) {
        const error = createProviderError('Mock error', errorCode || 'PROVIDER_ERROR', {
          provider: 'gemini' as ProviderId,
          retryable: errorCode === 'RATE_LIMIT' || errorCode === 'TIMEOUT',
        });
        throw error;
      }
      return {
        text: '{"test": "output"}',
        usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
        model: 'mock-model',
        provider: 'gemini' as ProviderId,
        latencyMs: 100,
      } as GenerateResult;
    },
    async validateConfig() {
      return { valid: true };
    },
  };
};

describe('Provider Abstraction', () => {
  beforeEach(() => {
    // Clear registry
    (ProviderRegistry as any).adapters.clear();
    (ProviderRegistry as any).defaultProvider = null;
  });

  describe('ProviderRegistry', () => {
    it('registers and retrieves adapters', () => {
      const adapter = createMockAdapter();
      ProviderRegistry.register(adapter);
      
      expect(ProviderRegistry.get('gemini')).toBe(adapter);
      expect(ProviderRegistry.list()).toHaveLength(1);
    });

    it('sets and gets default provider', () => {
      const adapter = createMockAdapter();
      ProviderRegistry.register(adapter);
      ProviderRegistry.setDefault('gemini');
      
      expect(ProviderRegistry.getDefault()).toBe(adapter);
    });

    it('throws on unknown default', () => {
      expect(() => ProviderRegistry.setDefault('unknown' as ProviderId)).toThrow('Provider unknown not registered');
    });
  });

  describe('createProviderError', () => {
    it('creates error with correct properties', () => {
      const error = createProviderError('Test error', 'RATE_LIMIT', {
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        retryable: true,
        statusCode: 429,
        retryAfterMs: 60000,
      });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('RATE_LIMIT');
      expect(error.retryable).toBe(true);
      expect(error.provider).toBe('gemini');
      expect(error.model).toBe('gemini-1.5-pro');
      expect(error.statusCode).toBe(429);
      expect(error.retryAfterMs).toBe(60000);
    });
  });

  describe('isRetryableError', () => {
    it('returns true for ProviderError with retryable=true', () => {
      const error = createProviderError('Rate limited', 'RATE_LIMIT', { retryable: true });
      expect(isRetryableError(error)).toBe(true);
    });

    it('returns false for ProviderError with retryable=false', () => {
      const error = createProviderError('Invalid request', 'INVALID_REQUEST', { retryable: false });
      expect(isRetryableError(error)).toBe(false);
    });

    it('returns true for network errors (TypeError)', () => {
      expect(isRetryableError(new TypeError('Network error'))).toBe(true);
    });

    it('returns true for DOMException (abort)', () => {
      expect(isRetryableError(new DOMException('Aborted', 'AbortError'))).toBe(true);
    });

    it('returns false for regular errors', () => {
      expect(isRetryableError(new Error('Regular error'))).toBe(false);
    });
  });

  describe('getRetryDelay', () => {
    it('uses exponential backoff', () => {
      expect(getRetryDelay(0, 1000, 10000)).toBeGreaterThanOrEqual(1000);
      expect(getRetryDelay(0, 1000, 10000)).toBeLessThanOrEqual(11000);
      
      expect(getRetryDelay(1, 1000, 10000)).toBeGreaterThanOrEqual(2000);
      expect(getRetryDelay(1, 1000, 10000)).toBeLessThanOrEqual(11000);
      
      expect(getRetryDelay(2, 1000, 10000)).toBeGreaterThanOrEqual(4000);
      expect(getRetryDelay(2, 1000, 10000)).toBeLessThanOrEqual(11000);
    });

    it('caps at maxDelay', () => {
      const delay = getRetryDelay(10, 1000, 5000);
      expect(delay).toBeLessThanOrEqual(6000); // maxDelay + jitter
    });

    it('adds jitter', () => {
      const delays = new Set();
      for (let i = 0; i < 100; i++) {
        delays.add(getRetryDelay(0, 1000, 10000));
      }
      // Should have variation due to jitter
      expect(delays.size).toBeGreaterThan(1);
    });
  });
});

describe('Provider Adapter Integration (Mock)', () => {
  it('successful generation returns structured result', async () => {
    const adapter = createMockAdapter();
    const result = await adapter.generate({
      systemPrompt: 'System',
      userPrompt: 'User',
    });

    expect(result.text).toBe('{"test": "output"}');
    expect(result.usage).toBeDefined();
    expect(result.model).toBe('mock-model');
    expect(result.provider).toBe('gemini');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('failed generation throws retryable error for rate limit', async () => {
    const adapter = createMockAdapter(true, 'RATE_LIMIT');
    
    await expect(adapter.generate({
      systemPrompt: 'System',
      userPrompt: 'User',
    })).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      retryable: true,
    });
  });

  it('failed generation throws non-retryable error for invalid request', async () => {
    const adapter = createMockAdapter(true, 'INVALID_REQUEST');
    
    await expect(adapter.generate({
      systemPrompt: 'System',
      userPrompt: 'User',
    })).rejects.toMatchObject({
      code: 'INVALID_REQUEST',
      retryable: false,
    });
  });
});