# Railway Server Not Running - Returning HTML Instead of JSON

## Problem

The API endpoint is returning HTML (the frontend's `index.html`) instead of JSON. This means the Express backend server is not running on Railway.

## Diagnosis

When you see HTML returned from API endpoints like `/modules/session`, it means:
1. The Express server isn't running, OR
2. Railway is serving static files instead of executing Node.js

## Check Railway Logs

1. Go to Railway Dashboard → Your project → Your service
2. Click **"Deployments"** tab
3. Click on the **latest deployment** (the one that succeeded)
4. Check the **logs** for:
   - ✅ Should see: `Server running on http://localhost:3000`
   - ✅ Should see: `API available at http://localhost:3000/api`
   - ❌ If you DON'T see these, the server isn't starting

## Common Causes & Fixes

### 1. Start Command Issue

**Check:** Railway service → Settings → Start Command

**Should be:**
```
node dist/server.js
```

**NOT:**
```
cd backend && node dist/server.js
npm start
```

**Fix:** Update Start Command in Railway settings to: `node dist/server.js`

### 2. Build Not Creating `dist/` Folder

**Check logs** for build step. Should see:
```
> tsc
```

**Verify:** After build, `dist/server.js` should exist.

**Fix:** If build fails, check TypeScript errors in logs.

### 3. Missing Environment Variables

**Check:** Railway service → Variables tab

**Required:**
- `ANTHROPIC_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NODE_ENV=production`

**Fix:** Add missing environment variables.

### 4. Server Crashes on Startup

**Check logs** for error messages right after "Starting..."

**Common errors:**
- "Cannot find module..." → Missing dependencies
- "Port already in use" → Port conflict (shouldn't happen on Railway)
- "Database connection failed" → Supabase credentials wrong

**Fix:** Fix the error shown in logs.

### 5. Root Directory Not Set

**Check:** Railway service → Settings → Root Directory

**Should be:** `backend`

**Fix:** Set Root Directory to `backend`

## Quick Fix Steps

1. **Verify Start Command:**
   - Railway → Service → Settings
   - Start Command: `node dist/server.js`
   - Save

2. **Check Deployment Logs:**
   - Railway → Deployments → Latest deployment → View logs
   - Look for "Server running..." message

3. **Test Health Endpoint:**
   ```
   curl https://your-railway-url.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

4. **If server still not running:**
   - Check for errors in logs
   - Verify environment variables
   - Try redeploying

## Verify Backend is Running

Once fixed, you should see in Railway logs:
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

And the health endpoint should work:
```
https://your-railway-url.railway.app/api/health
→ {"status":"ok"}
```

