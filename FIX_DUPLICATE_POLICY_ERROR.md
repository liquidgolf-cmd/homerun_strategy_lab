# Fix: Duplicate Policy Error

## The Error

```
ERROR: 42710: policy "Allow all operations on sessions" for table "sessions" already exists
```

This means some policies already exist in your database. The schema has been updated to handle this.

## Solution

I've updated the `supabase_schema.sql` file to drop policies before creating them. 

### Option 1: Run the Updated Schema (Recommended)

1. Go to Supabase SQL Editor
2. Copy the **ENTIRE updated** `supabase_schema.sql` file
3. Paste it into SQL Editor
4. Run it - it should now work without errors

### Option 2: Run Just the Missing Parts

If you prefer, you can run just the parts that failed. But it's safer to run the whole schema again since it now handles existing policies.

## After Running

Once the schema runs successfully:
1. Check Table Editor - you should see all 4 tables
2. The backend errors should stop
3. Try the app again




