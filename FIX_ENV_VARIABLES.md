# Fix: Missing Supabase Environment Variables Error

## The Problem

You're seeing: `Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY`

## Two Issues to Fix

### Issue 1: Wrong Key Type

You're currently using the **service_role** key in your `.env` file. The frontend MUST use the **anon/public** key.

**How to tell the difference:**
- **Service role key** (WRONG for frontend): Contains `"role":"service_role"` in the token
- **Anon/public key** (CORRECT for frontend): Contains `"role":"anon"` or `"role":"public"` in the token

**Where to get the correct key:**
1. Go to Supabase Dashboard
2. Click ⚙️ Settings → API
3. Under "Project API keys", find the row that says **"anon"** and **"public"**
4. Click the eye icon 👁️ to reveal it (if hidden)
5. Copy that key (NOT the service_role one)

### Issue 2: Dev Server Needs Restart

Vite only reads environment variables when it starts. If you created or changed the `.env` file after starting the dev server, you need to restart it.

## Steps to Fix

1. **Get the correct anon key** (see above)

2. **Update `frontend/.env`**:
   - Open `frontend/.env`
   - Replace `VITE_SUPABASE_ANON_KEY` with the **anon/public** key (not service_role)

3. **Stop the dev server**:
   - Press `Ctrl+C` in the terminal where it's running
   - Or kill it: `pkill -f vite`

4. **Restart the dev server**:
   ```bash
   npm run dev
   ```

5. **Refresh your browser** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)

## Quick Check

Your `.env` file should look like this:

```env
VITE_SUPABASE_URL=https://sjngcdxxtkvmjigoethp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (this should be the anon key, NOT service_role)
```

The anon key should be DIFFERENT from your service_role key.

## Security Note

- ✅ **Frontend (.env)**: Use **anon/public** key (safe to expose)
- ✅ **Backend (.env)**: Use **service_role** key (KEEP SECRET!)

Never use the service_role key in frontend code!

