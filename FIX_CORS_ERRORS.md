# Fix CORS Errors - Backend Not Deployed

## The Problem

You're seeing CORS errors like:
```
Access to XMLHttpRequest at 'https://us-central1-homerun-strategy-lab.cloudfunctions.net/...' 
from origin 'https://homerun-strategy-lab.vercel.app' has been blocked by CORS policy
```

This means:
1. Your frontend is trying to call an old Firebase Functions URL (which we're not using anymore)
2. OR the frontend doesn't have a backend URL configured
3. The backend needs to be deployed separately

## Solution: Deploy Backend and Configure Frontend

Since we're using Supabase + Vercel architecture:
- **Frontend**: Vercel ✅ (already deployed)
- **Backend**: Needs to be deployed to Railway/Render/Similar
- **Database**: Supabase ✅ (already set up)

### Step 1: Deploy Backend to Railway (Recommended)

1. **Go to Railway**: [https://railway.app](https://railway.app)
2. **Sign up/Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `liquidgolf-cmd/homerun_strategy_lab`
5. **Configure the service**:
   - Set **Root Directory** to: `backend`
   - Railway will auto-detect Node.js
6. **Add Environment Variables** (Railway → Variables tab):
   ```
   SUPABASE_URL=https://sjngcdxxtkvmjigoethp.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key
   NODE_ENV=production
   PORT=3000
   ```
7. **Deploy**: Railway will auto-deploy
8. **Get your backend URL**: 
   - Railway provides a URL like: `https://your-app.railway.app`
   - Copy this URL

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**: [https://vercel.com](https://vercel.com)
2. **Select your project**: homerun-strategy-lab
3. **Settings** → **Environment Variables**
4. **Add/Update** `VITE_API_URL`:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app.railway.app/api` (your Railway backend URL)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
5. **Redeploy**: Go to Deployments → Latest → "..." → "Redeploy"

### Step 3: Verify Backend is Working

Before updating Vercel, test your backend:

1. **Check backend health endpoint**:
   ```
   https://your-app.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

2. **If it doesn't work**, check Railway logs for errors

### Alternative: Deploy Backend to Render

If you prefer Render:

1. **Go to Render**: [https://render.com](https://render.com)
2. **New +** → **Web Service**
3. **Connect your GitHub repository**
4. **Configure**:
   - **Name**: `homeruns-strategy-lab-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
5. **Add Environment Variables** (same as Railway above)
6. **Deploy** and get your Render URL
7. **Update Vercel** `VITE_API_URL` to point to Render URL

## Current Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │ ──► Makes API calls to ──►
└─────────────────┘                            │
                                               ▼
                                    ┌──────────────────┐
                                    │  Railway/Render  │
                                    │  (Backend API)   │ ──► Queries ──►
                                    └──────────────────┘                │
                                                                        ▼
                                                              ┌──────────────────┐
                                                              │  Supabase        │
                                                              │  (Database)      │
                                                              └──────────────────┘
```

## Quick Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables set (Supabase URL, service_role key, Anthropic API key)
- [ ] Backend health endpoint works: `/api/health`
- [ ] `VITE_API_URL` set in Vercel to backend URL
- [ ] Vercel redeployed after setting `VITE_API_URL`
- [ ] Test sign-in flow works end-to-end

## Troubleshooting

### Backend returns 500 errors
- Check Railway/Render logs
- Verify all environment variables are set correctly
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is the service_role key, not anon key

### CORS errors persist
- Make sure backend CORS allows your Vercel domain
- Check `backend/src/server.ts` CORS configuration
- Backend should allow: `https://homerun-strategy-lab.vercel.app`

### Backend health endpoint doesn't respond
- Check Railway/Render logs for startup errors
- Verify PORT environment variable (Railway sets this automatically)
- Check that build completed successfully

## Why Separate Frontend/Backend?

- **Vercel**: Great for static frontend hosting (fast CDN)
- **Railway/Render**: Better for backend APIs (persistent connections, server-side logic)
- **Supabase**: Managed PostgreSQL database with auth

This architecture gives you the best of all worlds!

