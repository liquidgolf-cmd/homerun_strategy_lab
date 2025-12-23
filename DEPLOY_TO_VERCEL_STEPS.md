# Deploy to Vercel - Step by Step Guide

## Prerequisites

1. ✅ Code is ready (MVP implementation complete)
2. ⚠️ Environment variables ready (see below)
3. ⚠️ Supabase configured with Google OAuth

## Step 1: Install Vercel CLI (if not already installed)

**Option A: Global install (requires sudo)**
```bash
npm install -g vercel
```

**Option B: Local install (no sudo needed)**
```bash
npm install --save-dev vercel
# Then use: npx vercel
```

## Step 2: Login to Vercel

```bash
vercel login
# Or if using local install:
npx vercel login
```

This will open a browser window for authentication.

## Step 3: Set Environment Variables

You'll need to set these in the Vercel dashboard **OR** during deployment.

### Required Environment Variables:

#### For Serverless Functions (API):
- `SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ANTHROPIC_API_KEY` - Your Anthropic API key

#### For Frontend Build:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### How to Set Environment Variables:

**During first deployment (interactive):**
```bash
vercel
# Follow prompts, say "yes" when asked about environment variables
# You'll be prompted to enter each variable
```

**Or set in Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project (or create new)
3. Go to Settings → Environment Variables
4. Add each variable for Production, Preview, and Development

## Step 4: Deploy

### First Deployment (Interactive):
```bash
vercel
# Or: npx vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No** (for first time) or **Yes** (if updating)
- Project name? (accept default or customize)
- Directory? **./** (current directory)
- Override settings? **No** (we have vercel.json)

### Production Deployment:
```bash
vercel --prod
# Or: npx vercel --prod
```

## Step 5: Update Supabase Redirect URLs

After deployment, you'll get a Vercel URL like: `https://your-project.vercel.app`

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Redirect URLs":
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/**`
   - Also add for preview URLs if needed: `https://your-project-git-*.vercel.app`

## Step 6: Verify Deployment

1. Visit your Vercel URL
2. Check `/api/health` endpoint: `https://your-project.vercel.app/api/health`
3. Try signing in with Google
4. Test Module 0 flow

## Troubleshooting

### Build Errors

**"Module not found" errors:**
- Make sure `api/package.json` exists and has dependencies
- Check that `installCommand` in `vercel.json` includes `cd ../api && npm install`

**"Environment variable not found":**
- Check Vercel dashboard → Settings → Environment Variables
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding variables

### Runtime Errors

**"SUPABASE_URL must be set":**
- Check environment variables are set in Vercel dashboard
- Make sure you've redeployed after adding variables

**API routes return 404:**
- Check `vercel.json` rewrites are correct
- Verify API functions are in `api/` folder with correct structure

**Auth errors:**
- Verify Supabase redirect URLs include your Vercel URL
- Check Google OAuth is enabled in Supabase
- Make sure you're using the correct Supabase project

### Function Logs

View logs in Vercel dashboard:
1. Go to your project
2. Click on "Functions" tab
3. Click on any function to see logs

Or via CLI:
```bash
vercel logs
```

## Next Steps After Deployment

1. ✅ Test Module 0 end-to-end
2. ✅ Verify audit review generation works
3. ✅ Check all API endpoints respond correctly
4. 🚧 Add Modules 1-4 (after MVP validation)
5. 🚧 Add final documents generation

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Open project in browser
vercel open
```


