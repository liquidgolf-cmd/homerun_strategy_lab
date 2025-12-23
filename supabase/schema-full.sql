-- Full Supabase Database Schema for Homerun Strategy Lab
-- Supports Modules 0-4
-- No foreign key constraints - we validate users via JWT tokens

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean start)
DROP POLICY IF EXISTS "Allow all operations on user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow all operations on module_responses" ON module_responses;
DROP TABLE IF EXISTS module_responses CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

-- User sessions table (combines user profile and session data)
-- No foreign key constraints - we validate users via JWT tokens
CREATE TABLE user_sessions (
  "userId" UUID PRIMARY KEY, -- User ID from auth.users (no FK constraint)
  "email" TEXT,
  "name" TEXT,
  "currentModule" INTEGER NOT NULL DEFAULT 0 CHECK ("currentModule" >= 0 AND "currentModule" <= 4),
  "completionStatus" INTEGER NOT NULL DEFAULT 0 CHECK ("completionStatus" >= 0 AND "completionStatus" <= 5),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module responses table (Modules 0-4)
CREATE TABLE module_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL, -- Reference to user_sessions.userId (no FK constraint)
  "moduleNumber" INTEGER NOT NULL CHECK ("moduleNumber" >= 0 AND "moduleNumber" <= 4),
  "inputMethod" TEXT NOT NULL CHECK ("inputMethod" IN ('ai', 'form')),
  "aiTranscript" JSONB,
  "formData" JSONB,
  "auditReviewDocument" TEXT,
  "completedAt" TIMESTAMPTZ,
  UNIQUE("userId", "moduleNumber")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_userId ON user_sessions("userId");
CREATE INDEX IF NOT EXISTS idx_user_sessions_updatedAt ON user_sessions("updatedAt");
CREATE INDEX IF NOT EXISTS idx_module_responses_userId ON module_responses("userId");
CREATE INDEX IF NOT EXISTS idx_module_responses_user_module ON module_responses("userId", "moduleNumber");

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_responses ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for now, since we're using service role key)
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on module_responses" ON module_responses
  FOR ALL USING (true) WITH CHECK (true);


