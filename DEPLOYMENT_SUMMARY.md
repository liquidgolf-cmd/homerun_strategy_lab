# Deployment Summary - Option 1: Frontend on Vercel, Backend Separate

## Architecture

- **Frontend**: Deployed to Vercel (static site)
- **Backend**: Deployed to Railway or Render (Node.js API)
- **Database**: SQLite (on backend server with persistent storage)

## Quick Start

### 1. Deploy Frontend to Vercel

1. Go to https://vercel.com and import your GitHub repo
2. Configure (auto-detected):
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
3. **Important**: Add environment variable:
   - Name: `VITE_API_URL`
   - Value: You'll set this after backend is deployed (e.g., `https://your-app.railway.app/api`)

### 2. Deploy Backend to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub → Select your repo
3. Set **Root Directory** to: `backend`
4. Add environment variables:
   - `ANTHROPIC_API_KEY` = your API key
   - `NODE_ENV` = production
   - `ALLOWED_ORIGINS` = your Vercel frontend URL (optional, for stricter CORS)
5. Copy the Railway URL (e.g., `https://your-app.up.railway.app`)

### 3. Connect Frontend to Backend

1. Go back to Vercel project settings
2. Update `VITE_API_URL` environment variable to: `https://your-app.up.railway.app/api`
3. Redeploy frontend

## Environment Variables

### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway/Render)
- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `NODE_ENV` - Set to `production`
- `PORT` - Port number (auto-set by Railway/Render)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed frontend URLs (optional)

## Testing

1. **Test Backend**: `https://your-backend.railway.app/api/health`
   - Should return: `{"status":"ok"}`

2. **Test Frontend**: `https://your-app.vercel.app`
   - Should load and connect to backend
   - Check browser console for any API errors

## Troubleshooting

- **CORS Errors**: Backend CORS is configured to allow Vercel domains
- **API Not Found**: Check `VITE_API_URL` is correct and frontend was redeployed
- **Backend Errors**: Check Railway/Render logs for errors

## Files Changed

- `frontend/src/services/api.ts` - Now uses `VITE_API_URL` environment variable
- `backend/src/server.ts` - CORS updated to allow Vercel domains
- `vercel.json` - Configured for frontend-only deployment

## Next Steps

After deployment:
1. Test the full flow (create session, complete modules)
2. Monitor backend logs for any issues
3. Set up custom domain if needed (both platforms support this)



