# How to Set Root Directory in Railway

## Where to Find Root Directory Setting

### Method 1: When Creating/Configuring a Service

1. **After selecting your GitHub repository** in Railway:
   - Railway will create a new service
   - Click on the **service** (the box that appears with your repo name)

2. **In the service settings**:
   - Click on the **"Settings"** tab (at the top of the service panel)
   - Scroll down to **"Root Directory"** section
   - Enter: `backend`
   - Click **"Save"** or it saves automatically

### Method 2: After Service is Created

If you've already created the service:

1. **Click on your service** in the Railway dashboard
2. **Click the "Settings" tab** (top navigation)
3. **Scroll down** to find **"Root Directory"**
4. **Enter**: `backend`
5. **It saves automatically** (no save button needed)

## Visual Guide

```
Railway Dashboard
├── Your Project
    └── Your Service (the service card/box)
        ├── Deployments tab
        ├── Settings tab  ← Click here
        │   ├── Name
        │   ├── Domain
        │   ├── Root Directory  ← Find this section
        │   │   └── [backend]   ← Enter "backend" here
        │   ├── Build Command
        │   └── Start Command
        └── Variables tab
```

## Alternative: Using railway.json or railway.toml

You can also configure this in your repository:

**Create `railway.json` in the root:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && node dist/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Or use Railway's auto-detection:**
- Railway often auto-detects Node.js projects
- If your `backend/` folder has a `package.json`, Railway should detect it
- But setting Root Directory explicitly is more reliable

## Tips

- **Root Directory** tells Railway where your application code lives
- For your project, it's `backend` because your backend code is in the `backend/` folder
- After setting Root Directory, Railway will:
  - Run commands from that directory
  - Look for `package.json` in that directory
  - Use that as the working directory

## If You Can't Find It

If you don't see "Root Directory" option:

1. Make sure you're in the **Settings** tab of your service
2. Look for it in the **"Source"** section
3. Some Railway interfaces show it as **"Source Directory"** or **"Working Directory"**
4. If still not visible, try creating a new service or check Railway's documentation




