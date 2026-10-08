// Teable API Service Layer
// Server-side only - never expose token to client

interface TeableConfig {
  apiBase: string;
  baseId: string;
  apiToken: string;
}

interface TeableRecord {
  id: string;
  fields: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

interface TeableListResponse {
  records: TeableRecord[];
  total?: number;
  pageToken?: string;
}

interface TeableFilter {
  conjunction: 'and' | 'or';
  filterSet: Array<{
    fieldId: string;
    operator: string;
    value: any;
  }>;
}

class TeableService {
  private config: TeableConfig;

  constructor(config: TeableConfig) {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  private buildUrl(endpoint: string): string {
    return `${this.config.apiBase}${endpoint}`;
  }

  async listRecords(tableId: string, options?: {
    filter?: TeableFilter;
    take?: number;
    skip?: number;
    sort?: Array<{ fieldId: string; order: 'asc' | 'desc' }>;
  }): Promise<TeableListResponse> {
    const params = new URLSearchParams({
      fieldKeyType: 'id',
      take: String(options?.take || 100),
      skip: String(options?.skip || 0)
    });

    if (options?.filter) {
      params.set('filter', JSON.stringify(options.filter));
    }

    if (options?.sort) {
      params.set('sort', JSON.stringify(options.sort));
    }

    const url = this.buildUrl(`/table/${tableId}/record?${params.toString()}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teable list failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getRecord(tableId: string, recordId: string): Promise<TeableRecord> {
    const url = this.buildUrl(`/table/${tableId}/record/${recordId}?fieldKeyType=id`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teable get failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createRecord(tableId: string, fields: Record<string, any>): Promise<TeableRecord> {
    const url = this.buildUrl(`/table/${tableId}/record`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fieldKeyType: 'id',
        typecast: true,
        records: [{ fields }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teable create failed: ${response.status} - ${error}`);
    }

    const result = await response.json();
    return result.records[0];
  }

