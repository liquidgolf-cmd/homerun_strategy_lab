# Testing Locally - Step-by-Step Guide

This guide will walk you through testing the simplified architecture locally after running the database migration.

## Prerequisites

✅ **Before you start, make sure you've:**
1. Run the `supabase_schema_migration.sql` script in Supabase SQL Editor
2. Have your Supabase credentials ready (URL, anon key, service role key)
3. Have your Anthropic API key ready

## Step 1: Set Up Environment Variables

### Backend Environment Variables

Create `backend/.env` file:

```bash
cd backend
```

Create the file and add:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic API Key
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS (optional, defaults allow localhost)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
```

**To get your Supabase credentials:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **Project URL** → use for `SUPABASE_URL`
3. Copy the **service_role** key (under "Project API keys") → use for `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ Keep this secret! Never commit it to git.

### Frontend Environment Variables

Create `frontend/.env` file:

```bash
cd frontend
```

Create the file and add:

```bash
# Supabase Configuration (use anon key, NOT service role key!)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration (for local dev, use relative path)
VITE_API_URL=http://localhost:3000/api
```

**To get your Supabase anon key:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **anon** key (under "Project API keys") → use for `VITE_SUPABASE_ANON_KEY`

## Step 2: Install Dependencies

From the project root:

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

Or install separately:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## Step 3: Start the Backend Server

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

✅ **Verify backend is working:**
Open http://localhost:3000/api/health in your browser. You should see:
```json
{"status":"ok"}
```

## Step 4: Start the Frontend Server

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Verify frontend is working:**
Open http://localhost:5173 in your browser. You should see the Homeruns Strategy Lab landing page.

## Step 5: Test the Application Flow

### 5.1 Test Google Sign-In

1. Click **"Sign in with Google"** button
2. Complete Google OAuth flow
3. You should be redirected back to the home page
4. You should see "Welcome back, [Your Name]!" message

✅ **What to verify:**
- No errors in browser console (F12 → Console tab)
- Session loads successfully
- Progress shows "0 of 5 modules completed"

### 5.2 Test Module 0

1. Click **"Continue to Module 0"** or click on the Module 0 card
2. You should see the Module 0 landing page
3. Choose either **"AI Chat Interview"** or **"Manual Form"**

**If testing AI Chat:**
- Start typing responses to the AI coach
- Verify responses are saved
- Complete the conversation
- Click "Generate Audit Review"
- Verify audit review is generated and displayed

**If testing Manual Form:**
- Fill out the form fields
- Verify form saves as you type
- Click "Generate Audit Review"
- Verify audit review is generated and displayed

✅ **What to verify:**
- Module data saves correctly
- Audit review generates without errors
- Progress updates after completing module

### 5.3 Test Navigation Between Modules

1. After completing Module 0, click "Next Module"
2. Verify you can access Module 1
3. Try accessing a module that's not yet available - it should be disabled
4. Complete modules sequentially (0 → 1 → 2 → 3 → 4)

✅ **What to verify:**
- Module progression works correctly
- Cannot access locked modules
- Completed modules show checkmark

### 5.4 Test Final Summary

1. Complete all 5 modules (0-4)
2. Navigate to the final summary page
3. Click "Generate Final Documents"
4. Verify both documents generate:
   - Combined Overview
   - 90-Day Action Plan

✅ **What to verify:**
- Documents generate successfully
- Can download documents
- Can regenerate documents

## Step 6: Check Database in Supabase

While testing, you can verify data is being saved:

1. Go to Supabase Dashboard → Table Editor
2. Check the following tables:
   - **user_sessions**: Should have your user with currentModule and completionStatus
   - **module_responses**: Should have entries for each completed module
   - **final_documents**: Should have entry after generating final documents

## Troubleshooting

### Backend won't start

**Error: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"**
- Check `backend/.env` file exists
- Verify environment variables are set correctly
- Restart the backend server

**Error: "ANTHROPIC_API_KEY is not set"**
- Add your Anthropic API key to `backend/.env`
- Restart the backend server

### Frontend shows blank page or errors

**Error: "Missing Supabase environment variables"**
- Check `frontend/.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- **Important:** Restart the Vite dev server after changing `.env` files

**404 errors on API calls**
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `frontend/.env` is set to `http://localhost:3000/api`
- Check browser console for actual error messages

### Google Sign-In not working

**Error: "redirect_uri_mismatch"**
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add `http://localhost:5173` to "Redirect URLs"
- Also add it to Google Cloud Console OAuth settings

**Error: "User not authenticated"**
- Check browser console for JWT token errors
- Verify Supabase anon key is correct in `frontend/.env`
- Try signing out and signing in again

### Database errors

**Error: "relation does not exist"**
- Verify you ran `supabase_schema_migration.sql` in Supabase SQL Editor
- Check Supabase Dashboard → Table Editor to see if tables exist

**Error: "column does not exist"**
- Tables might have old structure - run the migration script again
- Or manually drop and recreate tables using the migration script

### Check Logs

**Backend logs:**
- Look at Terminal 1 (where backend is running)
- Check for error messages or stack traces

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see API request/response details

## Quick Verification Checklist

Before considering testing complete, verify:

- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend loads at http://localhost:5173
- [ ] Google sign-in works
- [ ] User session creates/loads successfully
- [ ] Can access Module 0
- [ ] Can save module data (AI chat or form)
- [ ] Audit review generates successfully
- [ ] Can navigate to next module
- [ ] Progress updates correctly
- [ ] Final documents generate after completing all modules
- [ ] No errors in browser console
- [ ] Data appears in Supabase Table Editor

## Next Steps

Once local testing passes:

1. **Deploy backend to Railway:**
   - Set same environment variables in Railway
   - Deploy and get Railway URL

2. **Update frontend .env for production:**
   - Set `VITE_API_URL` to your Railway backend URL
   - Build and deploy to Vercel

3. **Update Vercel environment variables:**
   - Add Supabase and API URL variables
   - Redeploy frontend

See `SIMPLIFIED_ARCHITECTURE.md` for deployment details.




