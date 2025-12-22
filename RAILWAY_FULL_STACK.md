# Deploy Full Stack to Railway

## Architecture

- **Frontend + Backend**: Deployed together on Railway
- **Database**: SQLite with persistent storage
- **Single URL**: Everything runs from one domain

## Quick Setup

### Step 1: Deploy to Railway

1. Go to https://railway.app
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository: `liquidgolf-cmd/homerun_strategy_lab`
6. Railway will auto-detect the configuration

### Step 2: Configure Environment Variables

1. In Railway project, go to **Variables** tab
2. Add these environment variables:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   NODE_ENV=production
   PORT=3000
   ```

### Step 3: Wait for Deployment

Railway will:
1. Install all dependencies (frontend + backend)
2. Build the frontend
3. Build the backend
4. Copy frontend build to backend/public
5. Start the server

### Step 4: Get Your URL

Once deployed:
- Railway provides a URL like: `https://your-app.up.railway.app`
- Your app is live at this URL!

## How It Works

1. **Build Process**:
   - Installs frontend and backend dependencies
   - Builds React frontend → `frontend/dist/`
   - Builds TypeScript backend → `backend/dist/`
   - Copies frontend build to `backend/public/`

2. **Runtime**:
   - Backend Express server starts
   - Serves static files from `backend/public/` (the frontend)
   - Handles API routes at `/api/*`
   - Frontend uses relative paths, so `/api` calls go to the same domain

3. **Database**:
   - SQLite database stored in `backend/data/db.sqlite`
   - Persistent across deployments
   - Railway provides persistent disk storage

## Testing

1. Visit your Railway URL
2. You should see the Homeruns Strategy Lab landing page
3. Test creating a session
4. Check backend health: `https://your-app.up.railway.app/api/health`

## Configuration Files

- `railway.json` - Railway build and deploy configuration
- `package.json` (root) - Has `install:all` and `build` scripts
- `backend/src/server.ts` - Serves frontend static files in production

## Advantages

✅ Single deployment
✅ Single URL
✅ SQLite works perfectly (persistent storage)
✅ No CORS issues (same domain)
✅ Simpler configuration
✅ Easier to manage

## Troubleshooting

### Build Fails
- Check Railway build logs
- Verify all dependencies are in package.json files
- Make sure Node version is correct (set in backend/package.json engines)

### Frontend Not Loading
- Check that frontend build completed successfully
- Verify `backend/public/` directory has frontend files
- Check server logs for errors

### API Not Working
- Verify backend is running (check logs)
- Test `/api/health` endpoint
- Check that static file serving is configured correctly

### Database Issues
- SQLite database auto-creates on first run
- Check that `backend/data/` directory has write permissions
- Database persists across deployments

## Custom Domain

Railway supports custom domains:
1. Go to Settings → Networking
2. Add your custom domain
3. Railway handles SSL automatically



