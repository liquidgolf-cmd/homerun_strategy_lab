# Deploy Frontend to Vercel

## Setup

This configuration deploys **only the frontend** to Vercel. The backend needs to be deployed separately.

## Step 1: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository: `liquidgolf-cmd/homerun_strategy_lab`
4. Configure:
   - **Root Directory**: Leave empty (uses root)
   - **Framework Preset**: Other
   - **Build Command**: `cd frontend && npm install && npm run build` (auto-detected)
   - **Output Directory**: `frontend/dist` (auto-detected)
   - **Install Command**: `cd frontend && npm install` (auto-detected)

5. **Add Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api` (you'll set this after deploying backend)

6. Click "Deploy"

## Step 2: Deploy Backend to Railway/Render

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the backend
5. Set environment variables:
   - `ANTHROPIC_API_KEY` = your API key
   - `NODE_ENV` = production
   - `PORT` = 3000 (Railway sets this automatically)

6. Once deployed, copy the Railway URL (e.g., `https://your-app.railway.app`)
7. Update Vercel environment variable:
   - Go to Vercel project → Settings → Environment Variables
   - Update `VITE_API_URL` to: `https://your-app.railway.app/api`

### Option B: Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: homeruns-strategy-lab-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
   - **Plan**: Free or Paid

5. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV` = production
   - `PORT` = 3000

6. Once deployed, copy the Render URL
7. Update Vercel environment variable `VITE_API_URL` to point to your Render backend

## Step 3: Update CORS on Backend

Make sure your backend allows requests from your Vercel frontend URL:

In `backend/src/server.ts`, the CORS is already configured to allow all origins:
```typescript
app.use(cors());
```

If you need to restrict it, update to:
```typescript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3001'],
  credentials: true
}));
```

## Testing

1. Frontend should be live at: `https://your-app.vercel.app`
2. Backend should be live at: `https://your-backend.railway.app` (or Render URL)
3. Test API connection:
   - Open browser console on frontend
   - Check network tab for API calls
   - Should be calling your backend URL

## Troubleshooting

### CORS Errors
- Make sure backend CORS allows your Vercel domain
- Check that `VITE_API_URL` environment variable is set correctly

### API Not Working
- Verify backend is running (check backend URL in browser)
- Check that `VITE_API_URL` is correct in Vercel environment variables
- Make sure to rebuild frontend after changing environment variables

### Environment Variable Not Working
- Environment variables starting with `VITE_` are exposed to the client
- After changing `VITE_API_URL`, you need to redeploy the frontend
- Check Vercel build logs to verify the variable is set

