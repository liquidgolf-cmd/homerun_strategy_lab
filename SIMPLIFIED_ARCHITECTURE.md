# Simplified Architecture - Migration Complete

## Overview

We've simplified the database architecture by combining `user_profiles` and `sessions` tables into a single `user_sessions` table. This eliminates foreign key constraint issues and makes the code simpler.

## What Changed

### Database Schema

**Before:**
- `user_profiles` table (with FK to `auth.users`)
- `sessions` table (with FK to `auth.users`)
- `module_responses` table (with FK to `sessions`)
- `final_documents` table (with FK to `sessions`)

**After:**
- `user_sessions` table (no FK constraints - uses `userId` as primary key)
- `module_responses` table (references `userId` directly, no FK)
- `final_documents` table (references `userId` directly, no FK)

### Key Changes

1. **No Foreign Key Constraints**: We validate users via JWT tokens instead of database constraints. This eliminates the foreign key errors we were experiencing.

2. **Simplified Data Model**: User profile and session data are now combined into one table, eliminating the need to join tables.

3. **API Routes Updated**: Routes now use `userId` from JWT tokens instead of requiring `sessionId` parameters:
   - `GET /modules/session` → Returns user session (uses JWT)
   - `GET /modules/module/:moduleNumber` → Gets module response (uses JWT)
   - `POST /modules/module/:moduleNumber` → Saves module response (uses JWT)
   - `POST /documents/generate` → Generates final documents (uses JWT)
   - `GET /documents/` → Gets final documents (uses JWT)

## Migration Steps

### 1. Run New Schema in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase_schema.sql`
3. Execute the SQL (this will create new tables)

**Important**: If you have existing data, you'll need to migrate it. The new schema uses different table names, so old tables won't conflict. However, you may want to:
- Backup existing data first
- Drop old tables after verifying new schema works
- Or migrate data from old tables to new ones

### 2. Update Environment Variables

No changes needed - same environment variables as before:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

### 3. Deploy Backend

The backend code has been updated to use the new schema. Deploy to Railway as usual.

### 4. Deploy Frontend

The frontend code has been updated to use the new API routes. Deploy to Vercel as usual.

## Benefits

1. **No More Foreign Key Errors**: The foreign key constraint violations that were causing 500 errors are eliminated.

2. **Simpler Code**: Less complexity in database queries and relationships.

3. **Better Performance**: Fewer joins needed since user and session data are in one table.

4. **Easier Debugging**: User validation is explicit via JWT, making it easier to trace issues.

## Testing

After deploying:

1. Test Google sign-in (should create user_session automatically)
2. Test accessing a module (should load/create module response)
3. Test saving module data
4. Test generating audit review
5. Test generating final documents

## Rollback

If you need to rollback, you can:
1. Use the old schema (in git history)
2. Restore old code from git
3. Restore data from backups

But the new architecture should work better and eliminate the errors we were seeing.




