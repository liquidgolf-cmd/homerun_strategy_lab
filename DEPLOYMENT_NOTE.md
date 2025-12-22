# Deployment Status

## Current Issue

Vercel has linked this project as an API-only project (`api`), but we need it to be a full-stack project with frontend + API.

## Solution Options

### Option 1: Create New Project (Recommended)

1. **Unlink current project:**
   ```bash
   rm -rf .vercel
   ```

2. **Deploy as new project:**
   ```bash
   npx vercel
   ```
   - When prompted, choose "No" for linking to existing project
   - Choose a new project name (e.g., "homeruns-strategy-lab")
   - Make sure it detects the frontend correctly

3. **Configure in Vercel Dashboard:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → General
   - Set:
     - Framework Preset: **Vite**
     - Build Command: `cd frontend && npm install && npm run build`
     - Output Directory: `frontend/dist`
     - Install Command: `npm install && cd frontend && npm install && cd ../api && npm install`

### Option 2: Update Existing Project Settings

1. Go to https://vercel.com/mike-hills-projects-d31a9ef5/api/settings
2. Update project settings:
   - Framework Preset: **Vite** or **Other**
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Root Directory: Leave empty (root)
   - Install Command: `npm install && cd frontend && npm install && cd ../api && npm install`

3. Deploy again:
   ```bash
   npx vercel --prod
   ```

## Environment Variables Required

Don't forget to set these in Vercel Dashboard → Settings → Environment Variables:

### For Serverless Functions:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`

### For Frontend Build:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## After Deployment

1. Get your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Update Supabase redirect URLs to include your Vercel URL
3. Test the deployment

