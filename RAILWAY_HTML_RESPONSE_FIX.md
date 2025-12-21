# Fix: Railway Returning HTML Instead of JSON

## Immediate Action Items

### Step 1: Check Railway Deployment Logs

1. Go to: https://railway.app
2. Open your project: **homerun-strategy-lab**
3. Click your **service** (backend service)
4. Go to **Deployments** tab
5. Click on the **latest deployment** (the one with green checkmark)
6. Scroll through the logs

**Look for these messages:**
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

**If you DON'T see these messages**, the server didn't start. Look for error messages instead.

### Step 2: Verify Start Command in Railway

1. In Railway, go to your service → **Settings** tab
2. Scroll to **"Start Command"** field
3. **It should be:** `node dist/server.js`
4. **It should NOT be:**
   - `cd backend && node dist/server.js` ❌
   - `npm start` ❌
   - Empty ❌

**If wrong, fix it:**
- Change to: `node dist/server.js`
- Click **Save**
- Railway will redeploy automatically

### Step 3: Check VITE_API_URL in Vercel

1. Go to: https://vercel.com
2. Open your project: **homerun-strategy-lab**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`

**It should be:**
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api
```

**Important:** Must include `/api` at the end!

**If wrong:**
- Update it to: `https://YOUR_RAILWAY_URL.railway.app/api`
- Make sure it includes `/api` at the end
- Save and redeploy Vercel frontend

### Step 4: Test Backend Directly

Test if the backend is actually running:

```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/health
```

**Should return:** `{"status":"ok"}`

**If it returns HTML:**
- Backend server is NOT running
- Go back to Step 1 and check logs for errors

**If it returns JSON:**
- Backend is working! The issue is the frontend URL configuration

## Common Issues

### Issue 1: Server Not Starting

**Symptoms:** Logs don't show "Server running..."

**Possible causes:**
- Missing environment variables (check Railway Variables tab)
- TypeScript compilation errors
- Module not found errors

**Fix:** Check logs for specific error, then fix it.

### Issue 2: Wrong Start Command

**Symptoms:** Build succeeds but server never starts

**Fix:** Update Start Command to `node dist/server.js`

### Issue 3: VITE_API_URL Missing `/api`

**Symptoms:** Backend works but frontend calls wrong URL

**Fix:** Update `VITE_API_URL` in Vercel to include `/api` at the end

## Quick Checklist

- [ ] Railway logs show "Server running on http://localhost:3000"
- [ ] Railway Start Command is `node dist/server.js`
- [ ] `/api/health` endpoint returns `{"status":"ok"}` (JSON, not HTML)
- [ ] Vercel `VITE_API_URL` includes `/api` at the end
- [ ] Vercel frontend redeployed after changing `VITE_API_URL`

## Still Not Working?

If the health endpoint returns HTML, the backend server is definitely not running. Check Railway logs for the specific error message and share it.

