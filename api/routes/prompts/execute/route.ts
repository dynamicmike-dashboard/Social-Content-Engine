// POST /api/prompts/execute
// Execute a prompt with real LLM provider
// Server-side only - credentials never exposed to client

import { getGeminiAdapter } from '../../../../lib/gemini';
import { createTeableService } from '../../../../../teable/service';
import { AuthService, getAuthenticatedUser } from '../../../../../auth/service';
import { ProviderError, isRetryableError, getRetryDelay } from '../../../../lib/providers';

interface ExecutePromptRequest {
  promptId: string;
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  responseSchema?: Record<string, unknown>;
  retryAttempt?: number;
}

interface ExecutePromptResponse {
  success: boolean;
  data?: {
    text: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    model: string;
    provider: string;
    latencyMs: number;
    finishReason?: string;
  };
  validation?: {
    valid: boolean;
    errors: Array<{ field: string; message: string; code: string }>;
    warnings: Array<{ field: string; message: string; code: string }>;
  };
  error?: string;
  errorCode?: string;
  retryable?: boolean;
  retryAfterMs?: number;
  attempt?: number;
}

const MAX_RETRIES = 3;
const RETRYABLE_CODES = ['RATE_LIMIT', 'TIMEOUT', 'PROVIDER_ERROR', 'MODEL_UNAVAILABLE'];

// Server-side execution safeguards
const MAX_REQUEST_BODY_SIZE = 1024 * 1024; // 1 MB
const MAX_SYSTEM_PROMPT_LENGTH = 50000; // 50 KB
const MAX_USER_PROMPT_LENGTH = 50000; // 50 KB
const MAX_OUTPUT_TOKENS = 8192;
const PROVIDER_TIMEOUT_MS = 60000; // 60 seconds

// Server-approved prompt configurations
interface PromptConfig {
  allowedModels: string[];
  defaultModel: string;
  maxTemperature: number;
  maxMaxTokens: number;
  requiredJsonMode: boolean;
}

