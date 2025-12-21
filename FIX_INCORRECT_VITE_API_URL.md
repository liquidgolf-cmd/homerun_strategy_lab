# Fix: Incorrect VITE_API_URL Configuration

## The Problem

Your `VITE_API_URL` is set incorrectly. The error shows:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/modules/session/API
```

But it should be:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session
```

## What's Wrong

Your `VITE_API_URL` is probably set to:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/modules/session/API
```

This is WRONG because:
1. ❌ `/api` should come right after the domain, not at the end
2. ❌ It's uppercase `API` instead of lowercase `api`
3. ❌ It includes `/modules/session` which the frontend code adds automatically

## The Fix

### Step 1: Update VITE_API_URL in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com
2. Your project → **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. **Delete the current value**
5. **Set it to exactly this:**
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api
   ```
   
   **Important:**
   - Must be lowercase `api` (not `API`)
   - Must end with `/api` (nothing after it)
   - Must NOT include `/modules/session` (frontend adds that)

6. Click **Save**

### Step 2: Redeploy Vercel

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for completion (2-3 minutes)

### Step 3: Verify

After redeploy, the API call should be:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session
```

## How It Works

The frontend code does this:
```typescript
baseURL = VITE_API_URL  // "https://railway.app/api"
requestPath = "/modules/session"
finalURL = baseURL + requestPath  // "https://railway.app/api/modules/session" ✅
```

So `VITE_API_URL` should ONLY be the base URL with `/api` at the end, nothing more!

## Correct Configuration

**VITE_API_URL should be:**
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api
```

**NOT:**
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/modules/session/API  ❌
```

