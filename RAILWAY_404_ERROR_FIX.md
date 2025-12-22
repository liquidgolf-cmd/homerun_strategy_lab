# Fix Railway 404 "Application not found" Error

## The Problem

When accessing `https://homeruns-strategy-lab-production-1f3b.up.railway.app/api/health`, you get:
```json
{"status":"error","code":404,"message":"Application not found"}
```

This means Railway isn't routing traffic to your service correctly.

## Possible Causes

1. **Service doesn't have a public domain assigned**
2. **Service isn't running/deployed correctly**
3. **Multiple services in the project causing routing issues**

## Fix Steps

### Step 1: Verify Service is Running

1. Go to Railway Dashboard
2. Click your project: **homerun-strategy-lab**
3. Click your **service** (the backend service)
4. Go to **Deployments** tab
5. Check the latest deployment:
   - Should have a green checkmark ✅
   - Should show "Server running on http://localhost:3000" in logs

### Step 2: Generate/Assign Public Domain

1. In Railway, go to your **service**
2. Click **Settings** tab
3. Scroll down and look for:
   - **"Generate Domain"** button
   - **"Networking"** section
   - **"Public Domain"** section
4. If you see **"Generate Domain"**, click it
5. Railway will generate a domain for your service
6. Copy the generated domain

### Step 3: Verify Service is Exposed

1. Make sure your service has a public domain assigned
2. The domain should be different from the project URL
3. It might look like: `https://your-service-name-production-XXXX.up.railway.app`

### Step 4: Check Service Settings

In Railway service **Settings**, verify:
- **Start Command**: `node dist/server.js`
- Service is **active** (not paused)
- Latest deployment is **successful**

### Step 5: Test Again

After generating a domain, test:
```
https://YOUR_SERVICE_DOMAIN.railway.app/api/health
```

Should return: `{"status":"ok"}`

## Alternative: Check if Multiple Services

If you have multiple services in your project:

1. Railway might be routing to the wrong service
2. Make sure the service with your backend code has a public domain
3. The service name should indicate it's the backend (e.g., "backend", "api", "homerun-strategy-lab-backend")

## Still Getting 404?

1. **Take a screenshot** of your Railway service Settings page
2. **Share the Deployment logs** (the latest successful deployment)
3. **Check if there are multiple services** in your project

This will help identify what's wrong.