const PROMPT_CONFIGS: Record<string, PromptConfig> = {
  P01: {
    allowedModels: ['gemini-1.5-flash', 'gemini-1.5-pro'],
    defaultModel: 'gemini-1.5-flash',
    maxTemperature: 0.5,
    maxMaxTokens: 8192,
    requiredJsonMode: true,
  },
};

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // 1. Enforce request size limit
    const contentLength = request.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_BODY_SIZE) {
      return Response.json({ 
        success: false, 
        error: 'Request body too large',
        errorCode: 'PAYLOAD_TOO_LARGE'
      }, { status: 413 });
    }

    // 2. Require authentication - no demo mode bypass
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'Not authenticated',
        errorCode: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    // 3. Verify client membership
    const teable = createTeableService();
    const authService = new AuthService(teable);
    const membership = await authService.getClientMembership(user);
    
    if (!membership) {
      return Response.json({ 
        success: false, 
        error: 'Access denied - no active client membership',
        errorCode: 'FORBIDDEN'
      }, { status: 403 });
    }

    // 4. Parse and validate request body
    let body: ExecutePromptRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json({ 
        success: false, 
        error: 'Invalid JSON body',
        errorCode: 'INVALID_REQUEST'
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.promptId) {
      return Response.json({ 
        success: false, 
        error: 'promptId is required',
        errorCode: 'INVALID_REQUEST'
      }, { status: 400 });
    }
    
    if (!body.systemPrompt || !body.userPrompt) {
      return Response.json({ 
        success: false, 
        error: 'systemPrompt and userPrompt are required',
        errorCode: 'INVALID_REQUEST'
      }, { status: 400 });
    }

    // 5. Validate prompt ID against server-side catalogue
    const promptConfig = PROMPT_CONFIGS[body.promptId];
    if (!promptConfig) {
      return Response.json({ 
        success: false, 
        error: `Prompt ${body.promptId} not available for execution`,
        errorCode: 'NOT_IMPLEMENTED'
      }, { status: 400 });
    }

    // 6. Validate prompt content sizes
    if (body.systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
      return Response.json({ 
        success: false, 
        error: `systemPrompt exceeds maximum length of ${MAX_SYSTEM_PROMPT_LENGTH} characters`,
        errorCode: 'PAYLOAD_TOO_LARGE'
      }, { status: 413 });
    }
    
    if (body.userPrompt.length > MAX_USER_PROMPT_LENGTH) {
      return Response.json({ 
        success: false, 
        error: `userPrompt exceeds maximum length of ${MAX_USER_PROMPT_LENGTH} characters`,
        errorCode: 'PAYLOAD_TOO_LARGE'
      }, { status: 413 });
    }

    // 7. Validate and sanitize model parameters
    const model = body.model || promptConfig.defaultModel;
    if (!promptConfig.allowedModels.includes(model)) {
      return Response.json({ 
        success: false, 
        error: `Model ${model} not allowed for prompt ${body.promptId}`,
        errorCode: 'INVALID_REQUEST'
      }, { status: 400 });
    }

    const temperature = Math.min(Math.max(body.temperature ?? 0.3, 0), promptConfig.maxTemperature);
    const maxTokens = Math.min(body.maxTokens ?? promptConfig.maxMaxTokens, promptConfig.maxMaxTokens, MAX_OUTPUT_TOKENS);
    const jsonMode = promptConfig.requiredJsonMode ? true : (body.jsonMode ?? false);

    // 8. Validate response schema if provided
    let responseSchema = body.responseSchema;
    if (jsonMode && !responseSchema) {
      return Response.json({ 
        success: false, 
        error: 'responseSchema is required when jsonMode is true',
        errorCode: 'INVALID_REQUEST'
      }, { status: 400 });
    }

    const attempt = Math.min(body.retryAttempt || 0, MAX_RETRIES);
    const adapter = getGeminiAdapter();

    // 9. Execute with timeout
    const executeWithTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Provider timeout')), ms);
      });
      return Promise.race([promise, timeoutPromise]);
    };

    try {
      const result = await executeWithTimeout(
        adapter.generate({
          systemPrompt: body.systemPrompt,
          userPrompt: body.userPrompt,
          model,
          temperature,
          maxTokens,
          jsonMode,
          responseSchema,
        }),
        PROVIDER_TIMEOUT_MS
      );

      const latencyMs = Date.now() - startTime;

      return Response.json({
        success: true,
        data: {
          text: result.text,
          usage: result.usage,
          model: result.model,
          provider: result.provider,
          latencyMs,
          finishReason: result.finishReason,
        }
      });

    } catch (error) {
      const isRetryable = isRetryableError(error);
      const providerError = error as ProviderError;
      const errorCode = providerError.code || 'PROVIDER_ERROR';
      
      // Check if we should retry
      const shouldRetry = isRetryable && attempt < MAX_RETRIES && RETRYABLE_CODES.includes(errorCode);
      
      if (shouldRetry) {
        const delayMs = getRetryDelay(attempt);
        return Response.json({
          success: false,
          error: providerError.message,
          errorCode,
          retryable: true,
          retryAfterMs: providerError.retryAfterMs || delayMs,
          attempt: attempt + 1,
        }, { status: 429 });
      }

      // Non-retryable or max retries exceeded
      return Response.json({
        success: false,
        error: providerError.message,
        errorCode,
        retryable: false,
        attempt,
      }, { status: providerError.statusCode || 500 });
    }

  } catch (error) {
    console.error('Error in POST /api/prompts/execute:', error);
    return Response.json({ 
      success: false, 
      error: 'Internal server error',
      errorCode: 'INTERNAL_ERROR',
      retryable: false
    }, { status: 500 });
  }
}

// Also support GET for health check
export async function GET(request: Request) {
  try {
    // Require authentication for health check too
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'Not authenticated',
        errorCode: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const adapter = getGeminiAdapter();
    const validation = await adapter.validateConfig();
    
    return Response.json({
      status: validation.valid ? 'configured' : 'not_configured',
      provider: 'gemini',
      error: validation.error,
      models: adapter.config.models.map(m => m.id),
      defaultModel: adapter.config.defaultModel,
    });
  } catch (error) {
    return Response.json({
      status: 'error',
      provider: 'gemini',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}