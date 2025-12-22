# Fix: Vercel API URL Configuration

## The Issue

Your Railway backend is running successfully (logs show "Server running"), but the frontend is getting HTML instead of JSON.

**Root Cause:** `VITE_API_URL` in Vercel is likely missing `/api` at the end.

## How the URLs Work

The frontend code does this:
```typescript
baseURL = VITE_API_URL  // e.g., "https://railway.app/api"
requestPath = "/modules/session"
finalURL = baseURL + requestPath  // "https://railway.app/api/modules/session" ✅
```

Your backend expects:
- `/api/modules/session`
- `/api/health`
- `/api/ai/chat`

## The Fix

### Step 1: Check Railway Public URL

1. Go to Railway Dashboard
2. Your service → Settings tab
3. Find "Public Domain" or "Generate Domain"
4. Copy your Railway URL (e.g., `https://homerun-strategy-lab-production-1f3b.up.railway.app`)

### Step 2: Update VITE_API_URL in Vercel

1. Go to Vercel Dashboard: https://vercel.com
2. Open project: **homerun-strategy-lab**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` (or create it if it doesn't exist)
5. Set the value to:
   ```
   https://YOUR_RAILWAY_URL.railway.app/api
   ```
   
   **Example:**
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api
   ```
   
   **CRITICAL:** Must include `/api` at the end!

6. Make sure it's set for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
7. Click **Save**

### Step 3: Redeploy Vercel Frontend

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait for deployment to complete (1-2 minutes)

### Step 4: Test

1. Visit your Vercel site: `https://homerun-strategy-lab.vercel.app`
2. Open browser console (F12)
3. Sign in with Google
4. Check Network tab - the API request should be:
   ```
   https://YOUR_RAILWAY_URL.railway.app/api/modules/session
   ```
5. Should return JSON (not HTML)

## Verify Backend is Working

Test the backend health endpoint directly:
```
https://YOUR_RAILWAY_URL.railway.app/api/health
```

Should return: `{"status":"ok"}` (JSON, not HTML)

If this works, your backend is fine - the issue is just the frontend URL config.

## Quick Checklist

- [ ] Railway URL copied (e.g., `https://xxx.railway.app`)
- [ ] `VITE_API_URL` in Vercel = `https://xxx.railway.app/api` (with `/api`)
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Vercel frontend redeployed
- [ ] Browser console shows correct API URL with `/api/modules/session`
- [ ] API returns JSON instead of HTML



