# Update Vercel with Railway URL

## Your Railway URL

```
https://homeruns-strategy-lab-production-1f3b.up.railway.app
```

## Step 1: Test Your Backend

First, let's verify the backend is working:

Open this URL in your browser:
```
https://homeruns-strategy-lab-production-1f3b.up.railway.app/api/health
```

**Should return:** `{"status":"ok"}` (JSON, not HTML)

If you see JSON, your backend is working! ✅
If you see HTML, there's still an issue with the backend.

## Step 2: Update Vercel Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com
2. Open your project: **homerun-strategy-lab**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` (or create it if it doesn't exist)
5. Set the value to:
   ```
   https://homeruns-strategy-lab-production-1f3b.up.railway.app/api
   ```
   
   **IMPORTANT:** 
   - Include `/api` at the end
   - Don't include a trailing slash after `/api`
   - The full value should be: `https://homeruns-strategy-lab-production-1f3b.up.railway.app/api`

6. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

7. Click **Save**

## Step 3: Redeploy Vercel Frontend

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait for deployment to complete (1-2 minutes)

## Step 4: Test the App

1. Visit your Vercel site: `https://homerun-strategy-lab.vercel.app`
2. Open browser console (F12)
3. Try to sign in with Google
4. Check the Network tab - the API request should go to:
   ```
   https://homeruns-strategy-lab-production-1f3b.up.railway.app/api/modules/session
   ```
5. Should return JSON (not HTML)

## Quick Checklist

- [ ] Backend health endpoint works: `/api/health` returns `{"status":"ok"}`
- [ ] `VITE_API_URL` in Vercel = `https://homeruns-strategy-lab-production-1f3b.up.railway.app/api`
- [ ] Includes `/api` at the end
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Vercel frontend redeployed
- [ ] Browser console shows correct API URL
- [ ] API returns JSON instead of HTML




