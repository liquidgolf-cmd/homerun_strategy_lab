# Railway "Not Found" Error - Troubleshooting

You're seeing a "Not Found" error from Railway when accessing your backend. This means the Railway service exists but the backend isn't properly deployed or running.

## Quick Checks

### 1. Is Your Service Actually Deployed?

1. Go to Railway Dashboard: https://railway.app
2. Click on your project: **homerun-strategy-lab**
3. You should see a service listed (likely named "backend" or similar)
4. Check the **Deployments** tab - is there a successful deployment?
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed
   - ⏳ Yellow = In progress

### 2. Check Railway Service Settings

1. Click on your **service** (not the project)
2. Go to **Settings** tab
3. Verify these settings:

   **Root Directory:**
   - Should be set to: `backend`
   - This tells Railway where your backend code is

   **Build Command:**
   - Should be: `npm install && npm run build`
   - Or leave empty if using default

   **Start Command:**
   - Should be: `node dist/server.js`
   - Or: `npm start`

### 3. Check Environment Variables

1. In Railway service, go to **Variables** tab
2. Make sure these are set:
   ```
   ANTHROPIC_API_KEY=your_key_here
   NODE_ENV=production
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ALLOWED_ORIGINS=https://homerun-strategy-lab.vercel.app
   ```

### 4. Check Deployment Logs

1. In Railway service, go to **Deployments** tab
2. Click on the latest deployment
3. Check the logs for errors:
   - Look for build errors
   - Look for startup errors
   - Look for "Server running on port..." message

### 5. Common Issues

#### Issue: Root Directory Not Set
**Symptom:** Railway tries to build from root directory  
**Fix:**
1. Go to Service → Settings
2. Set **Root Directory** to: `backend`
3. Redeploy

#### Issue: Missing Environment Variables
**Symptom:** Backend starts but fails to connect to database/APIs  
**Fix:**
1. Add all required environment variables (see step 3 above)
2. Redeploy

#### Issue: Wrong Start Command
**Symptom:** Build succeeds but service never starts  
**Fix:**
1. Check **Start Command** in Settings
2. Should be: `node dist/server.js`
3. Redeploy

#### Issue: Port Configuration
**Symptom:** Service starts but Railway can't route traffic  
**Fix:**
1. Make sure backend listens on `process.env.PORT || 3000`
2. Railway automatically sets PORT, don't hardcode it

### 6. Manual Health Check

Once the service is running, try these URLs:
- `https://your-railway-url.railway.app/api/health`
- `https://your-railway-url.railway.app/`

Both should return something (health endpoint returns `{"status":"ok"}`).

### 7. Re-deploy from Scratch

If nothing works:

1. **Create New Service:**
   - In Railway project, click **"New"** → **"Empty Service"**
   - Or delete existing service and recreate

2. **Connect GitHub:**
   - Click **"Add Source"** → **"GitHub Repo"**
   - Select: `liquidgolf-cmd/homerun_strategy_lab`

3. **Set Root Directory:**
   - Service Settings → **Root Directory** = `backend`

4. **Add Environment Variables:**
   - Add all variables from step 3 above

5. **Deploy:**
   - Railway will auto-deploy
   - Check logs for errors

## What to Look For in Logs

✅ **Good signs:**
- "Server running on http://localhost:3000"
- "Database connected"
- Build completes successfully
- No error messages

❌ **Bad signs:**
- "Cannot find module..."
- "Port already in use"
- "Database connection failed"
- Build errors
- TypeScript compilation errors

## Next Steps

After fixing the deployment:

1. Wait for Railway to deploy (usually 1-2 minutes)
2. Test: `https://your-railway-url.railway.app/api/health`
3. Should return: `{"status":"ok"}`
4. Then update Vercel `VITE_API_URL` to point to this URL

