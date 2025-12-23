# Supabase Migration Instructions

## Updating from MVP to Full Course (Modules 0-4)

If you already have the MVP database set up and want to enable modules 1-4, use this migration script:

### Step-by-Step Instructions:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the SQL below (do NOT include any markdown headers with `#`)
6. Click **Run** (or press Cmd/Ctrl + Enter)

### Migration SQL (Copy this entire block):

```sql
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
```

### Important Notes:

- **Only copy the SQL code** - Don't copy markdown headers like `# Title` or code fence markers like ```
- **PostgreSQL uses `--` for comments**, not `#`
- This migration is safe - it only updates constraints, it won't delete any data
- Your existing Module 0 data will remain intact

### If you get an error:

1. Make sure you're only copying the SQL statements (the lines between the ```sql markers, not including the markers themselves)
2. Check that you don't have any `#` characters in your SQL
3. Make sure you're running this in the Supabase SQL Editor, not the command line

### Verifying the Migration:

After running the migration, you can verify it worked by running this query:

```sql
SELECT 
  table_name, 
  constraint_name, 
  check_clause
FROM information_schema.check_constraints
WHERE table_name IN ('module_responses', 'user_sessions')
ORDER BY table_name, constraint_name;
```

You should see the updated constraints allowing modules 0-4.


