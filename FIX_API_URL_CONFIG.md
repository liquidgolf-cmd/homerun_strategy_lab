# Fix: API URL Configuration Issue

## The Problem

Your Railway backend is running successfully (you can see "Server running on http://localhost:3000" in logs), but the frontend is getting HTML instead of JSON.

This is because the frontend is calling the wrong URL, or the `VITE_API_URL` environment variable is not set correctly.

## Root Cause

The backend expects routes like:
- `/api/modules/session`
- `/api/health`
- `/api/ai/chat`

But if `VITE_API_URL` doesn't include `/api`, the frontend might be calling:
- `/modules/session` (wrong!)
- Which hits the catch-all route and returns HTML

## Solution: Fix VITE_API_URL in Vercel

### Step 1: Check Current VITE_API_URL

1. Go to Vercel Dashboard: https://vercel.com
2. Open your project: **homerun-strategy-lab**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`

### Step 2: Update VITE_API_URL

**Current value might be:**
```
https://homerun-strategy-lab-production-1f3b.up.railway.app
```

**Should be (with /api at the end):**
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api
```

**Important:** Must include `/api` at the end!

### Step 3: Save and Redeploy

1. Click **Save**
2. Make sure it's set for all environments (Production, Preview, Development)
3. Go to **Deployments** tab
4. Click **"..."** on latest deployment → **Redeploy**
5. Wait for redeploy to complete

### Step 4: Verify

1. Open your Vercel site
2. Open browser console (F12)
3. Try to sign in
4. Check the Network tab - the API request should be to:
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session
   ```
5. Should return JSON, not HTML

## How It Works

The frontend `api.ts` constructs URLs like this:

```typescript
// baseURL = VITE_API_URL (e.g., "https://railway.app/api")
// Request path = "/modules/session"
// Final URL = "https://railway.app/api" + "/modules/session"
//           = "https://railway.app/api/modules/session" ✅
```

If `VITE_API_URL` doesn't include `/api`:
```typescript
// baseURL = "https://railway.app" (missing /api!)
// Request path = "/modules/session"
// Final URL = "https://railway.app" + "/modules/session"
//           = "https://railway.app/modules/session" ❌ (wrong!)
```

## Quick Test

Test your backend directly (should return JSON):

```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/health
```

Should return: `{"status":"ok"}`

If this works, your backend is fine - just need to fix `VITE_API_URL` in Vercel.




