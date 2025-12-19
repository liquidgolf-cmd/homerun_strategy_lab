import axios from 'axios';

// Use environment variable for backend URL, fallback to relative path for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Session {
  id: string;
  userId: string;
  currentModule: number;
  completionStatus: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastAccessedAt: string;
}

export interface ModuleResponse {
  id: string;
  sessionId: string;
  moduleNumber: number;
  inputMethod: 'ai' | 'form';
  aiTranscript?: Array<{ role: string; content: string; timestamp?: string }>;
  formData?: Record<string, any>;
  auditReviewDocument?: string;
  completedAt?: string;
}

export const apiService = {
  // Session management
  createSession: async (email: string, name: string) => {
    const response = await api.post<{ user: User; session: Session }>('/modules/session', {
      email,
      name,
    });
    return response.data;
  },

  getSession: async (sessionId: string) => {
    const response = await api.get<Session>(`/modules/session/${sessionId}`);
    return response.data;
  },

  // Module responses
  getModuleResponse: async (sessionId: string, moduleNumber: number) => {
    const response = await api.get<ModuleResponse>(
      `/modules/session/${sessionId}/module/${moduleNumber}`
    );
    return response.data;
  },

  saveModuleResponse: async (
    sessionId: string,
    moduleNumber: number,
    inputMethod: 'ai' | 'form',
    data: {
      aiTranscript?: Array<{ role: string; content: string }>;
      formData?: Record<string, any>;
    }
  ) => {
    const response = await api.post(`/modules/session/${sessionId}/module/${moduleNumber}`, {
      inputMethod,
      ...data,
    });
    return response.data;
  },

  saveAuditReview: async (sessionId: string, moduleNumber: number, auditReview: string) => {
    const response = await api.post(
      `/modules/session/${sessionId}/module/${moduleNumber}/audit`,
      {
        auditReviewDocument: auditReview,
      }
    );
    return response.data;
  },

  // AI chat
  chat: async (
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    moduleNumber: number,
    moduleContext: string
  ) => {
    const response = await api.post<{ message: string }>('/ai/chat', {
      messages,
      moduleNumber,
      moduleContext,
    });
    return response.data.message;
  },

  generateAuditReview: async (
    moduleNumber: number,
    aiTranscript?: Array<{ role: string; content: string }>,
    formData?: Record<string, any>
  ) => {
    const response = await api.post<{ auditReview: string }>('/ai/audit-review', {
      moduleNumber,
      aiTranscript,
      formData,
    });
    return response.data.auditReview;
  },

  // Final documents
  generateFinalDocuments: async (sessionId: string) => {
    const response = await api.post<{
      combinedOverview: string;
      actionPlan: string;
      generatedAt: string;
    }>(`/documents/session/${sessionId}/generate`);
    return response.data;
  },

  getFinalDocuments: async (sessionId: string) => {
    const response = await api.get<{
      combinedOverviewDocument: string;
      actionPlanDocument: string;
      generatedAt: string;
    }>(`/documents/session/${sessionId}`);
    return response.data;
  },
};

