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
    const errorData = error.response?.data;
    console.error(`API response error from ${error.config?.url}:`, {
      status: error.response?.status,
      error: errorData?.error || error.message,
      details: errorData?.details,
    });
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

  // Get module response for any module (0-4)
  getModuleResponse: async (moduleNumber: number) => {
    if (moduleNumber < 0 || moduleNumber > 4) {
      throw new Error('Invalid module number. Must be 0-4');
    }
    const response = await api.get<ModuleResponse>(`/modules/module${moduleNumber}`);
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
    if (moduleNumber < 0 || moduleNumber > 4) {
      throw new Error('Invalid module number. Must be 0-4');
    }
    const response = await api.post(`/modules/module${moduleNumber}`, {
      inputMethod,
      ...data,
    });
    return response.data;
  },

  // AI Interactions
  chat: async (
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    moduleContext: string,
    moduleNumber?: number
  ) => {
    const response = await api.post<{ message: string }>('/ai/chat', {
      messages,
      moduleContext,
      moduleNumber,
    });
    return response.data.message;
  },

  // Text-to-Speech using Google Cloud TTS
  textToSpeech: async (text: string): Promise<string> => {
    const response = await api.post<{ audioDataUrl: string }>('/ai/tts', {
      text,
    });
    return response.data.audioDataUrl;
  },

  generateAuditReview: async (
    moduleNumber: number,
    aiTranscript?: Array<{ role: string; content: string }>,
    formData?: Record<string, any>
  ) => {
    if (moduleNumber < 0 || moduleNumber > 4) {
      throw new Error('Invalid module number. Must be 0-4');
    }
    const response = await api.post<{ auditReview: string }>('/ai/audit', {
      moduleNumber,
      aiTranscript,
      formData,
    });
    return response.data.auditReview;
  },

  generateFinalDocuments: async () => {
    const response = await api.post<{
      success: boolean;
      combinedOverview: string;
      actionPlan: string;
    }>('/documents/generate');
    return response.data;
  },
};
