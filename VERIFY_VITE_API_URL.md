# Verify VITE_API_URL Configuration

## Current Issue

The API is still calling the wrong URL:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/modules/session
```

Should be:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session
```

## Step-by-Step Verification

### Step 1: Check VITE_API_URL in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com
2. Your project → **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. **It MUST be exactly:**
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api
   ```
   
   Check:
   - ✅ Starts with `https://`
   - ✅ Domain: `homerun-strategy-lab-production-1f3b.up.railway.app`
   - ✅ Ends with `/api` (lowercase)
   - ✅ No trailing slash after `/api`
   - ✅ Does NOT include `/modules/session`
   - ✅ Does NOT include `/API` (uppercase)

### Step 2: Verify It's Set for All Environments

Make sure `VITE_API_URL` is enabled for:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 3: Force a Complete Redeploy

**Important:** Vite env vars are baked into the build at build time!

1. **Option A: Trigger New Deployment**
   - Make a small change (add a comment to any file)
   - Commit and push to GitHub
   - Vercel will auto-deploy with new env vars

2. **Option B: Redeploy from Vercel**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - **Make sure to select "Use existing Build Cache" = OFF** (if that option exists)

### Step 4: Check Build Logs

After redeploy:
1. Go to Deployments tab
2. Click on the new deployment
3. Check the build logs
4. Look for any env var warnings or errors

### Step 5: Clear Browser Cache

After redeploy:
1. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
2. **OR** use incognito/private window
3. **OR** clear browser cache

### Step 6: Check Console Logs

After the new deployment is live:
1. Visit your site
2. Open browser console (F12)
3. Look for the new debug logs:
   - `VITE_API_URL from env:` - should show the full URL with `/api`
   - `Base URL being used:` - should show the same
   - `Full URL will be:` - should show `/api/modules/session`

## Common Mistakes

1. **Missing `/api`**: `https://railway.app` ❌
2. **Uppercase `API`**: `https://railway.app/API` ❌
3. **Includes path**: `https://railway.app/api/modules/session` ❌
4. **Trailing slash**: `https://railway.app/api/` ❌

## Correct Format

**VITE_API_URL should be:**
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api
```

Nothing more, nothing less!



