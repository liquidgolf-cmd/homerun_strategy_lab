# Vercel Environment Variables Check

## If you're seeing a 500 error on `/api/modules/session`

This is likely because environment variables are not set in Vercel. 

### Required Environment Variables in Vercel

Go to your Vercel project → **Settings → Environment Variables** and add:

#### For Serverless Functions (API):
- `SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (from Supabase Dashboard → Settings → API)
- `ANTHROPIC_API_KEY` - Your Anthropic API key

#### For Frontend Build:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Important Notes:

1. **Set for all environments**: Make sure to enable these variables for **Production**, **Preview**, and **Development** environments.

2. **After adding variables**: You need to **redeploy** for the changes to take effect. The variables are only available at build/runtime time, not retroactively.

3. **To redeploy**: 
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click the three dots on the latest deployment
   - Select "Redeploy"

### How to Verify:

1. Check Vercel Function Logs:
   - Go to your project → Functions tab
   - Click on a function to see logs
   - Look for error messages about missing environment variables

2. Test locally with `vercel dev`:
   - Create `.env.local` in root with your variables
   - Run `vercel dev`
   - Test the API endpoints

### Enable Email/Password Auth in Supabase

Since we added email/password authentication, make sure it's enabled in Supabase:

1. Go to Supabase Dashboard → Authentication → Providers
2. Make sure **Email** provider is enabled (it's enabled by default)
3. Configure email settings if needed (Email Templates, SMTP, etc.)

### Email Confirmation

By default, Supabase requires email confirmation for new sign-ups. You can:

1. **Disable email confirmation** (for development):
   - Go to Authentication → Settings
   - Disable "Enable email confirmations"

2. **Or configure email** (for production):
   - Set up SMTP in Authentication → Settings
   - Or use Supabase's built-in email service


