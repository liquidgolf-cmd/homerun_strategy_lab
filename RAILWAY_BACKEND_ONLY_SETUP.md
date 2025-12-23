# Railway Backend-Only Deployment Setup

Since you're using **Vercel for frontend** and **Railway for backend only**, here's the correct setup:

## Step-by-Step Setup

### 1. Create/Configure Railway Service

1. Go to Railway Dashboard: https://railway.app
2. Click on project: **homerun-strategy-lab**
3. If no service exists, click **"New"** → **"Empty Service"**
4. If service exists, click on it to edit

### 2. Connect GitHub Repository

1. In the service, click **"Add Source"** → **"GitHub Repo"**
2. Select repository: `liquidgolf-cmd/homerun_strategy_lab`
3. Railway will connect the repo

### 3. Set Root Directory ⚠️ CRITICAL

1. In service, go to **Settings** tab
2. Scroll down to **"Root Directory"**
3. Set it to: `backend`
4. **This tells Railway to only build/deploy the backend folder**

### 4. Configure Build Settings

Railway should auto-detect, but verify:

**Build Command:** (leave empty - Railway will use `npm install` from backend/package.json)

**Start Command:** `npm start`
   - Or: `node dist/server.js`
   - Railway will run this from the `backend` directory

### 5. Add Environment Variables

In service → **Variables** tab, add:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ALLOWED_ORIGINS=https://homerun-strategy-lab.vercel.app
PORT=3000
```

**Note:** Railway automatically sets PORT, but including it doesn't hurt.

### 6. Deploy

1. Railway will automatically deploy when you save settings
2. Or click **"Deploy"** button if available
3. Go to **Deployments** tab to watch progress

### 7. Check Deployment Logs

1. Click on latest deployment in **Deployments** tab
2. Check logs for:
   - ✅ "Server running on http://localhost:3000"
   - ✅ "API available at http://localhost:3000/api"
   - ❌ Any errors (build failures, missing modules, etc.)

### 8. Get Your Railway URL

1. In service, go to **Settings** tab
2. Scroll to **"Networking"** section
3. Copy the **Public URL** (e.g., `https://homerun-strategy-lab-production-xxxx.up.railway.app`)
4. Or find it in **"Generate Domain"** section

### 9. Test Backend

Test the health endpoint:
```
https://YOUR_RAILWAY_URL.railway.app/api/health
```

Should return: `{"status":"ok"}`

### 10. Update Vercel

1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Update `VITE_API_URL` to: `https://YOUR_RAILWAY_URL.railway.app/api`
4. Redeploy frontend

## Troubleshooting

### "Not Found" Error (Current Issue)

**Cause:** Backend service isn't running

**Fix:**
1. Check **Root Directory** is set to `backend` ← **Most common issue**
2. Check deployment logs for errors
3. Verify environment variables are set
4. Check **Start Command** is correct

### Build Fails

**Check logs for:**
- Missing dependencies → Run `npm install` locally to verify
- TypeScript errors → Fix compilation errors
- Missing environment variables → Add all required vars

### Service Starts But No Response

**Check:**
- Server is listening on `process.env.PORT` (Railway sets this)
- Health endpoint exists: `/api/health`
- CORS is configured correctly

## What Railway Does Automatically

When Root Directory = `backend`:
1. Runs `npm install` in `backend/` folder
2. Runs `npm run build` (from backend/package.json)
3. Runs your Start Command (e.g., `npm start` which runs `node dist/server.js`)

## Quick Checklist

- [ ] Service created in Railway
- [ ] GitHub repo connected
- [ ] **Root Directory set to `backend`** ← Critical!
- [ ] Environment variables added
- [ ] Deployment successful (green checkmark)
- [ ] Logs show "Server running..."
- [ ] Health endpoint works: `/api/health`
- [ ] Vercel `VITE_API_URL` updated




