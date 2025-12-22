-- Migration script for simplified architecture
-- This will DROP existing tables and recreate them with the new structure
-- ⚠️ WARNING: This will delete all existing data!
-- Backup your data first if you need to preserve it.

-- Drop old tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS final_documents CASCADE;
DROP TABLE IF EXISTS module_responses CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE; -- Drop if it exists from previous attempt

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User sessions table (combines user profile and session data)
-- No foreign key constraints - we validate users via JWT tokens
CREATE TABLE user_sessions (
  "userId" UUID PRIMARY KEY, -- User ID from auth.users (no FK constraint)
  "email" TEXT,
  "name" TEXT,
  "currentModule" INTEGER NOT NULL DEFAULT 0,
  "completionStatus" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module responses table
CREATE TABLE module_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL, -- Reference to user_sessions.userId (no FK constraint)
  "moduleNumber" INTEGER NOT NULL,
  "inputMethod" TEXT NOT NULL CHECK ("inputMethod" IN ('ai', 'form')),
  "aiTranscript" JSONB,
  "formData" JSONB,
  "auditReviewDocument" TEXT,
  "completedAt" TIMESTAMPTZ,
  UNIQUE("userId", "moduleNumber")
);

-- Final documents table
CREATE TABLE final_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL UNIQUE, -- Reference to user_sessions.userId (no FK constraint)
  "combinedOverviewDocument" TEXT NOT NULL,
  "actionPlanDocument" TEXT NOT NULL,
  "generatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_sessions_userId ON user_sessions("userId");
CREATE INDEX idx_user_sessions_updatedAt ON user_sessions("updatedAt");
CREATE INDEX idx_module_responses_userId ON module_responses("userId");
CREATE INDEX idx_module_responses_user_module ON module_responses("userId", "moduleNumber");
CREATE INDEX idx_final_documents_userId ON final_documents("userId");

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow all operations on module_responses" ON module_responses;
DROP POLICY IF EXISTS "Allow all operations on final_documents" ON final_documents;

-- Create policies (allow all for now, since we're using service role key)
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on module_responses" ON module_responses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on final_documents" ON final_documents
  FOR ALL USING (true) WITH CHECK (true);



