import { describe, it, expect } from 'vitest';
import { 
  getPromptDefinition, 
  getAllPromptDefinitions, 
  getImplementedPrompts,
  getPromptStatusSummary,
} from '../lib/prompts/catalogue';
import { P01_DEFINITION } from '../lib/prompts/prompts/P01-business-audience-research';
import { PROMPT_CATEGORIES } from '../lib/prompts/types';

describe('Prompt Catalogue', () => {
  describe('Catalogue Structure', () => {
    it('has all 9 prompt categories defined', () => {
      expect(PROMPT_CATEGORIES).toHaveLength(9);
      const ids = PROMPT_CATEGORIES.map(c => c.id);
      expect(ids).toEqual(['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09']);
    });

    it('each category has required properties', () => {
      for (const cat of PROMPT_CATEGORIES) {
        expect(cat.id).toBeTruthy();
        expect(cat.label).toBeTruthy();
        expect(cat.description).toBeTruthy();
        expect(cat.icon).toBeTruthy();
        expect(cat.color).toBeTruthy();
        expect(cat.promptIds).toBeInstanceOf(Array);
      }
    });
  });

  describe('P01 Definition', () => {
    it('exists in catalogue', () => {
      const prompt = getPromptDefinition('P01');
      expect(prompt).toBeDefined();
      expect(prompt?.id).toBe('P01');
    });

    it('has implemented status', () => {
      const prompt = getPromptDefinition('P01');
      expect(prompt?.status).toBe('implemented');
    });

    it('has all required fields populated', () => {
      const prompt = getPromptDefinition('P01');
      expect(prompt?.name).toBe('Business & Audience Research');
      expect(prompt?.purpose).toBeTruthy();
      expect(prompt?.systemPrompt).toBeTruthy();
      expect(prompt?.userPromptTemplate).toBeTruthy();
      expect(prompt?.inputs).toBeInstanceOf(Array);
      expect(prompt?.inputs.length).toBeGreaterThan(0);
      expect(prompt?.outputSchema).toBeDefined();
      expect(prompt?.outputSchema.type).toBe('object');
      expect(prompt?.outputSchema.required).toBeInstanceOf(Array);
      expect(prompt?.outputFields).toBeInstanceOf(Array);
      expect(prompt?.contextDependencies).toBeDefined();
      expect(prompt?.approvalRequirements).toBeDefined();
      expect(prompt?.modelRequirements).toBeDefined();
      expect(prompt?.metadata).toBeDefined();
      expect(prompt?.testCases).toBeInstanceOf(Array);
    });

    it('has valid output schema structure', () => {
      const prompt = getPromptDefinition('P01');
      const schema = prompt?.outputSchema;
      expect(schema?.properties).toBeDefined();
      expect(schema?.properties?.audienceProfiles).toBeDefined();
      expect(schema?.properties?.positioningStatement).toBeDefined();
      expect(schema?.properties?.uniqueValueProposition).toBeDefined();
      expect(schema?.properties?.messagingPillars).toBeDefined();
      expect(schema?.properties?.recommendedTone).toBeDefined();
      expect(schema?.required).toContain('audienceProfiles');
      expect(schema?.required).toContain('positioningStatement');
      expect(schema?.required).toContain('uniqueValueProposition');
      expect(schema?.required).toContain('messagingPillars');
      expect(schema?.required).toContain('recommendedTone');
    });

    it('has test cases defined', () => {
      const prompt = getPromptDefinition('P01');
      expect(prompt?.testCases.length).toBeGreaterThan(0);
      
      const testCase = prompt?.testCases[0];
      expect(testCase?.name).toBeTruthy();
      expect(testCase?.inputs).toBeDefined();
      expect(testCase?.expectedOutputShape).toBeDefined();
      expect(testCase?.shouldPass).toBe(true);
    });
  });

  describe('Placeholder Prompts (P02-P09)', () => {
    it('all exist in catalogue', () => {
      for (let i = 2; i <= 9; i++) {
        const id = `P0${i}`;
        const prompt = getPromptDefinition(id);
        expect(prompt).toBeDefined();
        expect(prompt?.id).toBe(id);
      }
    });

    it('all have planned status', () => {
      for (let i = 2; i <= 9; i++) {
        const id = `P0${i}`;
        const prompt = getPromptDefinition(id);
        expect(prompt?.status).toBe('planned');
      }
    });
  });

  describe('Catalogue Queries', () => {
    it('getAllPromptDefinitions returns all 9', () => {
      const all = getAllPromptDefinitions();
      expect(all).toHaveLength(9);
    });

    it('getImplementedPrompts returns only P01', () => {
      const implemented = getImplementedPrompts();
      expect(implemented).toHaveLength(1);
      expect(implemented[0].id).toBe('P01');
    });

    it('getPromptStatusSummary returns correct counts', () => {
      const summary = getPromptStatusSummary();
      expect(summary.P01.implemented).toBe(1);
      expect(summary.P02.planned).toBe(1);
      expect(summary.P03.planned).toBe(1);
      // ... etc for all
    });
  });

  describe('P01 Definition Matches Exported Constant', () => {
    it('catalogue P01 matches direct export', () => {
      const fromCatalogue = getPromptDefinition('P01');
      expect(fromCatalogue).toEqual(P01_DEFINITION);
    });
  });
});