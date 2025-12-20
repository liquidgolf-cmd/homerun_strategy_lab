/**
 * Supabase Database Schema
 * 
 * Supabase uses PostgreSQL, so we'll use SQL queries
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

// Create Supabase client
// Use service role key for server-side operations (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Type definitions (matching existing structure)
export interface UserProfile {
  id: string; // References auth.users.id
  name: string | null;
  createdAt: string;
  lastAccessedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  currentModule: number;
  completionStatus: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleResponse {
  id: string;
  sessionId: string;
  moduleNumber: number;
  inputMethod: 'ai' | 'form';
  aiTranscript?: Array<{ role: string; content: string }>;
  formData?: Record<string, any>;
  auditReviewDocument?: string;
  completedAt?: string | null;
}

export interface FinalDocument {
  id: string;
  sessionId: string;
  combinedOverviewDocument: string;
  actionPlanDocument: string;
  generatedAt: string;
}

// Helper functions for common operations

/**
 * Get user profile by user ID (auth.users.id)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    ...data,
    id: String(data.id),
    name: data.name || null,
  } as UserProfile;
}

/**
 * Create user profile for an authenticated user
 */
export async function createUserProfile(userId: string, name?: string): Promise<UserProfile> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      name: name || null,
      createdAt: now,
      lastAccessedAt: now,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    id: String(data.id),
    name: data.name || null,
  } as UserProfile;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

/**
 * Get or create user profile (creates if doesn't exist)
 */
export async function getOrCreateUserProfile(userId: string, name?: string): Promise<UserProfile> {
  let profile = await getUserProfile(userId);
  
  if (!profile) {
    profile = await createUserProfile(userId, name);
  } else {
    // Update lastAccessedAt
    const now = new Date().toISOString();
    await updateUserProfile(userId, { lastAccessedAt: now });
    profile.lastAccessedAt = now;
  }
  
  return profile;
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) return null;
  return { ...data, id: String(data.id), userId: String(data.userId) } as Session;
}

export async function getLatestSessionForUser(userId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('userId', userId)
    .order('updatedAt', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return { ...data, id: String(data.id), userId: String(data.userId) } as Session;
}

export async function createSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) throw error;
  return { ...data, id: String(data.id), userId: String(data.userId) } as Session;
}

export async function updateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId);

  if (error) throw error;
}

export async function getModuleResponse(sessionId: string, moduleNumber: number): Promise<ModuleResponse | null> {
  const { data, error } = await supabase
    .from('module_responses')
    .select('*')
    .eq('sessionId', sessionId)
    .eq('moduleNumber', moduleNumber)
    .maybeSingle();

  if (error || !data) return null;
  
  // Parse JSON fields
  return {
    ...data,
    id: String(data.id),
    sessionId: String(data.sessionId),
    aiTranscript: data.aiTranscript ? (typeof data.aiTranscript === 'string' ? JSON.parse(data.aiTranscript) : data.aiTranscript) : undefined,
    formData: data.formData ? (typeof data.formData === 'string' ? JSON.parse(data.formData) : data.formData) : undefined,
  } as ModuleResponse;
}

export async function saveModuleResponse(responseData: Partial<ModuleResponse> & { sessionId: string; moduleNumber: number }): Promise<string> {
  // Check if exists
  const existing = await getModuleResponse(responseData.sessionId, responseData.moduleNumber);
  
  const dataToSave: any = {
    sessionId: responseData.sessionId,
    moduleNumber: responseData.moduleNumber,
    inputMethod: responseData.inputMethod || existing?.inputMethod,
    aiTranscript: responseData.aiTranscript ? JSON.stringify(responseData.aiTranscript) : (existing?.aiTranscript ? JSON.stringify(existing.aiTranscript) : null),
    formData: responseData.formData ? JSON.stringify(responseData.formData) : (existing?.formData ? JSON.stringify(existing.formData) : null),
    auditReviewDocument: responseData.auditReviewDocument !== undefined ? responseData.auditReviewDocument : existing?.auditReviewDocument,
    completedAt: responseData.completedAt !== undefined ? responseData.completedAt : existing?.completedAt,
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
    const { data, error } = await supabase
      .from('module_responses')
      .insert(dataToSave)
      .select()
      .single();

    if (error) throw error;
    return String(data.id);
  }
}

export async function getCompletedModuleResponses(sessionId: string): Promise<ModuleResponse[]> {
  const { data, error } = await supabase
    .from('module_responses')
    .select('*')
    .eq('sessionId', sessionId)
    .not('completedAt', 'is', null)
    .order('moduleNumber', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    id: String(item.id),
    sessionId: String(item.sessionId),
    aiTranscript: item.aiTranscript ? (typeof item.aiTranscript === 'string' ? JSON.parse(item.aiTranscript) : item.aiTranscript) : undefined,
    formData: item.formData ? (typeof item.formData === 'string' ? JSON.parse(item.formData) : item.formData) : undefined,
  })) as ModuleResponse[];
}

export async function getFinalDocument(sessionId: string): Promise<FinalDocument | null> {
  const { data, error } = await supabase
    .from('final_documents')
    .select('*')
    .eq('sessionId', sessionId)
    .maybeSingle();

  if (error || !data) return null;
  return { ...data, id: String(data.id), sessionId: String(data.sessionId) } as FinalDocument;
}

export async function saveFinalDocument(documentData: Omit<FinalDocument, 'id'>): Promise<string> {
  const existing = await getFinalDocument(documentData.sessionId);
  
  if (existing) {
    const { error } = await supabase
      .from('final_documents')
      .update(documentData)
      .eq('id', existing.id);

    if (error) throw error;
    return String(existing.id);
  } else {
    const { data, error } = await supabase
      .from('final_documents')
      .insert(documentData)
      .select()
      .single();

    if (error) throw error;
    return String(data.id);
  }
}

export default supabase;

