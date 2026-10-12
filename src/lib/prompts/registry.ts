import type { PromptDefinition, PromptContext, RenderedPrompt } from './types';
import { getPromptDefinition, getAllPromptDefinitions } from './catalogue';

export class PromptRegistry {
  private static instance: PromptRegistry;
  private customPrompts: Map<string, PromptDefinition> = new Map();
  
  private constructor() {}
  
  static getInstance(): PromptRegistry {
    if (!PromptRegistry.instance) {
      PromptRegistry.instance = new PromptRegistry();
    }
    return PromptRegistry.instance;
  }
  
  getPrompt(id: string): PromptDefinition | undefined {
    return this.customPrompts.get(id) || getPromptDefinition(id);
  }
  
  getAllPrompts(): PromptDefinition[] {
    const builtIn = getAllPromptDefinitions();
    const custom = Array.from(this.customPrompts.values());
    return [...builtIn, ...custom];
  }
  
  registerPrompt(prompt: PromptDefinition): void {
    this.customPrompts.set(prompt.id, prompt);
  }
  
  unregisterPrompt(id: string): boolean {
    return this.customPrompts.delete(id);
  }
  
  getPromptsByStatus(status: PromptDefinition['status']): PromptDefinition[] {
    return this.getAllPrompts().filter(p => p.status === status);
  }
  
  searchPrompts(query: string): PromptDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPrompts().filter(p => 
      p.id.toLowerCase().includes(lowerQuery) ||
      p.name.toLowerCase().includes(lowerQuery) ||
      p.purpose.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.metadata.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
  
  filterPromptsByCategory(categoryId: string): PromptDefinition[] {
    return this.getAllPrompts().filter(p => p.category === categoryId);
  }
}

export function renderPromptTemplate(
  template: string,
  context: Record<string, unknown>
): string {
  let rendered = template;
  
  // Simple Handlebars-like replacement for {{variable}} and {{#if variable}}...{{/if}}
  // Replace {{variable}} with context value
  rendered = rendered.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const value = getNestedValue(context, path);
    return value !== undefined && value !== null ? String(value) : '';
  });
  
  // Handle {{#if variable}}...{{/if}} blocks
  rendered = rendered.replace(/\{\{#if (\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, content) => {
    const value = getNestedValue(context, path);
    return (value !== undefined && value !== null && value !== '' && 
            !(Array.isArray(value) && value.length === 0)) ? content : '';
  });
  
  return rendered;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function validatePromptInputs(
  prompt: PromptDefinition,
  context: PromptContext
): { valid: boolean; missingRequired: string[]; inputsUsed: Record<string, unknown> } {
  const missingRequired: string[] = [];
  const inputsUsed: Record<string, unknown> = {};
  
  for (const input of prompt.inputs) {
    let value: unknown;
    
    switch (input.source) {
      case 'workshop_context':
        value = input.key === 'workshopContext' ? context.workshopContext : getNestedValue(context.workshopContext as unknown as Record<string, unknown> || {}, input.key);
        break;
      case 'strategy':
        value = context.strategy;
        break;
      case 'calendar':
        value = context.calendarData;
        break;
      case 'assets':
        value = context.assets;
        break;
      case 'offers':
        value = context.offers;
        break;
      case 'client_profile':
        value = context.clientProfile;
        break;
      case 'manual':
        value = context.customInputs?.[input.key];
        break;
      default:
        value = context.customInputs?.[input.key];
    }
    
    if (value !== undefined && value !== null && value !== '') {
      inputsUsed[input.key] = value;
    } else if (input.required) {
      missingRequired.push(input.key);
    } else if (input.defaultValue !== undefined) {
      inputsUsed[input.key] = input.defaultValue;
    }
  }
  
  return {
    valid: missingRequired.length === 0,
    missingRequired,
    inputsUsed,
  };
}

export function renderPrompt(
  promptId: string,
  context: PromptContext
): RenderedPrompt | { error: string } {
  const registry = PromptRegistry.getInstance();
  const prompt = registry.getPrompt(promptId);
  
  if (!prompt) {
    return { error: `Prompt ${promptId} not found` };
  }
  
  const validation = validatePromptInputs(prompt, context);
  
  const fullContext = {
    ...context,
    ...validation.inputsUsed,
  } as Record<string, unknown>;
  
  const systemPrompt = renderPromptTemplate(prompt.systemPrompt, fullContext);
  const userPrompt = renderPromptTemplate(prompt.userPromptTemplate, fullContext);
  
  return {
    systemPrompt,
    userPrompt,
    inputsUsed: validation.inputsUsed,
    missingRequired: validation.missingRequired,
  };
}

export function getPromptRegistry(): PromptRegistry {
  return PromptRegistry.getInstance();
}