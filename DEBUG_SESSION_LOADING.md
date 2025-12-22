# Debug: "Loading your session..." Not Completing

## The Problem

You're authenticated (you see your email), but the session isn't loading. This means the API call to your backend is failing.

## Quick Diagnosis Steps

### Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12 or Cmd+Option+I)
2. Go to the **Console** tab
3. Look for error messages (red text)
4. Common errors you might see:
   - CORS errors
   - Network errors (failed to fetch)
   - 404 errors (backend not found)
   - 500 errors (backend error)

### Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for a request to `/modules/session` or your API URL
4. Check the status:
   - **Red/404**: Backend not found - backend not deployed or wrong URL
   - **Red/CORS**: CORS error - backend CORS not configured
   - **Red/500**: Backend error - check backend logs
   - **Pending/Failed**: Network error - backend not accessible

## Common Causes & Fixes

### Cause 1: Backend Not Deployed

**Symptom**: 404 errors or "Failed to fetch" in console

**Fix**: 
1. Deploy backend to Railway (see FIX_CORS_ERRORS.md)
2. Get your backend URL: `https://your-app.railway.app`
3. Set `VITE_API_URL` in Vercel to: `https://your-app.railway.app/api`
4. Redeploy Vercel

### Cause 2: VITE_API_URL Not Set in Vercel

**Symptom**: Requests going to wrong URL or relative path failing

**Fix**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update `VITE_API_URL`:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api`
   - Environment: All (Production, Preview, Development)
3. Redeploy

### Cause 3: Backend Environment Variables Missing

**Symptom**: Backend returns 500 errors

**Fix**: Check Railway backend has these variables set:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NODE_ENV=production`

### Cause 4: CORS Error

**Symptom**: CORS policy error in console

**Fix**: 
1. Check backend CORS allows your Vercel domain
2. Backend `server.ts` should allow `vercel.app` domains
3. Verify backend is deployed and running

## Quick Test

Test your backend directly:

1. Get your backend URL from Railway (e.g., `https://your-app.railway.app`)
2. Test health endpoint:
   ```
   https://your-app.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

3. If that works, check Vercel environment variables have the correct `VITE_API_URL`

## What Should Happen

1. User signs in with Google ✅ (working - you see your email)
2. Frontend calls: `GET /api/modules/session` with auth token
3. Backend creates/returns session data
4. Frontend displays session info (progress, modules, etc.)

Currently, step 2-4 are failing.

## Debug Checklist

- [ ] Backend deployed to Railway?
- [ ] Backend health endpoint works: `/api/health`
- [ ] `VITE_API_URL` set in Vercel environment variables?
- [ ] `VITE_API_URL` points to correct backend URL?
- [ ] Vercel redeployed after setting `VITE_API_URL`?
- [ ] Backend environment variables set (Supabase, Anthropic)?
- [ ] Check browser console for specific error messages
- [ ] Check Network tab for failed API requests



