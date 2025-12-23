# Local Testing Walkthrough

Follow these steps to test the simplified architecture locally.

## Prerequisites Check

Before starting, make sure:

1. ✅ **Database migration completed**: You've run `supabase_schema_migration.sql` in Supabase SQL Editor
2. ✅ **Environment variables set**: You have `.env` files in both `backend/` and `frontend/` directories

## Step 1: Verify Environment Variables

### Check Backend .env

Open `backend/.env` and verify it has:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
PORT=3000
NODE_ENV=development
```

**Missing values?** Get them from:
- **Supabase URL & Keys**: Supabase Dashboard → Settings → API
- **Anthropic API Key**: https://console.anthropic.com

### Check Frontend .env

Open `frontend/.env` and verify it has:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000/api
```

**Important:** Frontend uses the **anon key**, not the service role key!

## Step 2: Install Dependencies (if needed)

From project root:

```bash
npm run install:all
```

This installs dependencies for both backend and frontend.

## Step 3: Start Backend Server

Open **Terminal 1**:

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

**✅ Test it works:**
Open browser to: http://localhost:3000/api/health

Should see: `{"status":"ok"}`

**❌ Having issues?**
- Check `backend/.env` file exists and has all variables
- Check Terminal 1 for error messages
- Verify port 3000 is not in use: `lsof -i :3000`

## Step 4: Start Frontend Server

Open **Terminal 2** (new terminal window):

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**✅ Test it works:**
Open browser to: http://localhost:5173

Should see the Homeruns Strategy Lab landing page with:
- Loam Strategy logo
- "Sign in with Google" button

**❌ Having issues?**
- Check `frontend/.env` file exists
- **Important:** If you just edited `.env`, restart the Vite server (Ctrl+C and run `npm run dev` again)
- Check Terminal 2 for error messages

## Step 5: Test Authentication

1. Click **"Sign in with Google"** button
2. Complete Google OAuth (select account, grant permissions)
3. You should be redirected back to http://localhost:5173
4. Should see: "Welcome back, [Your Name]!" message

**✅ Success indicators:**
- No errors in browser console (F12 → Console)
- Progress shows "0 of 5 modules completed"
- Module cards are visible

**❌ If sign-in fails:**
- Check browser console (F12) for errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env`
- Make sure `http://localhost:5173` is added to Supabase redirect URLs:
  - Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

## Step 6: Test Module 0

### 6.1 Access Module 0

Click **"Continue to Module 0"** button or click the Module 0 card.

Should see Module 0 landing page with options:
- "AI Chat Interview" button
- "Manual Form" button

### 6.2 Test AI Chat (Option A)

1. Click **"AI Chat Interview"**
2. You'll see a chat interface with an initial message from the AI coach
3. Type a response and send
4. AI should respond with follow-up questions
5. Continue the conversation
6. Click **"Generate Audit Review"** when done
7. Wait for audit review to generate
8. Should see a review document displayed

**✅ Verify:**
- Messages save (refresh page, messages should still be there)
- Audit review generates without errors
- Can click "Next Module" after review

### 6.3 Test Manual Form (Option B)

1. Click **"Manual Form"** instead
2. Fill out the form fields
3. Form auto-saves as you type
4. Click **"Generate Audit Review"** when done
5. Should see audit review displayed

**✅ Verify:**
- Form data saves
- Audit review generates
- Can proceed to next module

## Step 7: Test Module Progression

1. After completing Module 0, click **"Next Module"**
2. Should navigate to Module 1
3. Complete Module 1 (same process)
4. Continue through modules 2, 3, 4

**✅ Verify:**
- Progress updates: "X of 5 modules completed"
- Completed modules show ✓ checkmark
- Can navigate to completed modules
- Cannot access locked modules (they're grayed out)

## Step 8: Test Final Summary

1. Complete all 5 modules (0-4)
2. Should automatically navigate to final summary page
3. Click **"Generate Final Documents"** button
4. Wait for documents to generate (this may take 30-60 seconds)
5. Should see two documents:
   - **Combined Overview**
   - **90-Day Action Plan**

**✅ Verify:**
- Both documents generate successfully
- Can download documents (Download buttons work)
- Can regenerate documents if needed

## Step 9: Verify Database

While testing, verify data is being saved correctly:

1. Go to **Supabase Dashboard** → **Table Editor**
2. Check **`user_sessions`** table:
   - Should have one row with your userId
   - `currentModule` and `completionStatus` should update as you progress
3. Check **`module_responses`** table:
   - Should have entries for each module you've completed
   - Each entry should have `userId`, `moduleNumber`, `inputMethod`
4. Check **`final_documents`** table:
   - Should have entry after generating final documents
   - Should have `combinedOverviewDocument` and `actionPlanDocument`

## Common Issues & Fixes

### Issue: "Missing Supabase environment variables"

**Fix:**
- Check `frontend/.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Restart Vite server** after editing `.env` files

### Issue: "No authorization token provided" or 401 errors

**Fix:**
- Make sure you're signed in (check if "Sign in with Google" button is gone)
- Check browser console for auth errors
- Try signing out and signing in again

### Issue: Backend returns 500 errors

**Fix:**
- Check Terminal 1 (backend) for error messages
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct in `backend/.env`
- Check if database tables exist in Supabase Table Editor

### Issue: "column does not exist" or database errors

**Fix:**
- Verify you ran `supabase_schema_migration.sql` in Supabase SQL Editor
- Check Supabase Table Editor - tables should exist with correct structure

### Issue: AI chat or audit review not working

**Fix:**
- Verify `ANTHROPIC_API_KEY` is set in `backend/.env`
- Check Terminal 1 (backend) for API errors
- Make sure Anthropic API key is valid and has credits

## Success Checklist

Before moving to deployment, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Google sign-in works
- [ ] User session loads after sign-in
- [ ] Can access Module 0
- [ ] Can save module data (AI chat or form)
- [ ] Audit review generates successfully
- [ ] Can navigate between modules
- [ ] Progress updates correctly
- [ ] Final documents generate after all modules complete
- [ ] Data appears in Supabase tables
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## Next: Deploy to Production

Once local testing passes, see deployment guides:
- Backend: Deploy to Railway
- Frontend: Deploy to Vercel
- Update environment variables in deployment platforms




