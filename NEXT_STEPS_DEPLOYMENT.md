# Next Steps for Deployment

## Current Status

I've unlinked the previous project configuration. The project is ready for a fresh deployment.

## Deploy Command

Run this command to start an interactive deployment:

```bash
npx vercel
```

**Answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account (liquidgolf-4203)
- Link to existing project? → **No** (we want a fresh project)
- What's your project's name? → `homeruns-strategy-lab` (or your preference)
- In which directory is your code located? → **./** (just press Enter)

## After First Deployment

The first deployment might fail or work partially. You'll need to configure the project settings in the Vercel dashboard:

1. **Go to:** https://vercel.com/dashboard
2. **Click on your project**
3. **Go to Settings → General**
4. **Update these settings:**

   - **Framework Preset:** `Other` or `Vite`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install && cd frontend && npm install && cd ../api && npm install`
   - **Root Directory:** (leave empty)

5. **Save settings**

6. **Go to Settings → Environment Variables** and add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

7. **Redeploy:**
   ```bash
   npx vercel --prod
   ```

## Alternative: Use Vercel Dashboard

Instead of CLI, you can also:
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure settings in the import wizard
5. Deploy

This might be easier for the first deployment as the UI guides you through configuration.

## Questions?

If you run into issues, check:
- Build logs in Vercel dashboard
- Environment variables are set correctly
- Supabase redirect URLs include your Vercel domain

