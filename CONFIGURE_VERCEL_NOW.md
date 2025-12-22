# Configure Vercel with Railway URL

## Your Railway URL

```
https://homerun-strategy-lab-production-1f3b.up.railway.app
```

## Step-by-Step Configuration

### Step 1: Update Vercel Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com
2. Open your project: **homerun-strategy-lab**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` (or create it if it doesn't exist)
5. Set the value to:
   ```
   https://homerun-strategy-lab-production-1f3b.up.railway.app/api
   ```
   
   **CRITICAL:** 
   - Must include `/api` at the end
   - No trailing slash after `/api`
   - Full value: `https://homerun-strategy-lab-production-1f3b.up.railway.app/api`

6. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

7. Click **Save**

### Step 2: Redeploy Vercel Frontend

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **"..."** menu (three dots) on the right
4. Click **"Redeploy"**
5. Wait for deployment to complete (1-2 minutes)

### Step 3: Test Your App

1. Visit: `https://homerun-strategy-lab.vercel.app`
2. Open browser console (F12)
3. Try to sign in with Google
4. Check the **Network** tab:
   - Look for a request to `/api/modules/session`
   - The full URL should be: `https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session`
   - Should return JSON (not HTML)

## What Should Happen

Once configured correctly:
1. Frontend calls: `https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session`
2. Backend responds with JSON session data
3. No more HTML responses
4. Google sign-in works properly

## Troubleshooting

If you still get HTML responses:
- Double-check `VITE_API_URL` includes `/api` at the end
- Make sure Vercel was redeployed after changing the env var
- Check browser console for the actual API URL being called
- Verify Railway backend is running (check Deployment logs show "Server running")



