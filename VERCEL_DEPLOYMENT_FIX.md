# Fix Vercel Deployment - Environment Variables

## The Problem

Your Vercel deployment at https://homerun-strategy-lab.vercel.app/ is not working because the Supabase environment variables are not set in Vercel.

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Log in to your account
3. Find your project: **homerun-strategy-lab**
4. Click on it

### Step 2: Add Environment Variables

1. Click **"Settings"** in the top navigation
2. Click **"Environment Variables"** in the left sidebar
3. Add these variables:

#### Variable 1: VITE_SUPABASE_URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://sjngcdxxtkvmjigoethp.supabase.co` (your Supabase project URL)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 2: VITE_SUPABASE_ANON_KEY
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Your Supabase **anon/public** key (NOT service_role!)
  - Get it from: Supabase Dashboard → Settings → API → anon public key
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 3: VITE_API_URL (Optional)
- **Name**: `VITE_API_URL`
- **Value**: Your backend API URL (if you have one deployed)
  - Example: `https://your-backend.railway.app/api`
  - Or leave this unset if backend is on same domain
- **Environment**: Select all
- Click **"Save"**

### Step 3: Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Or push a new commit to trigger a new deployment

### Step 4: Verify

1. Wait for deployment to complete (usually 1-2 minutes)
2. Visit https://homerun-strategy-lab.vercel.app/
3. The app should now load without errors

## Important Notes

### Use the Correct Key Type

- ✅ **Frontend (Vercel)**: Use **anon/public** key
- ❌ **DO NOT** use service_role key in Vercel (it's for backend only)

### How to Get Your Anon Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click ⚙️ **Settings** → **API**
4. Under "Project API keys", find the row with:
   - **Name**: `anon`
   - **Type**: `public`
5. Click the 👁️ eye icon to reveal it
6. Copy that key (it's long, starts with `eyJ...`)

### Check Build Logs

If it still doesn't work:

1. Go to Vercel → Your Project → **Deployments**
2. Click on the latest deployment
3. Check the **"Build Logs"** tab
4. Look for any errors related to:
   - Missing environment variables
   - Build failures
   - Runtime errors

## Troubleshooting

### Error: "Missing Supabase environment variables"
- ✅ Make sure `VITE_SUPABASE_URL` is set
- ✅ Make sure `VITE_SUPABASE_ANON_KEY` is set
- ✅ Make sure you're using the **anon** key, not service_role
- ✅ Redeploy after adding variables

### Error: "Invalid API key"
- ✅ Check that you copied the entire anon key (it's very long)
- ✅ Make sure there are no extra spaces
- ✅ Verify it's the anon key, not service_role

### Blank Page
- ✅ Check browser console for errors (F12)
- ✅ Check Vercel build logs
- ✅ Verify environment variables are set for "Production" environment

## Quick Checklist

- [ ] Added `VITE_SUPABASE_URL` in Vercel
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Vercel (anon key, not service_role)
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed the application
- [ ] Verified the site loads without errors



