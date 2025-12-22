# Debugging 500 Error on /api/modules/session

## Quick Check

1. **Test the health endpoint first:**
   ```
   https://your-app.vercel.app/api/health
   ```
   
   This will tell you if environment variables are set correctly.

2. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions tab
   - Click on `api/modules/session.ts`
   - Look at the logs to see the actual error message

## Common Causes

### 1. Missing Environment Variables (Most Likely)

The error is probably because environment variables aren't set in Vercel.

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
3. Make sure they're enabled for **Production**, **Preview**, and **Development**
4. **Redeploy** after adding variables

### 2. Wrong Environment Variable Names

Make sure the names match exactly:
- `SUPABASE_URL` (not `SUPABASE_URL_URL`)
- `SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_KEY`)
- `ANTHROPIC_API_KEY` (not `ANTHROPIC_KEY`)

### 3. Database Schema Not Run

If environment variables are set but you still get errors, make sure you've run the database schema:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste `supabase/schema-mvp.sql`
3. Execute the SQL

### 4. Check Vercel Logs for Specific Error

The improved error handling should now show you the exact error in the Vercel logs. Check:
- Vercel Dashboard → Your Project → Functions → `api/modules/session.ts` → Logs

## Testing Locally

To test if your environment variables work:

1. Create `.env.local` in the root directory:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ANTHROPIC_API_KEY=your_anthropic_key
   ```

2. Run:
   ```bash
   vercel dev
   ```

3. Test:
   - http://localhost:3000/api/health (should show status: ok)
   - http://localhost:3000/api/modules/session (after signing in)

## Next Steps

After fixing environment variables:
1. Redeploy in Vercel
2. Test `/api/health` endpoint
3. Try signing in again
4. Check logs if errors persist

