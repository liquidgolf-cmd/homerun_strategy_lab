# Supabase Auth Setup Guide

## Quick Setup Checklist

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (takes ~2 minutes)

### 2. Enable Google OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to enable it
3. You'll need:
   - **Google Client ID**: Create at [Google Cloud Console](https://console.cloud.google.com)
   - **Google Client Secret**: From the same Google Cloud Console project
   - **Redirect URLs**: 
     - Development: `http://localhost:5173`
     - Production: `https://your-vercel-app.vercel.app`
4. Save the configuration

### 3. Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open `supabase_schema.sql` from the repository
3. Copy and paste the entire SQL script
4. Click **Run** to execute

This creates:
- `user_profiles` table (linked to `auth.users`)
- `sessions` table
- `module_responses` table
- `final_documents` table
- All necessary indexes and RLS policies

### 4. Get Your Credentials

In Supabase dashboard, go to **Settings** → **API**:

- **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
- **anon public key**: Copy this (starts with `eyJ...`)
- **service_role key**: Copy this (starts with `eyJ...`) - **KEEP THIS SECRET!**

### 5. Environment Variables

**Backend** (`backend/.env`):
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service_role key)
ANTHROPIC_API_KEY=sk-ant-...
PORT=3000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (anon public key)
```

### 6. Test Locally

1. Install dependencies: `npm run install:all`
2. Start dev servers: `npm run dev`
3. Open http://localhost:5173
4. Click "Sign in with Google"
5. Complete OAuth flow
6. You should be redirected back and see your dashboard

### 7. Deploy to Vercel

1. Push code to GitHub (already done ✓)
2. Import project in Vercel
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend API URL)
4. Update Supabase Google OAuth redirect URL to include your Vercel domain
5. Deploy!

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` files are created in both `backend/` and `frontend/` directories
- Check that variable names match exactly (case-sensitive)
- Restart dev servers after changing `.env` files

### "Invalid or expired token"
- Check that `VITE_SUPABASE_ANON_KEY` is the **anon public** key, not service_role
- Make sure backend is using `SUPABASE_SERVICE_ROLE_KEY` for admin operations

### Google OAuth not working
- Verify redirect URLs in both Google Cloud Console and Supabase
- Check that Google OAuth provider is enabled in Supabase
- Ensure Google Client ID and Secret are correct

### Database errors
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that tables exist in Supabase dashboard (Table Editor)
- Verify RLS policies are set (should allow all for now)

## Next Steps

After setup is complete:
1. Test the full flow: Sign in → Complete Module 0 → Generate audit review
2. Verify data is saving in Supabase (Table Editor)
3. Deploy backend to Railway/Render with environment variables
4. Update frontend `VITE_API_URL` in Vercel to point to backend

