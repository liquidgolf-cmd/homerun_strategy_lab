# Fix for "column userId does not exist" Error

## The Problem

You're getting this error because there's an existing `user_sessions` table (or other tables) in your Supabase database with a different structure than what we're trying to create.

When using `CREATE TABLE IF NOT EXISTS`, PostgreSQL won't recreate the table if it already exists - even if the structure is different. This causes errors when the schema tries to reference columns that don't exist in the old table.

## Solution

You have two options:

### Option 1: Use the Migration Script (Recommended)

Use `supabase_schema_migration.sql` which will drop existing tables and recreate them:

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase_schema_migration.sql`
3. **⚠️ WARNING: This will delete all existing data!** Backup first if needed.
4. Execute the SQL

This script:
- Drops all old tables (user_profiles, sessions, module_responses, final_documents, user_sessions)
- Creates new tables with the correct structure
- Sets up indexes and policies

### Option 2: Manual Cleanup

If you want to manually clean up:

1. Go to Supabase Dashboard → Table Editor
2. Delete the following tables if they exist:
   - `user_sessions`
   - `user_profiles`
   - `sessions`
   - `module_responses`
   - `final_documents`
3. Then run `supabase_schema.sql`

### Option 3: Check Existing Table Structure

If you want to preserve data, first check what columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_sessions';
```

If the structure is wrong, you'll need to either:
- Migrate the data manually to the new structure
- Drop and recreate (losing data)
- Use ALTER TABLE to add missing columns (if they're just missing, not wrong)

## After Running Migration

Once you've run the migration script successfully:

1. Verify tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_sessions', 'module_responses', 'final_documents');
   ```

2. Check table structure:
   ```sql
   \d user_sessions
   ```

3. Test the application - it should now work without foreign key errors!



