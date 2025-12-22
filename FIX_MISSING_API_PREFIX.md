# Fix: Missing /api in API Calls

## The Problem

The frontend is calling:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/modules/session
```

But it should be:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session
```

The `/api` prefix is missing!

## Cause

`VITE_API_URL` in Vercel is either:
1. Not set correctly (missing `/api` at the end)
2. Not applied (frontend wasn't rebuilt after setting it)

## Fix Steps

### Step 1: Double-Check VITE_API_URL in Vercel

1. Go to Vercel Dashboard: https://vercel.com
2. Your project → **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. **Verify the value is exactly:**
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api
   ```
   
   **MUST include `/api` at the end!**

5. If it's wrong, fix it and click **Save**

### Step 2: Force a Full Redeploy

**Important:** Vite environment variables are baked into the build, so you must redeploy:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. **OR** better: Make a small change to trigger a new deployment:
   - Make a tiny code change (add a space, comment, etc.)
   - Push to GitHub
   - Vercel will auto-deploy with the new env var

### Step 3: Verify After Redeploy

1. Wait for deployment to complete (2-3 minutes)
2. Visit your site: `https://homerun-strategy-lab.vercel.app`
3. Open browser console (F12)
4. Check the API call - should now include `/api`:
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session
   ```

## Quick Verification

In Vercel Environment Variables, `VITE_API_URL` should be:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api
                                                              ^^^^
                                                              Must end with /api
```

## Still Not Working?

If after redeploy it still doesn't work:

1. **Clear browser cache** or use incognito mode
2. **Check Vercel build logs** - verify the env var was used during build
3. **Verify the deployment** - make sure you're looking at the latest deployment



