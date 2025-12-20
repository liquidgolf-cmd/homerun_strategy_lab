# Supabase Migration - Quick Start

## ✅ Code Migration Complete!

I've migrated your backend from Firestore to Supabase. Here's what you need to do:

---

## Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Sign up / Sign in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `homerun-strategy-lab`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

---

## Step 2: Get Your Credentials

1. In Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (like `https://xxxxx.supabase.co`)
   - **service_role** key (click "Reveal" to see it - **NOT** the anon key)

---

## Step 3: Create Database Tables

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open the file `supabase_schema.sql` from this project
4. Copy the **entire contents** and paste into SQL Editor
5. Click **"Run"** (or Cmd/Ctrl + Enter)
6. You should see: "Success. No rows returned"

---

## Step 4: Set Environment Variables

For **Firebase Functions** (production):

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase functions:secrets:set SUPABASE_URL
# Paste your Project URL when prompted

firebase functions:secrets:set SUPABASE_SERVICE_ROLE_KEY
# Paste your service_role key when prompted
```

For **local development** (optional - create `backend/.env`):

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
```

---

## Step 5: Deploy Backend

```bash
firebase deploy --only functions
```

---

## That's It! 🎉

Your app now uses Supabase PostgreSQL instead of Firestore!

---

## What Changed

✅ Database: Firestore → Supabase (PostgreSQL)  
✅ All database operations converted to use Supabase client  
✅ All routes updated to use Supabase  
✅ Code is ready to deploy!

---

## Verify It Works

1. Check Supabase Dashboard → **Table Editor** - you should see your tables
2. Deploy backend: `firebase deploy --only functions`
3. Test your API endpoints
4. Data will appear in Supabase tables as users create sessions

---

## Next Steps

Once deployed, your app will:
- Store users in Supabase `users` table
- Store sessions in `sessions` table
- Store module responses in `module_responses` table
- Store final documents in `final_documents` table

Everything runs in the cloud - no local setup needed!

