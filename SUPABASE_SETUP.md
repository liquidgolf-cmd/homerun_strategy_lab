# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Sign in
3. Click **"New Project"**
4. Fill in:
   - **Name**: homerun-strategy-lab (or whatever you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (click "Reveal" to see it)

**IMPORTANT**: Save the **service_role** key (not the anon key) - you'll need it for backend.

## Step 3: Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase_schema.sql`
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

This creates all the tables, indexes, and policies you need.

## Step 4: Set Environment Variables

For **Firebase Functions** deployment, set these as secrets:

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase functions:secrets:set SUPABASE_URL
# Paste your Project URL when prompted

firebase functions:secrets:set SUPABASE_SERVICE_ROLE_KEY
# Paste your service_role key when prompted
```

For **local development**, create `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ANTHROPIC_API_KEY=your-anthropic-key
```

## Step 5: Update Backend Code

I've already created `backend/src/db/supabase.ts` with all the helper functions. The routes are updated to use Supabase.

## Step 6: Deploy Backend

```bash
firebase deploy --only functions
```

## That's It!

Your app now uses Supabase PostgreSQL instead of Firestore!

---

## Verify It Works

1. Deploy backend: `firebase deploy --only functions`
2. Test the API endpoint
3. Check Supabase Dashboard → **Table Editor** to see your data

---

## Benefits of Supabase

- ✅ SQL database (easier queries, better for relational data)
- ✅ Built-in API (you can use it directly from frontend if needed)
- ✅ Real-time subscriptions (if you want to add real-time features later)
- ✅ Better tooling for data management
- ✅ Free tier available



