-- Supabase Database Schema for Homeruns Strategy Lab
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "lastAccessedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "currentModule" INTEGER NOT NULL DEFAULT 0,
  "completionStatus" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module responses table
CREATE TABLE IF NOT EXISTS module_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sessionId" UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  "moduleNumber" INTEGER NOT NULL,
  "inputMethod" TEXT NOT NULL CHECK ("inputMethod" IN ('ai', 'form')),
  "aiTranscript" JSONB,
  "formData" JSONB,
  "auditReviewDocument" TEXT,
  "completedAt" TIMESTAMPTZ,
  UNIQUE("sessionId", "moduleNumber")
);

-- Final documents table
CREATE TABLE IF NOT EXISTS final_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sessionId" UUID NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  "combinedOverviewDocument" TEXT NOT NULL,
  "actionPlanDocument" TEXT NOT NULL,
  "generatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_updatedAt ON sessions("updatedAt");
CREATE INDEX IF NOT EXISTS idx_module_responses_sessionId ON module_responses("sessionId");
CREATE INDEX IF NOT EXISTS idx_module_responses_session_module ON module_responses("sessionId", "moduleNumber");
CREATE INDEX IF NOT EXISTS idx_final_documents_sessionId ON final_documents("sessionId");

-- Enable Row Level Security (RLS) - you can adjust policies as needed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_documents ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (you can restrict this later)
-- When using service role key, RLS is bypassed, but it's good to have policies set

-- Users policies (allow all for now)
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Sessions policies
CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Module responses policies
CREATE POLICY "Allow all operations on module_responses" ON module_responses
  FOR ALL USING (true) WITH CHECK (true);

-- Final documents policies
CREATE POLICY "Allow all operations on final_documents" ON final_documents
  FOR ALL USING (true) WITH CHECK (true);

