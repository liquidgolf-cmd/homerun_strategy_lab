-- Quick verification query to check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'sessions', 'module_responses', 'final_documents')
ORDER BY table_name;

-- If you see 4 rows above, tables exist!
-- If you see 0 rows, tables were not created



