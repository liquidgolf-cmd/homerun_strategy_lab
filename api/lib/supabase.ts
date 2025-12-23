/**
 * Supabase Client for Vercel Serverless Functions
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client lazily
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseKey) {
      const missing = [];
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      throw new Error(`Missing environment variables: ${missing.join(', ')}. Please set them in Vercel dashboard.`);
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}

// Export getter function instead of direct client
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof ReturnType<typeof createClient>];
  },
});

// Type definitions
export interface UserSession {
  userId: string;
  email: string | null;
  name: string | null;
  currentModule: number;
  completionStatus: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleResponse {
  id: string;
  userId: string;
  moduleNumber: number;
  inputMethod: 'ai' | 'form';
  aiTranscript?: Array<{ role: string; content: string }>;
  formData?: Record<string, any>;
  auditReviewDocument?: string;
  completedAt?: string | null;
}

/**
 * Get or create user session
 */
export async function getOrCreateUserSession(
  userId: string,
  email: string,
  name?: string
): Promise<UserSession> {
  // Check environment variables
  if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    throw new Error(`Missing environment variables: ${missing.join(', ')}. Please set them in Vercel dashboard.`);
  }
  // Try to get existing session
  const { data: existing, error: fetchError } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('userId', userId)
    .maybeSingle();

  if (existing) {
    // Update last accessed time
    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('user_sessions')
      .update({ updatedAt: now })
      .eq('userId', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return {
      userId: String(updated.userId),
      email: updated.email || null,
      name: updated.name || null,
      currentModule: updated.currentModule,
      completionStatus: updated.completionStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    } as UserSession;
  }

  // Create new session
  const now = new Date().toISOString();
  const { data: newSession, error: insertError } = await supabase
    .from('user_sessions')
    .insert({
      userId: userId,
      email: email,
      name: name || null,
      currentModule: 0,
      completionStatus: 0,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (insertError) throw insertError;
  return {
    userId: String(newSession.userId),
    email: newSession.email || null,
    name: newSession.name || null,
    currentModule: newSession.currentModule,
    completionStatus: newSession.completionStatus,
    createdAt: newSession.createdAt,
    updatedAt: newSession.updatedAt,
  } as UserSession;
}

/**
 * Get module response by userId and moduleNumber
 */
export async function getModuleResponse(
  userId: string,
  moduleNumber: number
): Promise<ModuleResponse | null> {
  const { data, error } = await supabase
    .from('module_responses')
    .select('*')
    .eq('userId', userId)
    .eq('moduleNumber', moduleNumber)
    .maybeSingle();

  if (error || !data) return null;

  // Parse JSON fields
  return {
    ...data,
    id: String(data.id),
    userId: String(data.userId),
    aiTranscript: data.aiTranscript
      ? typeof data.aiTranscript === 'string'
        ? JSON.parse(data.aiTranscript)
        : data.aiTranscript
      : undefined,
    formData: data.formData
      ? typeof data.formData === 'string'
        ? JSON.parse(data.formData)
        : data.formData
      : undefined,
  } as ModuleResponse;
}

/**
 * Save module response
 */
export async function saveModuleResponse(
  responseData: Partial<ModuleResponse> & { userId: string; moduleNumber: number }
): Promise<string> {
  // Check if exists
  const existing = await getModuleResponse(responseData.userId, responseData.moduleNumber);

  const dataToSave: any = {
    userId: responseData.userId,
    moduleNumber: responseData.moduleNumber,
    inputMethod: responseData.inputMethod || existing?.inputMethod,
    aiTranscript: responseData.aiTranscript
      ? JSON.stringify(responseData.aiTranscript)
      : existing?.aiTranscript
      ? JSON.stringify(existing.aiTranscript)
      : null,
    formData: responseData.formData
      ? JSON.stringify(responseData.formData)
      : existing?.formData
      ? JSON.stringify(existing.formData)
      : null,
    auditReviewDocument:
      responseData.auditReviewDocument !== undefined
        ? responseData.auditReviewDocument
        : existing?.auditReviewDocument,
    completedAt:
      responseData.completedAt !== undefined ? responseData.completedAt : existing?.completedAt,
  };

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('module_responses')
      .update(dataToSave)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return String(existing.id);
  } else {
    // Create new - need inputMethod
    if (!dataToSave.inputMethod) {
      throw new Error('inputMethod is required for new module response');
    }
    const { data, error } = await supabase.from('module_responses').insert(dataToSave).select().single();

    if (error) throw error;
    return String(data.id);
  }
}

/**
 * Get all module responses for a user
 */
export async function getAllModuleResponses(userId: string): Promise<ModuleResponse[]> {
  const { data, error } = await supabase
    .from('module_responses')
    .select('*')
    .eq('userId', userId)
    .order('moduleNumber', { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((item) => ({
    ...item,
    id: String(item.id),
    userId: String(item.userId),
    aiTranscript: item.aiTranscript
      ? typeof item.aiTranscript === 'string'
        ? JSON.parse(item.aiTranscript)
        : item.aiTranscript
      : undefined,
    formData: item.formData
      ? typeof item.formData === 'string'
        ? JSON.parse(item.formData)
        : item.formData
      : undefined,
  })) as ModuleResponse[];
}

/**
 * Update user session
 */
export async function updateUserSession(
  userId: string,
  updates: Partial<UserSession>
): Promise<void> {
  const { error } = await supabase
    .from('user_sessions')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('userId', userId);

  if (error) throw error;
}

