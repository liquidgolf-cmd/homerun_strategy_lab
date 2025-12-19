# Railway Deployment Fix

## The Problem

Railway is trying to build the entire project including the frontend, which is causing build failures. Railway needs to be configured to only build the backend.

## Solution

### Option 1: Configure Railway Service Root Directory (Recommended)

When setting up the Railway service:

1. Go to your Railway project
2. Click on the service (or create a new service)
3. Go to **Settings** tab
4. Set **Root Directory** to: `backend`
5. Railway will then only build from the backend directory

### Option 2: Update Railway Configuration

The `railway.json` and `railway.toml` files have been updated to configure the build properly.

### Option 3: Use Nixpacks Detection

Railway should auto-detect Node.js projects. Make sure:
- Root directory is set to `backend`
- Or create a service that points to `backend` folder

## Manual Railway Setup Steps

1. **Create New Service** in Railway:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - OR click "New" → "Empty Service" then connect GitHub

2. **Set Root Directory**:
   - Click on the service
   - Go to Settings
   - Set **Root Directory** to: `backend`
   - This tells Railway to only work with the backend folder

3. **Add Environment Variables**:
   - Go to Variables tab
   - Add:
     ```
     ANTHROPIC_API_KEY=your_key_here
     NODE_ENV=production
     ```

4. **Railway will auto-detect**:
   - Node.js project
   - Build command: `npm install && npm run build`
   - Start command: `node dist/server.js`

5. **Deploy**:
   - Railway will auto-deploy on git push
   - Check the Deployments tab for status

## If Build Still Fails

1. Check Railway build logs for specific errors
2. Verify root directory is set to `backend`
3. Make sure `backend/package.json` exists and has correct scripts
4. Try manually setting:
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/server.js`

## Testing

Once deployed, test:
- Health endpoint: `https://your-app.up.railway.app/api/health`
- Should return: `{"status":"ok"}`

