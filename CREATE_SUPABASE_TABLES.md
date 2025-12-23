# Create Database Tables in Supabase

## The Problem

The backend is trying to access `user_profiles` table, but it doesn't exist in your Supabase database yet. You need to run the SQL schema to create all the tables.

## Solution: Run SQL Schema in Supabase

### Step 1: Open Supabase SQL Editor

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"** button

### Step 2: Copy and Paste the Schema

1. Open the file `supabase_schema.sql` in this repository
2. **Copy the ENTIRE contents** of that file
3. **Paste it** into the Supabase SQL Editor

### Step 3: Run the SQL

1. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
2. Wait for it to complete
3. You should see "Success. No rows returned" or similar success message

### Step 4: Verify Tables Were Created

1. In Supabase Dashboard, go to **Table Editor** (left sidebar)
2. You should now see these tables:
   - `user_profiles`
   - `sessions`
   - `module_responses`
   - `final_documents`

## What the Schema Does

The SQL schema creates:
- `user_profiles` - Links to Supabase auth.users
- `sessions` - Tracks user progress through modules
- `module_responses` - Stores responses for each module
- `final_documents` - Stores final overview and action plan

## After Running the Schema

Once the tables are created:
1. The backend errors should stop
2. The API should work correctly
3. You should be able to sign in and use the app

## Still Getting Errors?

If you get errors when running the SQL:
- Make sure you're copying the ENTIRE file
- Check for any syntax errors
- Try running it section by section if needed




