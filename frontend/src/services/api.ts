import axios from 'axios';
import { supabase } from '../lib/supabase';

// Use relative path for API (Vercel will route /api/* to serverless functions)
const getApiBaseURL = () => {
  // Always use relative path - Vercel handles routing
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
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error getting auth session for API request:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Don't log 404 errors - they're expected when resources don't exist yet
  if (error.response?.status !== 404) {
    console.error(`API response error from ${error.config?.url}:`, error.response?.data || error.message);
  }
  return Promise.reject(error);
});

export interface Session {
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
  userId: string;
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

  // Module 0 responses only (MVP)
  getModuleResponse: async (moduleNumber: number) => {
    if (moduleNumber !== 0) {
      throw new Error('Only Module 0 is supported in MVP');
    }
    const response = await api.get<ModuleResponse>('/modules/module0');
    return response.data;
  },

  saveModuleResponse: async (
    moduleNumber: number,
    inputMethod: 'ai' | 'form',
    data: {
      aiTranscript?: Array<{ role: string; content: string }>;
      formData?: Record<string, any>;
      auditReviewDocument?: string; // Optional - can save audit review with response
    }
  ) => {
    if (moduleNumber !== 0) {
      throw new Error('Only Module 0 is supported in MVP');
    }
    const response = await api.post('/modules/module0', {
      inputMethod,
      ...data,
    });
    return response.data;
  },

  // AI Interactions
  chat: async (
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    moduleContext: string
  ) => {
    const response = await api.post<{ message: string }>('/ai/chat', {
      messages,
      moduleContext,
    });
    return response.data.message;
  },

  generateAuditReview: async (
    moduleNumber: number,
    aiTranscript?: Array<{ role: string; content: string }>,
    formData?: Record<string, any>
  ) => {
    if (moduleNumber !== 0) {
      throw new Error('Only Module 0 is supported in MVP');
    }
    const response = await api.post<{ auditReview: string }>('/ai/audit', {
      moduleNumber,
      aiTranscript,
      formData,
    });
    return response.data.auditReview;
  },
};
