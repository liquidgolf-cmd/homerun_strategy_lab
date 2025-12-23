# Deploy Backend to Railway

## Quick Setup

1. **Install Railway CLI** (optional):
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy via Web**:
   - Go to https://railway.app
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select: `liquidgolf-cmd/homerun_strategy_lab`

3. **Configure Service**:
   - Railway should detect it's a Node.js project
   - Set **Root Directory** to: `backend`
   - Or create a new service and point to `backend` folder

4. **Set Environment Variables**:
   - Go to your project → Variables
   - Add:
     ```
     ANTHROPIC_API_KEY=your_anthropic_api_key_here
     NODE_ENV=production
     PORT=3000
     ```

5. **Configure Build Settings** (if needed):
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`

6. **Deploy**:
   - Railway will auto-deploy on git push
   - Or click "Deploy" manually

7. **Get Your Backend URL**:
   - Once deployed, Railway provides a URL like: `https://your-app.up.railway.app`
   - Copy this URL

8. **Update Frontend**:
   - Go to Vercel project settings
   - Add/Update environment variable:
     - `VITE_API_URL` = `https://your-app.up.railway.app/api`
   - Redeploy frontend

## Railway Configuration

Railway will auto-detect from `railway.json` if present, but the defaults should work fine.

## Database

SQLite will work on Railway because it provides persistent storage. The database file will be stored in `backend/data/db.sqlite` and will persist across deployments.

## Monitoring

- Check Railway dashboard for logs
- Monitor resource usage
- Set up alerts if needed




