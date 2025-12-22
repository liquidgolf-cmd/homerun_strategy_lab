# Troubleshooting: Tables Not Showing in Supabase

## Issue: Tables not visible in Table Editor after running SQL schema

### Step 1: Check if SQL Executed Successfully

1. **Go back to SQL Editor** in Supabase
2. **Check the execution result**:
   - Did you see "Success. No rows returned" or similar success message?
   - Or did you see any error messages (red text)?

### Step 2: Verify Tables Exist with a Query

Run this query in SQL Editor to check if tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'sessions', 'module_responses', 'final_documents')
ORDER BY table_name;
```

**Expected result**: You should see 4 rows with the table names.

### Step 3: Check Table Editor Location

1. **In Supabase Dashboard**, click **"Table Editor"** in the left sidebar
2. **Make sure you're in the correct schema**:
   - Look at the top of the Table Editor
   - It should say "public" schema (not "auth" or "storage")
3. **Refresh the page** (F5 or Cmd+R)

### Step 4: Check for Errors in SQL Execution

If the tables still don't show, there might have been an error. Try running the schema again, but **watch for errors**:

1. Go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire `supabase_schema.sql` file again
4. **Paste it** and click **"Run"**
5. **Look carefully** at the results panel:
   - Green checkmark = Success
   - Red X = Error (read the error message)

### Common Errors and Fixes

#### Error: "relation already exists"
**Fix**: The tables already exist! You can either:
- Drop them first: `DROP TABLE IF EXISTS final_documents, module_responses, sessions, user_profiles CASCADE;`
- Or just skip this step - the tables are already there

#### Error: "permission denied"
**Fix**: Make sure you're using the correct database connection. This shouldn't happen with a new project, but if it does, contact Supabase support.

#### Error: "syntax error"
**Fix**: Make sure you copied the ENTIRE SQL file, including all semicolons.

### Step 5: Alternative - Create Tables One by One

If the full script doesn't work, try creating tables individually:

1. **First, enable UUID extension**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

2. **Create user_profiles table**:
```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "lastAccessedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

3. **Create sessions table**:
```sql
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "currentModule" INTEGER NOT NULL DEFAULT 0,
  "completionStatus" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

4. **Create module_responses table**:
```sql
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
```

5. **Create final_documents table**:
```sql
CREATE TABLE IF NOT EXISTS final_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sessionId" UUID NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  "combinedOverviewDocument" TEXT NOT NULL,
  "actionPlanDocument" TEXT NOT NULL,
  "generatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

After creating each table, check Table Editor to confirm it appears.

### Quick Verification Query

Run this to see all your tables:

```sql
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see your 4 tables listed.



