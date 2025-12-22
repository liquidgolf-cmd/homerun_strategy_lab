# Deploy to Vercel - Instructions

## Quick Deploy Steps

### 1. Deploy as New Project

```bash
npx vercel
```

**When prompted:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No** (create new)
- What's your project's name? → `homeruns-strategy-lab` (or your choice)
- In which directory is your code located? → `./` (press Enter)

### 2. Configure Project Settings in Vercel Dashboard

After first deployment, go to: https://vercel.com/dashboard

1. Click on your project
2. Go to **Settings → General**
3. Update these settings:

   **Framework Preset:** `Vite` or `Other`
   
   **Build Command:** 
   ```
   cd frontend && npm install && npm run build
   ```
   
   **Output Directory:** 
   ```
   frontend/dist
   ```
   
   **Install Command:**
   ```
   npm install && cd frontend && npm install && cd ../api && npm install
   ```
   
   **Root Directory:** Leave empty (use root)

4. Click **Save**

### 3. Set Environment Variables

Go to **Settings → Environment Variables** and add:

#### For Production, Preview, and Development:

**Serverless Functions (API):**
- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
- `ANTHROPIC_API_KEY` = your Anthropic API key

**Frontend Build:**
- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### 4. Redeploy

```bash
npx vercel --prod
```

### 5. Update Supabase Redirect URLs

1. Get your Vercel URL from the deployment output
2. Go to Supabase Dashboard → Authentication → URL Configuration
3. Add redirect URLs:
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/**`
   - `https://your-project-git-*.vercel.app` (for preview deployments)

### 6. Test Deployment

1. Visit your Vercel URL
2. Test `/api/health` endpoint
3. Try signing in with Google
4. Test Module 0 flow

## Troubleshooting

If build fails, check Vercel build logs in the dashboard for specific errors.

If you need to update settings, the `vercel.json` file should help, but you may also need to configure in the dashboard for the first deployment.

