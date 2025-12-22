# Quick Deployment Guide

## Option 1: Railway (Easiest - Recommended)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up/login with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `homerun_strategy_lab` repository
4. Railway will auto-detect the configuration

### Step 3: Set Environment Variables
In Railway dashboard:
1. Go to your project → Variables
2. Add:
   - `ANTHROPIC_API_KEY` = your_api_key_here
   - `NODE_ENV` = production
   - `PORT` = 3000 (optional, Railway sets this automatically)

### Step 4: Configure Build Settings
Railway should auto-detect, but verify:
- **Root Directory**: (leave blank - uses root)
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && node dist/server.js`

Your app will be live at: `https://your-project-name.railway.app`

---

## Option 2: Render (Alternative)

1. Go to https://render.com
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: homeruns-strategy-lab
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && node dist/server.js`
   - **Plan**: Free or Paid
6. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV=production`
7. Click "Create Web Service"

Your app will be live at: `https://your-service-name.onrender.com`

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

### Deploy Backend First:
Follow Option 1 or 2 above to deploy backend. Note the URL.

### Deploy Frontend:
1. Update `frontend/src/services/api.ts`:
   ```typescript
   baseURL: 'https://your-backend-url.railway.app/api'
   ```

2. Deploy to Vercel:
   ```bash
   cd frontend
   npm i -g vercel
   vercel
   ```
   Or use Vercel dashboard:
   - Go to https://vercel.com
   - Import GitHub repo
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

---

## Post-Deployment Checklist

- [ ] Verify backend is accessible: `https://your-url.com/api/health`
- [ ] Test the frontend connects to backend
- [ ] Test a complete module flow
- [ ] Verify Anthropic API integration works
- [ ] Check that data persists (database)

---

## Troubleshooting

**Build Fails:**
- Check that all dependencies are in package.json
- Verify Node version (requires Node 18+)

**API Not Working:**
- Verify ANTHROPIC_API_KEY is set correctly
- Check Railway/Render logs for errors

**Frontend Can't Connect:**
- Update API base URL in frontend code
- Check CORS settings in backend
- Verify backend URL is correct



