/**
 * Firestore Database Schema
 * 
 * Replaces SQLite with Firestore (NoSQL)
 * Collections are created automatically on first use
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin (only in Cloud Functions environment)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Collections - created automatically on first use
export const usersCollection = db.collection('users');
export const sessionsCollection = db.collection('sessions');
export const moduleResponsesCollection = db.collection('moduleResponses');
export const finalDocumentsCollection = db.collection('finalDocuments');

// Helper functions for common operations

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
  completedAt?: string;
}

export interface FinalDocument {
  id: string;
  sessionId: string;
  combinedOverviewDocument: string;
  actionPlanDocument: string;
  generatedAt: string;
}

// Helper to get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}

// Helper to create user
export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const docRef = await usersCollection.add(userData);
  return { id: docRef.id, ...userData };
}

// Helper to update user
export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  await usersCollection.doc(userId).update(updates);
}

// Helper to get session by ID
export async function getSessionById(sessionId: string): Promise<Session | null> {
  const doc = await sessionsCollection.doc(sessionId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Session;
}

// Helper to get latest session for user
export async function getLatestSessionForUser(userId: string): Promise<Session | null> {
  const snapshot = await sessionsCollection
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc')
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Session;
}

// Helper to create session
export async function createSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
  const docRef = await sessionsCollection.add(sessionData);
  return { id: docRef.id, ...sessionData };
}

// Helper to get module response
export async function getModuleResponse(sessionId: string, moduleNumber: number): Promise<ModuleResponse | null> {
  const snapshot = await moduleResponsesCollection
    .where('sessionId', '==', sessionId)
    .where('moduleNumber', '==', moduleNumber)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    aiTranscript: data.aiTranscript ? (typeof data.aiTranscript === 'string' ? JSON.parse(data.aiTranscript) : data.aiTranscript) : undefined,
    formData: data.formData ? (typeof data.formData === 'string' ? JSON.parse(data.formData) : data.formData) : undefined,
  } as ModuleResponse;
}

// Helper to save/update module response
export async function saveModuleResponse(responseData: Omit<ModuleResponse, 'id'>): Promise<string> {
  // Check if exists
  const existing = await getModuleResponse(responseData.sessionId, responseData.moduleNumber);
  
  const dataToSave = {
    ...responseData,
    aiTranscript: responseData.aiTranscript ? JSON.stringify(responseData.aiTranscript) : null,
    formData: responseData.formData ? JSON.stringify(responseData.formData) : null,
  };

  if (existing) {
    // Update existing
    await moduleResponsesCollection.doc(existing.id).update(dataToSave);
    return existing.id;
  } else {
    // Create new
    const docRef = await moduleResponsesCollection.add(dataToSave);
    return docRef.id;
  }
}

// Helper to get all module responses for a session
export async function getModuleResponsesBySession(sessionId: string): Promise<ModuleResponse[]> {
  const snapshot = await moduleResponsesCollection
    .where('sessionId', '==', sessionId)
    .orderBy('moduleNumber')
    .get();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      aiTranscript: data.aiTranscript ? (typeof data.aiTranscript === 'string' ? JSON.parse(data.aiTranscript) : data.aiTranscript) : undefined,
      formData: data.formData ? (typeof data.formData === 'string' ? JSON.parse(data.formData) : data.formData) : undefined,
    } as ModuleResponse;
  });
}

// Helper to get completed module responses
export async function getCompletedModuleResponses(sessionId: string): Promise<ModuleResponse[]> {
  const snapshot = await moduleResponsesCollection
    .where('sessionId', '==', sessionId)
    .where('completedAt', '!=', null)
    .orderBy('completedAt')
    .orderBy('moduleNumber')
    .get();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      aiTranscript: data.aiTranscript ? (typeof data.aiTranscript === 'string' ? JSON.parse(data.aiTranscript) : data.aiTranscript) : undefined,
      formData: data.formData ? (typeof data.formData === 'string' ? JSON.parse(data.formData) : data.formData) : undefined,
    } as ModuleResponse;
  });
}

// Helper to get final document
export async function getFinalDocument(sessionId: string): Promise<FinalDocument | null> {
  const snapshot = await finalDocumentsCollection
    .where('sessionId', '==', sessionId)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as FinalDocument;
}

// Helper to save final document
export async function saveFinalDocument(documentData: Omit<FinalDocument, 'id'>): Promise<string> {
  const existing = await getFinalDocument(documentData.sessionId);
  
  if (existing) {
    await finalDocumentsCollection.doc(existing.id).update(documentData);
    return existing.id;
  } else {
    const docRef = await finalDocumentsCollection.add(documentData);
    return docRef.id;
  }
}

export default db;

