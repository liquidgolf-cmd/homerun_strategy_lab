-- Migration script to update MVP schema to support all modules (0-4)
-- Run this in Supabase SQL Editor if you already have the MVP schema

-- Update module_responses table constraint to allow modules 0-4
ALTER TABLE module_responses 
  DROP CONSTRAINT IF EXISTS module_responses_moduleNumber_check;

ALTER TABLE module_responses
  ADD CONSTRAINT module_responses_moduleNumber_check 
  CHECK ("moduleNumber" >= 0 AND "moduleNumber" <= 4);

-- Update user_sessions constraints to allow proper ranges
ALTER TABLE user_sessions
  DROP CONSTRAINT IF EXISTS user_sessions_currentModule_check;

ALTER TABLE user_sessions
  ADD CONSTRAINT user_sessions_currentModule_check
  CHECK ("currentModule" >= 0 AND "currentModule" <= 4);

ALTER TABLE user_sessions
  DROP CONSTRAINT IF EXISTS user_sessions_completionStatus_check;

ALTER TABLE user_sessions
  ADD CONSTRAINT user_sessions_completionStatus_check
  CHECK ("completionStatus" >= 0 AND "completionStatus" <= 5);

