# Set Environment Variables in Vercel - Step by Step

## The Error

You're seeing: "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"

This means the frontend environment variables are not set in Vercel.

## Step-by-Step Fix

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (this is the public/anonymous key)

### 2. Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (homeruns-strategy-lab or similar)
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)

### 3. Add Frontend Variables (Build-time)

Click **Add New** and add these **one at a time**:

**Variable 1:**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** Your Supabase Project URL (e.g., `https://xxxxx.supabase.co`)
- **Environment:** Check **Production**, **Preview**, and **Development**

Click **Save**

**Variable 2:**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon/public key (the long string)
- **Environment:** Check **Production**, **Preview**, and **Development**

Click **Save**

### 4. Add Backend Variables (Runtime)

**Variable 3:**
- **Key:** `SUPABASE_URL`
- **Value:** Your Supabase Project URL (same as VITE_SUPABASE_URL)
- **Environment:** Check **Production**, **Preview**, and **Development**

Click **Save**

**Variable 4:**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your Supabase **service_role** key (NOT the anon key - this is the secret key)
- **Environment:** Check **Production**, **Preview**, and **Development**

Click **Save**

**Variable 5:**
- **Key:** `ANTHROPIC_API_KEY`
- **Value:** Your Anthropic API key
- **Environment:** Check **Production**, **Preview**, and **Development**

Click **Save**

### 5. Redeploy

**Important:** Environment variables are only applied to NEW deployments!

1. Go to **Deployments** tab (top navigation)
2. Click the **three dots** (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 6. Verify

1. Visit your Vercel URL
2. The error should be gone
3. Try signing in again

## Quick Checklist

- [ ] `VITE_SUPABASE_URL` added to Vercel
- [ ] `VITE_SUPABASE_ANON_KEY` added to Vercel (anon/public key)
- [ ] `SUPABASE_URL` added to Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to Vercel (service_role key, not anon)
- [ ] `ANTHROPIC_API_KEY` added to Vercel
- [ ] All variables enabled for Production, Preview, and Development
- [ ] Redeployed after adding variables

## Important Notes

1. **VITE_ prefix**: Variables starting with `VITE_` are used by the frontend build process
2. **Service Role Key**: This is different from the anon key - it's the secret key that bypasses Row Level Security. Get it from Supabase Dashboard → Settings → API → service_role key
3. **Redeploy Required**: You MUST redeploy after adding environment variables for them to take effect

## Troubleshooting

**Still seeing the error after redeploy?**
- Check that variable names are exactly correct (case-sensitive)
- Make sure you redeployed AFTER adding the variables
- Check Vercel build logs to see if variables are being read

**Variables not showing up?**
- Make sure you saved each variable
- Refresh the Vercel dashboard page
- Check that you're looking at the correct project

