import axios from 'axios';
import { supabase } from '../lib/supabase';

// Use environment variable for API URL, fallback to relative path
const getApiBaseURL = () => {
  // If VITE_API_URL is set, use it (for Vercel deployment pointing to backend)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, use relative path (proxied by Vite to backend)
  if (import.meta.env.DEV) {
    return '/api';
  }
  // In production, use relative path (assumes frontend and backend on same domain)
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
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
  name: string | null;
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
  // Session management - Get or create session (requires auth)
  getSession: async () => {
    const response = await api.get<{ user: User; session: Session }>('/modules/session');
    return response.data;
  },

  // Get session by ID
  getSessionById: async (sessionId: string) => {
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

