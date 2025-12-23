# Update Railway Project URL

After renaming your Railway project, you need to update the Vercel environment variable to point to the new Railway URL.

## Step 1: Get Your New Railway URL

1. Go to [Railway Dashboard](https://railway.app)
2. Click on your project: **homerun-strategy-lab**
3. Click on your service (backend service)
4. Go to **Settings** tab
5. Look for **"Domain"** or **"Public URL"** section
6. Your Railway URL will look like: `https://homerun-strategy-lab-production-xxxx.up.railway.app`
   OR it might be a custom domain if you set one up

## Step 2: Test the Backend URL

Test that your backend is accessible:
```
https://YOUR_RAILWAY_URL.railway.app/api/health
```

Should return: `{"status":"ok"}`

## Step 3: Update Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project: **homerun-strategy-lab**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` (or create it if it doesn't exist)
5. Update the value to: `https://YOUR_NEW_RAILWAY_URL.railway.app/api`
   - Replace `YOUR_NEW_RAILWAY_URL` with your actual Railway URL
   - Make sure to include `/api` at the end
6. Make sure it's set for all environments (Production, Preview, Development)
7. Click **Save**

## Step 4: Redeploy Vercel

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait for deployment to complete

## Step 5: Verify

1. Visit your Vercel site: https://homerun-strategy-lab.vercel.app
2. Sign in with Google
3. Check browser console for any errors
4. The session should now load correctly

## Quick Checklist

- [ ] Got new Railway URL from Railway dashboard
- [ ] Tested `/api/health` endpoint works
- [ ] Updated `VITE_API_URL` in Vercel environment variables
- [ ] Included `/api` in the URL
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Redeployed Vercel frontend
- [ ] Tested the site works end-to-end




