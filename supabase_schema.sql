-- Simplified Supabase Database Schema for Homeruns Strategy Lab
-- Combines user_profiles and sessions into a single table to avoid foreign key issues
-- No foreign key constraints - we validate users via JWT tokens
--
-- ⚠️ IMPORTANT: If you have existing tables with different structure, use supabase_schema_migration.sql instead
-- which will drop and recreate tables. This file uses IF NOT EXISTS for clean installations.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they have wrong structure (for migration)
-- Uncomment the next 5 lines if you need to recreate tables:
-- DROP TABLE IF EXISTS final_documents CASCADE;
-- DROP TABLE IF EXISTS module_responses CASCADE;
-- DROP TABLE IF EXISTS sessions CASCADE;
-- DROP TABLE IF EXISTS user_profiles CASCADE;
-- DROP TABLE IF EXISTS user_sessions CASCADE;

-- User sessions table (combines user profile and session data)
-- No foreign key constraints - we validate users via JWT tokens
CREATE TABLE IF NOT EXISTS user_sessions (
  "userId" UUID PRIMARY KEY, -- User ID from auth.users (no FK constraint)
  "email" TEXT,
  "name" TEXT,
  "currentModule" INTEGER NOT NULL DEFAULT 0,
  "completionStatus" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Module responses table
CREATE TABLE IF NOT EXISTS module_responses (
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
CREATE TABLE IF NOT EXISTS final_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL UNIQUE, -- Reference to user_sessions.userId (no FK constraint)
  "combinedOverviewDocument" TEXT NOT NULL,
  "actionPlanDocument" TEXT NOT NULL,
  "generatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_userId ON user_sessions("userId");
CREATE INDEX IF NOT EXISTS idx_user_sessions_updatedAt ON user_sessions("updatedAt");
CREATE INDEX IF NOT EXISTS idx_module_responses_userId ON module_responses("userId");
CREATE INDEX IF NOT EXISTS idx_module_responses_user_module ON module_responses("userId", "moduleNumber");
CREATE INDEX IF NOT EXISTS idx_final_documents_userId ON final_documents("userId");

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_documents ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for now, since we're using service role key)
DROP POLICY IF EXISTS "Allow all operations on user_sessions" ON user_sessions;
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on module_responses" ON module_responses;
CREATE POLICY "Allow all operations on module_responses" ON module_responses
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on final_documents" ON final_documents;
CREATE POLICY "Allow all operations on final_documents" ON final_documents
  FOR ALL USING (true) WITH CHECK (true);
