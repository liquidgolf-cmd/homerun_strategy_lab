# Troubleshooting Google Sign-In Issues

## Common Errors and Fixes

### Error 1: "redirect_uri_mismatch" or Redirect URI Error

**Symptoms:**
- Google sign-in popup closes immediately
- Error in browser console about redirect URI
- "redirect_uri_mismatch" error message

**Fix:**

1. **Check Supabase Redirect URLs:**
   - Go to Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to **Authentication** → **URL Configuration**
   - In **"Redirect URLs"**, make sure you have:
     ```
     https://homerun-strategy-lab.vercel.app
     https://homerun-strategy-lab.vercel.app/
     http://localhost:5173
     http://localhost:5173/
     ```
   - Click **Save**

2. **Check Google Cloud Console:**
   - Go to Google Cloud Console: https://console.cloud.google.com
   - Select your project (or create one)
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID (or create one)
   - Click **Edit**
   - In **"Authorized redirect URIs"**, add:
     ```
     https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
     ```
     (Replace `YOUR_SUPABASE_PROJECT_ID` with your actual Supabase project ID)
   - Click **Save**

### Error 2: CSP (Content Security Policy) Error

**Symptoms:**
- Console shows: "Executing inline script violates Content Security Policy"
- Sign-in button doesn't work

**Note:** This error from browser extensions is usually harmless. If Google sign-in still works, ignore it.

**If sign-in doesn't work:**
- Check that Supabase URLs are correct in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Make sure you're using the correct Supabase project

### Error 3: "Invalid Client" or OAuth Client Not Found

**Symptoms:**
- Error message about invalid OAuth client
- Google sign-in fails immediately

**Fix:**

1. **Check Supabase OAuth Settings:**
   - Supabase Dashboard → Authentication → Providers
   - Find **Google** provider
   - Make sure it's **Enabled**
   - Check that **Client ID** and **Client Secret** are set
   - If not set, you need to configure them (see below)

2. **Set Up Google OAuth in Supabase:**
   - Go to Google Cloud Console
   - Create OAuth 2.0 Client ID (if not already created)
   - Copy **Client ID** and **Client Secret**
   - Go to Supabase → Authentication → Providers → Google
   - Paste **Client ID** and **Client Secret**
   - Enable the provider
   - Save

### Error 4: Sign-In Button Does Nothing

**Symptoms:**
- Clicking sign-in button has no effect
- No popup appears
- No error in console

**Fix:**

1. **Check Browser Console:**
   - Open browser console (F12)
   - Look for errors when clicking sign-in
   - Check Network tab for failed requests

2. **Check Environment Variables:**
   - Verify `VITE_SUPABASE_URL` is set correctly in Vercel
   - Verify `VITE_SUPABASE_ANON_KEY` is set correctly in Vercel
   - Make sure frontend is redeployed after changing env vars

3. **Check Supabase Project:**
   - Make sure your Supabase project is active
   - Check that Google provider is enabled

## Quick Diagnostic Steps

### Step 1: Check Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Your project → Settings → Environment Variables
3. Verify these are set:
   - `VITE_SUPABASE_URL` = `https://YOUR_PROJECT_ID.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### Step 2: Check Supabase Redirect URLs

1. Supabase Dashboard → Authentication → URL Configuration
2. Redirect URLs should include your Vercel URL:
   ```
   https://homerun-strategy-lab.vercel.app
   https://homerun-strategy-lab.vercel.app/
   ```

### Step 3: Check Google Cloud Console

1. Google Cloud Console → APIs & Services → Credentials
2. Your OAuth 2.0 Client ID → Authorized redirect URIs
3. Should include:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```

### Step 4: Test in Browser Console

Open browser console and check:
- Any errors when clicking sign-in?
- Network requests to Supabase?
- Any redirect issues?

## Most Common Issue: Missing Redirect URLs

**90% of Google sign-in issues are caused by missing redirect URLs.**

Make sure:
1. ✅ Supabase has your Vercel URL in Redirect URLs
2. ✅ Google Cloud Console has Supabase callback URL

## Still Not Working?

Share:
1. The exact error message from browser console
2. Screenshot of Supabase Redirect URLs configuration
3. What happens when you click the sign-in button (does popup appear? does it close immediately?)

