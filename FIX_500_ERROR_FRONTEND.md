# Fixing 500 Error on Frontend

When you see a 500 Internal Server Error when calling `/api/modules/session`, it means the backend server is crashing. Here's how to debug and fix it.

## Step 1: Check Backend Terminal Logs

The backend terminal (where you ran `npm run dev`) will show the actual error. Look for:

- Red error messages
- Stack traces
- Database errors
- Missing environment variable errors

**Common errors you might see:**

### Error: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
**Fix:** Check `backend/.env` file has both variables set

### Error: "relation 'user_sessions' does not exist"
**Fix:** Run `supabase_schema_migration.sql` in Supabase SQL Editor

### Error: "column 'userId' does not exist"
**Fix:** Tables have old structure - run migration script to recreate them

### Error: Connection timeout or network error
**Fix:** Check Supabase URL is correct in `backend/.env`

## Step 2: Verify Environment Variables

Check `backend/.env` file has all required variables:

```bash
cd backend
cat .env
```

Should have:
- `SUPABASE_URL=https://xxx.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)
- `ANTHROPIC_API_KEY=sk-ant-xxx`
- `PORT=3000`
- `NODE_ENV=development`

**Missing variables?**
1. Get Supabase credentials from: Supabase Dashboard → Settings → API
2. Get Anthropic key from: https://console.anthropic.com

## Step 3: Verify Database Tables Exist

1. Go to Supabase Dashboard → Table Editor
2. Check these tables exist:
   - `user_sessions`
   - `module_responses`
   - `final_documents`

**If tables don't exist or have wrong structure:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase_schema_migration.sql`
3. Run it (this will recreate tables with correct structure)

## Step 4: Test Backend Directly

Test if backend health endpoint works:

```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok"}`

If this fails, the backend isn't running or crashed.

## Step 5: Check Backend is Actually Running

Make sure you have the backend terminal running:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

If you see errors instead, those are the clues to fix!

## Common Issues & Solutions

### Issue: Backend starts but crashes when API is called

**Check backend terminal for:**
- Database connection errors
- Missing table errors
- Authentication errors

**Solution:** Fix the specific error shown in backend logs

### Issue: "Table does not exist" error

**Solution:** 
1. Run `supabase_schema_migration.sql` in Supabase SQL Editor
2. Restart backend server

### Issue: Environment variables not loading

**Solution:**
1. Make sure `.env` file is in `backend/` directory (not root)
2. Check file is named exactly `.env` (not `.env.local` or `.env.example`)
3. Restart backend server after editing `.env`

### Issue: CORS errors (browser console shows CORS policy error)

**Solution:**
1. Check `ALLOWED_ORIGINS` in `backend/.env` includes `http://localhost:5173`
2. Restart backend server

## Quick Debug Checklist

- [ ] Backend terminal shows "Server running on http://localhost:3000"
- [ ] `curl http://localhost:3000/api/health` returns `{"status":"ok"}`
- [ ] `backend/.env` has all required variables
- [ ] Database tables exist in Supabase Table Editor
- [ ] No errors in backend terminal when API is called
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:3000/api`

## Get Detailed Error Info

If you still see 500 error, the backend terminal will show the actual error. Share that error message for more specific help!




