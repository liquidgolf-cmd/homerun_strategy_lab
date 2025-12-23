export type InputMethod = 'ai' | 'form';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastAccessedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  currentModule: number;
  completionStatus: number; // 0-5
  createdAt: string;
  updatedAt: string;
}

export interface ModuleResponse {
  id: string;
  sessionId: string;
  moduleNumber: number; // 0-4
  inputMethod: InputMethod;
  aiTranscript?: AIMessage[];
  formData?: Record<string, any>;
  auditReviewDocument?: string;
  completedAt?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FinalDocuments {
  id: string;
  sessionId: string;
  combinedOverviewDocument: string;
  actionPlanDocument: string;
  generatedAt: string;
}

export interface ModuleConfig {
  number: number;
  title: string;
  description: string;
  questions: Question[];
  auditPrompt: string;
}

export interface Question {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}