  async updateRecord(tableId: string, recordId: string, fields: Record<string, any>): Promise<TeableRecord> {
    const url = this.buildUrl(`/table/${tableId}/record/${recordId}`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fieldKeyType: 'id',
        typecast: true,
        record: { fields }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teable update failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async deleteRecord(tableId: string, recordId: string): Promise<void> {
    const url = this.buildUrl(`/table/${tableId}/record/${recordId}`);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teable delete failed: ${response.status} - ${error}`);
    }
  }
}

// Table IDs from verified schema
export const TEABLE_TABLES = {
  CLIENTS: 'tblEwplxQKUmq9oDHki',
  QUESTIONNAIRE_RESPONSES: 'tblknwlbpM85PW6tDN2',
  CONTENT_STRATEGIES: 'tblFGUZ06SPGwjmLEXB',
  CONTENT_CALENDAR: 'tblza9csBxLaPAkRkQS',
  CONTENT_ASSETS: 'tblfFIwp5wnhnJqmiUB',
  APPROVAL_ACTIVITY: 'tble7rdBSzvUnIl7x1p',
  SOCIAL_ACCOUNTS: 'tbljhokUm3ToWSGg2y5',
  LEADS: 'tblClVGoMgC8MtKlaLX'
} as const;

// Field IDs from verified schema
export const TEABLE_FIELDS = {
  CLIENTS: {
    BUSINESS_NAME: 'fldqFFfzrExmLpoeXBC',
    CLIENT_ID: 'fldXwmxsN2uJbuuSv3o',
    CONTACT_NAME: 'fldwMujZjFNv1YKUMB1',
    EMAIL: 'fldCkHPc22JXdGcI1HY',
    PHONE: 'fldzDAcYiWVz0GBh69c',
    WHATSAPP: 'fldes0zDKzwyf4lEZeB',
    WEBSITE: 'fldgmifEAGipjQVqGan',
    FACEBOOK_URL: 'fldfMrPfOKaAmMla6eA',
    INSTAGRAM_URL: 'fldYn8OQAVHtewIQiId',
    LINKEDIN_URL: 'fldTeTN0lmSr7N5I4r0',
    OTHER_SOCIAL_URLS: 'fldUgC3Y4F8MLBjjXR9',
    BUSINESS_LOCATION: 'fld0sy0uSxHqfpqD8uJ',
    INDUSTRY: 'fldaSarEXB9j4lMfsBa',
    BUSINESS_DESCRIPTION: 'fldULlNGpwGRuhjEfrm',
    PRIMARY_OFFER: 'fldBwR5lOzEjvEPEH36',
    SECONDARY_OFFERS: 'fldrgSuYZZm0pqTi7wM',
    TARGET_AUDIENCE: 'fldex4UsvKl7dszJ2bZ',
    IDEAL_CUSTOMER_DESCRIPTION: 'fldnOHphzEdttn8Uieu',
    BRAND_PERSONALITY: 'fldspPc9D7b9W6FhLww',
    BRAND_TONE: 'fldSxNol4IQf17cUL14',
    WORDS_TO_USE: 'fld4ncQfVvFLHHiMwa7',
    WORDS_TO_AVOID: 'fldRwVByRurPk1IqqdV',
    MAIN_CUSTOMER_PROBLEMS: 'fldkRrDgP8o2gJTKkyt',
    MAIN_CUSTOMER_DESIRES: 'fldjsB331j4KiQdBBHC',
    COMMON_QUESTIONS: 'fldlUo0pMF0etKj1PLH',
    COMMON_OBJECTIONS: 'fldc0J2xsoaa9z5ZtlN',
    COMPETITIVE_ADVANTAGES: 'fldubzhOHHksb8YJA8E',
    TESTIMONIALS_PROOF: 'fldJIl39oWmcpOQBAZU',
    PRIMARY_CTA: 'fldbeBqU7aK0EfgcOwe',
    SECONDARY_CTA: 'fldp2x7E6TqKkkmA7LR',
    PREFERRED_CONTACT_METHOD: 'fldoTtLO4cbA0fW4ymi',
    CONTENT_APPROVAL_REQUIRED: 'fld5fD1kZhlyygI33GK',
    SERVICE_PACKAGE: 'fld6pArqCH2K50412wJ',
    ACTIVE_INACTIVE: 'fldWOXPV60SYkAkLDrE',
    CLIENT_USERS: 'fld4jlmNJmkoSPZn2Ru',
    TIME_ZONE: 'fldd4e5sSVhIjdmjYi0',
    CREATED_AT: 'fldDqNvyEHTzxuoF4PB',
    UPDATED_AT: 'fldTi5mgrDTZ1g0CtzS'
  },
  QUESTIONNAIRE_RESPONSES: {
    QUESTION: 'fld5ND3hSCvbbsjh70O',
    RESPONSE_ID: 'fldgaB09XEF4weRhNqF',
    CLIENT_ID: 'fldFl0ZZ1fD0sFyD3n4',
    QUESTION_NUMBER: 'flduQIALN0KfkiV4GSw',
    QUESTION_CATEGORY: 'fld6koB40tSdqEfLEVX',
    RESPONSE: 'fldtCGO3SsWKhjBfVj9',
    REQUIRED: 'fldpET1TjuizjFhm9K2',
    AI_NOTES: 'fld3L1xu5IVrGfZ2Fw0',
    CREATED_AT: 'fld4CQEHRpZnQqhVdI0',
    UPDATED_AT: 'fldmWQoJYWMOg9vVAMm',
    COMPLETED: 'fldBzAZruOM6PTTh3w5',
    CLIENT_USERS: 'fldqUvUDavgs9r5ojyg'
  },
  CONTENT_STRATEGIES: {
    STRATEGY_NAME: 'fldz2TiATD6iGgjHqIF',
    STRATEGY_ID: 'fldTs4f4AuodAXYgd1M',
    SHORT_DESCRIPTION: 'fldikbNawSuOW5TwPZG',
    COLOR: 'fldgwHgEPtjZCdaUBeF',
    HEX_COLOR: 'fldK7SZlHCFZRb8Pti3',
    RECOMMENDED_PERCENTAGE: 'fldJC1kxlKZBT3873Q7',
    PRIMARY_OBJECTIVE: 'fldhsss3xD0s0Cf7PtA',
    EXAMPLE_CONTENT_TYPES: 'fldJ7S4UMw5xPHNSSCE',
    RECOMMENDED_CTA: 'fldypxC13gITIfkEbEv',
    ACTIVE: 'fldczsbZQPDgHSzJ8zu',
    RECOMMENDED_POSTS_30: 'fldyUdEU8KisZcr00sz'
  },
  CONTENT_CALENDAR: {
    CONTENT_TOPIC: 'fldL2QABewKU1OkxZ9K',
    CONTENT_ID: 'fldcJp42tN2e9hhMhQ0',
    CLIENT_ID: 'fldDgRU0An5yYuJa8nb',
    DATE: 'fld4KUWG1lCDhEw13xg',
    SCHEDULED_TIME: 'fldEJ9sgyv7uU1DJ0tk',
    PLATFORM: 'fldfT6y33sbzKrQPqRT',
    STRATEGY_ID: 'fld3F4k5UHu3pgdf3dr',
    CONTENT_FORMAT: 'fldPrGjIuvSXqIcOwSj',
    CONTENT_OBJECTIVE: 'fldTMaulQDyXaZ4EkCR',
    HOOK: 'fldDeWQvfJbZzRKQqHd',
    CAPTION: 'fldCYyWSyFQDKE78Xyy',
    SHORT_CAPTION: 'fld0z1Qfeyeu8ElfmYC',
    CTA: 'fldM4vGTjM3hTYUWFBR',
    HASHTAGS: 'fldRRm9ChzVrgFPdycx',
    IMAGE_PROMPT: 'fldIfXWoZ165LNNfYvU',
    IMAGE_URL: 'fldSpvMKZtWxpw0L1jh',
    VIDEO_CONCEPT: 'fldKYGyKHqf5hniDMFD',
    VIDEO_SCRIPT: 'fldpJlFeNI8LHg2VjNj',
    FIRST_COMMENT: 'fldlqtj1vINHSLrUgnE',
    AI_INSTRUCTIONS: 'fldlRA7yQgyASjrHdgW',
    STATUS: 'fldWuLN0DYpKb9vzXVX',
    CLIENT_NOTES: 'fldo7r0lWwkZKRAKVP8',
    AI_REVISION_REQUEST: 'fldlEDYbAsAKsulMKGZ',
    APPROVED_AT: 'fldK4A6VgjPDt1GaYtt',
    PUBLISHED_AT: 'fldxtSyxhMoktZpphrX',
    EXTERNAL_POST_ID: 'fld719bJ9GQlasvzhws',
    CREATED_AT: 'fldSxtdmUXmV6oTYiam',
    UPDATED_AT: 'fldjr1ULImuegOAl9PT',
    DAY: 'fldwTkU2OoyfzcEuZs2',
    STRATEGY_NAME: 'fldtcQk6Fa74xKVSvDI',
    CLIENT_RECORD_ID: 'fldUOOcxHc680MuT640',
    CLIENT_USERS: 'fldsbMN7M7njgKZjW2W',
    STRATEGY_COLOUR: 'fldPsxI7gxbI8MYsbVb'
  },
  CONTENT_ASSETS: {
    ASSET_URL: 'fldkqkjgauvPRkt6SaJ',
    ASSET_ID: 'fld1ylRRUloCu2bl9If',
    CONTENT_ID: 'fldwZ3EeUklwFFFAuKk',
    ASSET_TYPE: 'fldyHvatm93A06kzo6h',
    THUMBNAIL_URL: 'fldWvr3Us74IRu3e5EX',
    ALT_TEXT: 'fldT6fxsKWL6WwCMbGL',
    AI_PROMPT: 'fldVNijGjCE549nVFHR',
    APPROVED: 'fldcQ4v6FF2sHdVHMoJ',
    CREATED_AT: 'flddPVCVgI2SjnaMtE6',
    CLIENT_ID: 'fldDvPlUbPZ5J4PYJz2',
    CLIENT_USERS: 'fldiHb78oyItMH2znpq'
  },
  APPROVAL_ACTIVITY: {
    ACTION: 'fldKYE0UkcZlkN4CA7U',
    ACTIVITY_ID: 'fldECtoAGC4wGs25tJQ',
    CONTENT_ID: 'fldnV8z8jXkzeRmbWoa',
    PREVIOUS_STATUS: 'fldMaSL3rBRMf0DAv32',
    NEW_STATUS: 'fldCxBSQD2gMvWxXvWK',
    CLIENT_COMMENT: 'fld2aBvo3DlQIkZ8Glx',
    TIMESTAMP: 'fldzLWmjQzlhJ6UepB8',
    USER: 'fldNnvykHYfFhu7potB',
    CLIENT_ID: 'fldJOelLryDCXPn1Epc',
    CLIENT_USERS: 'fldNlDe2Wz8q65n1wzk'
  }
} as const;

// Strategy record IDs from verified schema
export const STRATEGY_RECORD_IDS = {
  EDUCATE: 'rec7MfJ1yN7dWgM7iAr',
  ENGAGE: 'rec1rngeMOtcNbn6AUl',
  AUTHORITY: 'recz4NOskIVDI6IEI3B',
  STORY: 'recOeSDMBoNfujAD4Ij',
  PROMOTE: 'rec7dSHA2I5you3eYL7'
} as const;

// Strategy colors from verified schema
export const STRATEGY_COLORS = {
  EDUCATE: { light: '#DBEAFE', default: '#3B82F6', dark: '#1D4ED8' },
  ENGAGE: { light: '#D1FAE5', default: '#10B981', dark: '#059669' },
  AUTHORITY: { light: '#EDE9FE', default: '#8B5CF6', dark: '#7C3AED' },
  STORY: { light: '#FFEDD5', default: '#F97316', dark: '#EA580C' },
  PROMOTE: { light: '#FFE4E6', default: '#EC4899', dark: '#DB2777' }
} as const;

// Default strategy distribution
export const DEFAULT_STRATEGY_DISTRIBUTION = {
  EDUCATE: 8,
  ENGAGE: 6,
  AUTHORITY: 5,
  STORY: 5,
  PROMOTE: 6
} as const;

// Create Teable service instance from environment
export function createTeableService(): TeableService {
  const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.ai/api';
  const baseId = process.env.TEABLE_BASE_ID || 'bseagIh2WI3tU9zIvKm';
  const apiToken = process.env.TEABLE_API_TOKEN;

  if (!apiToken) {
    throw new Error('TEABLE_API_TOKEN is required');
  }

  return new TeableService({ apiBase, baseId, apiToken });
}

export { TeableService, TeableRecord, TeableListResponse, TeableFilter };