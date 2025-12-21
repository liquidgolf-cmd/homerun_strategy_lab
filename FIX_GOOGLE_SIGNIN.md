# Fix Google Sign-In Access Blocked

## Common Causes

### 1. Redirect URLs Not Configured Correctly

Google OAuth requires exact redirect URL matches. If the redirect URL doesn't match what's configured, sign-in will be blocked.

### 2. Supabase Redirect URL Configuration

**Step 1: Check Supabase Redirect URLs**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Check **"Redirect URLs"** section

**Add these redirect URLs:**

For development:
```
http://localhost:5173
http://localhost:5173/
```

For production (Vercel):
```
https://homerun-strategy-lab.vercel.app
https://homerun-strategy-lab.vercel.app/
```

Make sure to click **"Save"** after adding each URL.

### 3. Google Cloud Console OAuth Redirect URI

**Step 2: Update Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **"Authorized redirect URIs"**, make sure you have:

```
https://sjngcdxxtkvmjigoethp.supabase.co/auth/v1/callback
```

This is the Supabase callback URL. It should be:
- `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- Where `YOUR_PROJECT_ID` is your Supabase project ID (the part before `.supabase.co`)

6. Click **"Save"**

### 4. Verify Google OAuth is Enabled in Supabase

**Step 3: Check Supabase Provider Settings**

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** provider
3. Make sure it's **enabled** (toggle should be ON)
4. Verify:
   - Client ID is set (from Google Cloud Console)
   - Client Secret is set (from Google Cloud Console)
5. Click **"Save"** if you made any changes

### 5. Test the Configuration

**Step 4: Test Sign-In**

1. Clear your browser cache or use an incognito window
2. Go to your app: https://homerun-strategy-lab.vercel.app
3. Click "Sign in with Google"
4. You should be redirected to Google's sign-in page

### Troubleshooting Steps

#### If you see "redirect_uri_mismatch" error:

This means the redirect URI doesn't match. Check:
- ✅ Google Cloud Console has: `https://sjngcdxxtkvmjigoethp.supabase.co/auth/v1/callback`
- ✅ Supabase has your app URLs in Redirect URLs list

#### If you see "access_denied":

- Check that Google OAuth is enabled in Supabase
- Verify Client ID and Client Secret are correct
- Make sure the OAuth consent screen is published (not in testing mode with restricted users)

#### If sign-in redirects but then fails:

- Check Supabase logs: Dashboard → Logs → Authentication
- Verify the redirect URLs match exactly (including trailing slashes)
- Check browser console for specific error messages

### Quick Checklist

- [ ] Supabase Redirect URLs include your Vercel domain
- [ ] Google Cloud Console has Supabase callback URL: `https://sjngcdxxtkvmjigoethp.supabase.co/auth/v1/callback`
- [ ] Google OAuth is enabled in Supabase
- [ ] Client ID and Client Secret are set correctly in Supabase
- [ ] OAuth consent screen is configured in Google Cloud Console

### Common Mistakes

1. **Missing trailing slash**: `https://your-app.vercel.app` vs `https://your-app.vercel.app/` - add both
2. **Wrong callback URL**: Must be `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`, not your app URL
3. **Using wrong project ID**: Make sure you're using your Supabase project ID (from the URL)

### Need Your Supabase Project ID?

Your Supabase project ID is the part before `.supabase.co` in your project URL:
- Project URL: `https://sjngcdxxtkvmjigoethp.supabase.co`
- Project ID: `sjngcdxxtkvmjigoethp`

So your callback URL should be:
```
https://sjngcdxxtkvmjigoethp.supabase.co/auth/v1/callback
```

