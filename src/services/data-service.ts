import type { 
  Client, 
  ContentPost, 
  QuestionnaireResponse, 
  Strategy, 
  ContentAsset, 
  ApprovalActivity,
  SocialAccount,
  Lead,
  DashboardStats,
  GenerationProgress,
  StrategyDistribution
} from '../types';

export interface DataService {
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | null>;
  createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client>;
  updateClient(id: string, updates: Partial<Client>): Promise<Client>;
  
  // Questionnaire operations
  getQuestionnaire(clientId: string): Promise<QuestionnaireResponse[]>;
  saveQuestionnaire(clientId: string, responses: Omit<QuestionnaireResponse, 'id' | 'clientId' | 'createdAt' | 'updatedAt' | 'completed'>[]): Promise<QuestionnaireResponse[]>;
  getQuestionnaireProgress(clientId: string): Promise<{ completed: number; total: number; requiredCompleted: number; requiredTotal: number }>;
  
  // Content operations
  getContentCalendar(clientId: string, monthKey?: string): Promise<ContentPost[]>;
  getContent(clientId: string, contentId: string): Promise<ContentPost | null>;
  createContent(content: Omit<ContentPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentPost>;
  updateContent(clientId: string, contentId: string, updates: Partial<ContentPost>): Promise<ContentPost>;
  deleteContent(clientId: string, contentId: string): Promise<void>;
  bulkUpdateContentStatus(clientId: string, contentIds: string[], status: ContentPost['status']): Promise<void>;
  
  // Approval workflow
  approveContent(clientId: string, contentId: string, notes?: string): Promise<ContentPost>;
  rejectContent(clientId: string, contentId: string, reason: string): Promise<ContentPost>;
  requestRevision(clientId: string, contentId: string, revisionRequest: string): Promise<ContentPost>;
  getApprovalHistory(clientId: string, contentId: string): Promise<ApprovalActivity[]>;
  
  // Strategy operations
  getStrategies(): Promise<Strategy[]>;
  getStrategyDistribution(clientId: string, monthKey: string): Promise<StrategyDistribution>;
  
  // Dashboard
  getDashboardStats(clientId: string, monthKey: string): Promise<DashboardStats>;
  
  // Generation
  generateContentCalendar(clientId: string, monthKey: string, distribution?: StrategyDistribution): Promise<GenerationProgress>;
  
  // Assets
  getContentAssets(contentId: string): Promise<ContentAsset[]>;
  createContentAsset(asset: Omit<ContentAsset, 'id' | 'createdAt'>): Promise<ContentAsset>;
  
  // Social accounts
  getSocialAccounts(clientId: string): Promise<SocialAccount[]>;
  
  // Leads
  getLeads(clientId: string): Promise<Lead[]>;
}

export type ContentPostStatus = ContentPost['status'];