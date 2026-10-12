import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import type { 
  PromptOutputSchema, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning 
} from './types';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  verbose: true,
  coerceTypes: 'array',
});
addFormats(ajv);

const schemaCache = new Map<string, ValidateFunction>();

export function getValidator(schema: PromptOutputSchema, schemaId: string): ValidateFunction {
  if (schemaCache.has(schemaId)) {
    return schemaCache.get(schemaId)!;
  }
  
  const validate = ajv.compile(schema as unknown as JSONSchemaType<unknown>);
  schemaCache.set(schemaId, validate);
  return validate;
}

export function validatePromptOutput(
  schema: PromptOutputSchema,
  schemaId: string,
  data: unknown
): ValidationResult {
  const validate = getValidator(schema, schemaId);
  const valid = validate(data);
  
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  if (!valid && validate.errors) {
    for (const err of validate.errors) {
      // Separate additionalProperties errors as warnings if schema has additionalProperties: false
      // but we want to allow them with warnings
      const isAdditionalPropertyError = err.keyword === 'additionalProperties' && 
        schema.additionalProperties === false;
      
      if (isAdditionalPropertyError) {
        warnings.push({
          field: err.instancePath || err.schemaPath || 'root',
          message: err.message || 'Unexpected property',
          code: 'additionalProperties',
        });
      } else {
        errors.push({
          field: err.instancePath || err.schemaPath || 'root',
          message: err.message || 'Validation failed',
          code: err.keyword,
          params: err.params,
        });
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  
  return errors.map(err => {
    const field = err.field === 'root' ? '' : ` at '${err.field}'`;
    return `  - ${err.message}${field} (${err.code})`;
  }).join('\n');
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  required: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of required) {
    if (!(field in data) || data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field,
        message: `Required field '${field}' is missing or empty`,
        code: 'required',
      });
    }
  }
  
  return errors;
}

export function sanitizeOutput<T extends Record<string, unknown>>(
  data: T,
  schema: PromptOutputSchema
): T {
  if (!schema.properties) return data;
  
  const allowedKeys = Object.keys(schema.properties);
  const sanitized: Record<string, unknown> = {};
  
  for (const key of allowedKeys) {
    if (key in data) {
      sanitized[key] = data[key];
    }
  }
  
  return sanitized as T;
}

export function createValidationError(
  field: string,
  message: string,
  code: string = 'custom',
  params?: Record<string, unknown>
): ValidationError {
  return { field, message, code, params };
}

export function createValidationWarning(
  field: string,
  message: string,
  code: string = 'warning'
): ValidationWarning {
  return { field, message, code };
}