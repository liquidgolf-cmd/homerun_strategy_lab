import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database will be stored in backend/data/ directory
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'db.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    lastAccessedAt TEXT NOT NULL
  )
`);

// Sessions table
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    currentModule INTEGER NOT NULL DEFAULT 0,
    completionStatus INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

// Module responses table
db.exec(`
  CREATE TABLE IF NOT EXISTS module_responses (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL,
    moduleNumber INTEGER NOT NULL,
    inputMethod TEXT NOT NULL,
    aiTranscript TEXT,
    formData TEXT,
    auditReviewDocument TEXT,
    completedAt TEXT,
    FOREIGN KEY (sessionId) REFERENCES sessions(id),
    UNIQUE(sessionId, moduleNumber)
  )
`);

// Final documents table
db.exec(`
  CREATE TABLE IF NOT EXISTS final_documents (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL UNIQUE,
    combinedOverviewDocument TEXT NOT NULL,
    actionPlanDocument TEXT NOT NULL,
    generatedAt TEXT NOT NULL,
    FOREIGN KEY (sessionId) REFERENCES sessions(id)
  )
`);

export default db;
