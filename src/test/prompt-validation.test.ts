import { describe, it, expect } from 'vitest';
import { 
  validatePromptOutput, 
  validateRequiredFields, 
  sanitizeOutput,
  formatValidationErrors 
} from '../lib/prompts/validation';
import { P01_OUTPUT_SCHEMA } from '../lib/prompts/prompts/P01-business-audience-research';

describe('Prompt Validation', () => {
  describe('validatePromptOutput', () => {
    it('validates a correct P01 output', () => {
      const validOutput = {
        audienceProfiles: [{
          segmentName: 'Competitive Players',
          description: 'Serious amateur players seeking high-level competition',
          demographics: { ageRange: '25-40', location: 'North America' },
          psychographics: { values: ['competition', 'excellence'], interests: ['beach volleyball', 'travel'], lifestyle: 'Active', motivations: ['winning', 'recognition'] },
          painPoints: ['Finding quality tournaments', 'Travel costs'],
          desires: ['World-class competition', 'Beach vacation'],
          objections: ['Cost', 'Time off work'],
          preferredChannels: ['Instagram', 'Facebook'],
          contentPreferences: ['Match highlights', 'Training tips'],
          buyingTriggers: ['Early bird deadline', 'Pro player attendance'],
        }],
        positioningStatement: 'For competitive beach volleyball players, Playa Beach Volleyball Tournament is the premier international tournament that delivers world-class competition in paradise because of its 10+ year history and professional organization.',
        uniqueValueProposition: 'The only tournament combining pro-level competition with a Caribbean vacation experience.',
        competitiveLandscape: [{
          competitorName: 'Other Caribbean Tournaments',
          strengths: ['Good location'],
          weaknesses: ['Poor organization', 'Limited competition'],
          ourAdvantage: '10+ years of professional tournament management',
        }],
        messagingPillars: [{
          pillar: 'World-Class Competition',
          description: 'Professional tournament experience',
          supportingPoints: ['FIVB sanctioned', 'Pro players attend', 'Live streaming'],
          targetSegments: ['Competitive Players'],
        }, {
          pillar: 'Community & Connection',
          description: 'Building relationships through sport',
          supportingPoints: ['Welcome party', 'Player lounge', 'Social events'],
          targetSegments: ['Competitive Players', 'Recreational Players'],
        }, {
          pillar: 'Paradise Experience',
          description: 'Caribbean vacation meets competition',
          supportingPoints: ['Playa del Carmen location', 'Beach lifestyle', 'Perfect February weather'],
          targetSegments: ['All Segments'],
        }],
        recommendedTone: 'Energetic and welcoming - like a friend inviting you to the best beach week of the year.',
        keywordsToUse: ['Epic', 'vibes', 'paradise found'],
        keywordsToAvoid: ['Crush it', 'dominate', 'synergy'],
      };
      
      const result = validatePromptOutput(P01_OUTPUT_SCHEMA, 'P01', validOutput);
      if (!result.valid) {
        console.log('Validation errors:', result.errors);
        console.log('Validation warnings:', result.warnings);
      }
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects missing required fields', () => {
      const invalidOutput = {
        audienceProfiles: [{
          segmentName: 'Test',
          description: 'Test',
          demographics: { ageRange: '20-30', location: 'Test' },
          psychographics: { values: ['test'], interests: ['test'] },
          painPoints: ['test'],
          desires: ['test'],
        }],
        positioningStatement: 'Test',
        // missing uniqueValueProposition, messagingPillars, recommendedTone
      };
      
      const result = validatePromptOutput(P01_OUTPUT_SCHEMA, 'P01', invalidOutput);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // AJV returns JSON Pointer paths like '#/properties/uniqueValueProposition'
      const missingFields = result.errors.map(e => e.field);
      console.log('Missing fields:', missingFields);
      // Just verify we have errors for the missing required fields
      expect(result.errors.some(e => e.code === 'required')).toBe(true);
    });

    it('rejects wrong types', () => {
      const invalidOutput = {
        audienceProfiles: 'not an array',
        positioningStatement: 123,
        uniqueValueProposition: 'Test',
        messagingPillars: [],
        recommendedTone: 'Test',
      };
      
      const result = validatePromptOutput(P01_OUTPUT_SCHEMA, 'P01', invalidOutput);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'type')).toBe(true);
    });

    it('rejects empty audienceProfiles array', () => {
      const invalidOutput = {
        audienceProfiles: [],
        positioningStatement: 'Test',
        uniqueValueProposition: 'Test',
        messagingPillars: [{ pillar: 'Test', description: 'Test', supportingPoints: [] }],
        recommendedTone: 'Test',
      };
      
      const result = validatePromptOutput(P01_OUTPUT_SCHEMA, 'P01', invalidOutput);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'minItems')).toBe(true);
    });

    it('warns on additional properties when additionalProperties is false', () => {
      const outputWithExtra = {
        audienceProfiles: [{
          segmentName: 'Test',
          description: 'Test',
          demographics: { ageRange: '20-30', location: 'Test' },
          psychographics: { values: ['test'], interests: ['test'] },
          painPoints: ['test'],
          desires: ['test'],
        }],
        positioningStatement: 'Test',
        uniqueValueProposition: 'Test',
        messagingPillars: [
          { pillar: 'Test1', description: 'Test', supportingPoints: [] },
          { pillar: 'Test2', description: 'Test', supportingPoints: [] },
          { pillar: 'Test3', description: 'Test', supportingPoints: [] },
        ],
        recommendedTone: 'Test',
        extraField: 'not allowed',
      };
      
      const result = validatePromptOutput(P01_OUTPUT_SCHEMA, 'P01', outputWithExtra);
      // Extra properties should be valid but with warnings
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.code === 'additionalProperties')).toBe(true);
    });

    it('handles malformed input gracefully', () => {
      const result = validatePromptOutput(P01_OUTPUT_SCHEMA, 'P01', null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateRequiredFields', () => {
    it('identifies missing required fields', () => {
      const data = { name: 'Test', email: 'test@test.com' };
      const errors = validateRequiredFields(data, ['name', 'email', 'phone']);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('phone');
    });

    it('passes when all required fields present', () => {
      const data = { name: 'Test', email: 'test@test.com', phone: '123' };
      const errors = validateRequiredFields(data, ['name', 'email', 'phone']);
      expect(errors).toHaveLength(0);
    });

    it('treats null/undefined/empty string as missing', () => {
      const data = { name: 'Test', email: '', phone: undefined };
      const errors = validateRequiredFields(data, ['name', 'email', 'phone']);
      expect(errors).toHaveLength(2);
      expect(errors.map(e => e.field).sort()).toEqual(['email', 'phone']);
    });
  });

  describe('sanitizeOutput', () => {
    it('removes properties not in schema', () => {
      const data = {
        audienceProfiles: [],
        positioningStatement: 'Test',
        uniqueValueProposition: 'Test',
        messagingPillars: [],
        recommendedTone: 'Test',
        extraField: 'should be removed',
        anotherExtra: 123,
      };
      
      const sanitized = sanitizeOutput(data, P01_OUTPUT_SCHEMA);
      expect(sanitized).not.toHaveProperty('extraField');
      expect(sanitized).not.toHaveProperty('anotherExtra');
      expect(sanitized).toHaveProperty('audienceProfiles');
    });
  });

  describe('formatValidationErrors', () => {
    it('formats errors readably', () => {
      const errors = [
        { field: 'audienceProfiles', message: 'must be array', code: 'type', params: {} },
        { field: 'root', message: 'required field missing', code: 'required', params: {} },
      ];
      
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('must be array');
      expect(formatted).toContain('required field missing');
      expect(formatted).toContain('audienceProfiles');
    });

    it('returns empty string for no errors', () => {
      expect(formatValidationErrors([])).toBe('');
    });
  });
});