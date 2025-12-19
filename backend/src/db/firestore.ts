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

export default db;

