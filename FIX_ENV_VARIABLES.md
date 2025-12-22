# Fix: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set

Your `.env` file has placeholder values. You need to replace them with your actual Supabase credentials.

## Step 1: Get Your Supabase Credentials

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Go to **Settings** (gear icon) → **API**
4. Copy these values:

   - **Project URL** → Use for `SUPABASE_URL`
     - Example: `https://abcdefghijklmnop.supabase.co`
   
   - **service_role key** (under "Project API keys") → Use for `SUPABASE_SERVICE_ROLE_KEY`
     - ⚠️ This is a long JWT token starting with `eyJ...`
     - ⚠️ Keep this secret! Never commit it to git.

## Step 2: Update backend/.env File

Edit `backend/.env` and replace the placeholders with your actual values:

```bash
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.your-actual-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
```

**Important:**
- Replace `https://your-actual-project-id.supabase.co` with your actual Supabase URL
- Replace the entire `SUPABASE_SERVICE_ROLE_KEY` value with your actual service_role key
- Replace `sk-ant-your-actual-anthropic-key-here` with your actual Anthropic API key

## Step 3: Restart Backend Server

After updating `.env`:

1. Stop the backend server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   cd backend
   npm run dev
   ```

The error should be gone!

## Quick Check: Verify Variables are Loaded

You can verify the variables are set by checking the terminal output when the server starts. You should see:
```
Server running on http://localhost:3000
API available at http://localhost:3000/api
```

No errors about missing environment variables.
