# Phase 2: Advanced Prompt Library - Implementation Plan

## Architecture Inspection Summary

**Existing Reusable Components:**
- `src/types/index.ts` - Core types: `ContentPost`, `WorkshopContentContext`, `StrategyName`, `StrategyDistribution`, `QuestionnaireContextLevel`
- `src/data/workshopContentContext.ts` - Context transformation, prohibited topics filter, strategy topics, CTA extraction
- `src/utils/strategy.ts` - Strategy health, distribution, rotation, metadata
- `src/data/workshopQuestionnaireData.ts` - 20-question workshop pre-fill (maps to build_strategy level)
- `src/data/dataService.ts` - Personalized mock post generation using context
- `src/components/OnboardingFlow.tsx` - Three-level onboarding with workshop demo

**Missing Dependencies:**
- JSON Schema validator (need to add `ajv` or `zod`)

## Implementation Plan

### Step 1: Catalogue Foundation (P1)
**Files to create:**
- `src/lib/prompts/types.ts` - Core prompt catalogue types
- `src/lib/prompts/catalogue.ts` - Central prompt definitions (P01-P09)
- `src/lib/prompts/schemas.ts` - JSON Schema definitions for each prompt output
- `src/lib/prompts/validation.ts` - Validation engine using AJV

**Interfaces needed:**
- `PromptDefinition` - Stable ID, name, category, version, purpose, system/user templates, inputs, output schema, context deps, approval requirements, model requirements, metadata, test cases
- `PromptCategory` - P01-P09 enum with labels
- `PromptInput` - Required/optional fields with types
- `PromptOutputSchema` - JSON Schema reference
- `ValidationResult` - Valid/invalid with detailed errors

### Step 2: JSON Schema Validation (P2)
**Files to create:**
- `src/lib/prompts/validator.ts` - AJV-based validation with custom error formatting
- `src/lib/prompts/validation.test.ts` - Tests for valid/invalid/malformed outputs

**Schema coverage:**
- Each P01-P09 prompt gets a schema
- Handle missing fields, wrong types, malformed JSON
- No silent failures - explicit validation errors

### Step 3: Search/Filter Interface (P4)
**Files to create:**
- `src/components/PromptLibrary.tsx` - Main library UI
- `src/components/PromptLibrarySearch.tsx` - Search by name, ID, purpose, description
- `src/components/PromptLibraryFilter.tsx` - Filter by P01-P09 category
- `src/components/PromptDetailModal.tsx` - Detail view with inputs/outputs
- `src/hooks/usePromptLibrary.ts` - State management for search/filter

**Status indicators:**
- `implemented` - Fully working with validation
- `tested` - Has test cases passing
- `experimental` - Partial implementation
- `planned` - Catalogue entry only

### Step 4: Vertical Slice - P01 or P02 (P3)
**Decision: P01 Business & Audience Research**
- Aligns with existing `WorkshopContentContext` transformation
- Uses questionnaire responses directly
- Output feeds into strategy generation (P02)

**Implementation path:**
1. Gather authorised context from questionnaire + workshop
2. Validate required inputs against P01 schema
3. Render system + user prompt templates with variable injection
4. (Mock) invoke model integration - return structured output
5. Validate output against P01 JSON Schema
6. Handle errors with actionable feedback
7. Add automated tests

### Step 5: White-Label Compatibility (P6)
**Keep separate:**
- Prompt definitions (pure, reusable)
- Agency branding config
- Client profiles/brand guidelines
- Campaign/offer records
- Provider credentials (server-side only)
- Provider/model config
- Pricing/usage limits

### Step 6: Visual/Campaign Integrity (P7)
**Distinct operations:**
- P04: Asset selection (existing genuine assets)
- P05: Controlled graphic design (layout + editable text)
- P06: AI image generation (instructions only, no auto-generation)
- P07: Campaign planning (approved offers only)

## File Structure

```
src/lib/prompts/
├── types.ts           # Core interfaces
├── catalogue.ts       # P01-P09 definitions
├── schemas.ts         # JSON Schema objects
├── validator.ts       # AJV validation engine
├── registry.ts        # Prompt registry (singleton)
├── index.ts           # Public exports
└── prompts/
    ├── P01-business-audience-research.ts
    ├── P02-strategy-content-calendar.ts
    ├── P03-individual-social-posts.ts
    ├── P04-visual-research-asset-selection.ts
    ├── P05-controlled-graphic-design.ts
    ├── P06-ai-image-generation.ts
    ├── P07-offers-campaign-planning.ts
    ├── P08-quality-assurance.ts
    └── P09-performance-analysis.ts

src/components/
├── PromptLibrary.tsx
├── PromptLibrarySearch.tsx
├── PromptLibraryFilter.tsx
└── PromptDetailModal.tsx

src/hooks/
└── usePromptLibrary.ts

src/test/
├── prompt-catalogue.test.ts
├── prompt-validation.test.ts
└── prompt-library-ui.test.tsx
```

## Dependencies to Add

```bash
npm install ajv ajv-formats
npm install -D @types/ajv
```

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Mock AI output passed as real | Clear status labels; no mock output in production paths |
| Schema drift | Single source of truth in `schemas.ts`; tests validate alignment |
| Client secrets in prompts | Context supplied at runtime; prompts are templates only |
| Silent validation failures | Explicit error objects; no try/catch swallowing |

## Verification Checklist

- [ ] 21/21 existing tests still pass
- [ ] TypeScript clean
- [ ] Build succeeds
- [ ] New prompt catalogue tests pass
- [ ] Schema validation tests pass (valid, invalid, malformed)
- [ ] Search/filter UI functional
- [ ] P01 vertical slice end-to-end works
- [ ] No regression in onboarding/workshop demo