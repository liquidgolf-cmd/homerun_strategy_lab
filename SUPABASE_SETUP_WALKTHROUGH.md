# Supabase Setup Walkthrough - Step by Step

This guide walks you through setting up Supabase for the Homeruns Strategy Lab application.

## Step 1: Create a Supabase Account and Project

1. **Go to Supabase**: Visit [https://supabase.com](https://supabase.com)

2. **Sign up or Log in**:
   - Click "Start your project" or "Sign in"
   - Sign up with GitHub (recommended) or email

3. **Create a New Project**:
   - Click "New Project" button
   - Fill in the details:
     - **Organization**: Select or create one
     - **Name**: `homeruns-strategy-lab` (or any name you prefer)
     - **Database Password**: Create a strong password (SAVE THIS - you'll need it)
     - **Region**: Choose the closest region to your users
     - **Pricing Plan**: Free tier is fine for development

4. **Wait for Project Creation**: This takes 1-2 minutes. Wait until you see "Project is ready"

---

## Step 2: Set Up Google OAuth Provider

### 2a. Create Google OAuth Credentials

1. **Go to Google Cloud Console**: [https://console.cloud.google.com](https://console.cloud.google.com)

2. **Create a New Project** (if you don't have one):
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it: `Homeruns Strategy Lab`
   - Click "Create"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable" (if not already enabled)

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in required fields:
       - App name: `Homeruns Strategy Lab`
       - User support email: Your email
       - Developer contact: Your email
     - Click "Save and Continue" through the steps
     - Go back to "Credentials" → "+ CREATE CREDENTIALS" → "OAuth client ID"

5. **Configure OAuth Client**:
   - Application type: `Web application`
   - Name: `Homeruns Strategy Lab Web`
   - Authorized redirect URIs: Click "ADD URI" and add:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
     (You'll get YOUR_PROJECT_ID from Supabase in the next step)
   - Click "Create"

6. **Copy Your Credentials**:
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)
   - **SAVE THESE** - you'll need them for Supabase

### 2b. Configure Google OAuth in Supabase

1. **Go back to Supabase Dashboard**: [https://app.supabase.com](https://app.supabase.com)

2. **Select Your Project**: Click on your project name

3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Providers" tab

4. **Enable Google Provider**:
   - Scroll down to find "Google"
   - Toggle it to "Enabled"

5. **Enter Google Credentials**:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
   - Click "Save"

6. **Add Redirect URLs** (if needed):
   - Go to "URL Configuration" section in Authentication settings
   - Add your redirect URLs:
     - Development: `http://localhost:5173`
     - Production: `https://your-vercel-app.vercel.app` (you'll add this after deployment)

---

## Step 3: Set Up the Database Schema

1. **Open SQL Editor in Supabase**:
   - In your Supabase project dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Copy the Schema**:
   - Open the file `supabase_schema.sql` from this repository
   - Copy ALL the contents (Ctrl+A, Ctrl+C / Cmd+A, Cmd+C)

3. **Paste and Run**:
   - Paste into the SQL Editor in Supabase
   - Click "Run" button (or press Ctrl+Enter / Cmd+Enter)

4. **Verify Tables Were Created**:
   - Click "Table Editor" in the left sidebar
   - You should see these tables:
     - `user_profiles`
     - `sessions`
     - `module_responses`
     - `final_documents`

---

## Step 4: Get Your Supabase Credentials

1. **Go to Project Settings**:
   - Click the gear icon ⚙️ in the left sidebar
   - Click "API" under "Project Settings"

2. **Copy Your Credentials**:

   **Project URL**:
   - Look for "Project URL"
   - It looks like: `https://xxxxx.supabase.co`
   - Click the copy icon to copy it

   **Anon/Public Key**:
   - Look for "Project API keys"
   - Find the row with "anon" and "public"
   - Click the "eye" icon to reveal it (or it's already visible)
   - It starts with `eyJ...`
   - Click the copy icon

   **Service Role Key** (IMPORTANT - KEEP THIS SECRET):
   - In the same "Project API keys" section
   - Find the row with "service_role" and "secret"
   - Click the "eye" icon to reveal it
   - It starts with `eyJ...`
   - Click the copy icon
   - **⚠️ WARNING: Never expose this key in client-side code!**

---

## Step 5: Set Up Environment Variables Locally

### Backend Environment Variables

1. **Create `.env` file in `backend/` directory**:
   ```bash
   cd backend
   cp .env.example .env
   # Or create it manually if .env.example doesn't exist
   ```

2. **Edit `backend/.env`** and add:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service_role key)
   ANTHROPIC_API_KEY=sk-ant-... (your Anthropic API key)
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
   ```

### Frontend Environment Variables

1. **Create `.env` file in `frontend/` directory**:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edit `frontend/.env`** and add:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ... (your anon/public key)
   ```

---

## Step 6: Test the Setup

1. **Install Dependencies** (if not already done):
   ```bash
   npm run install:all
   ```

2. **Start Development Servers**:
   ```bash
   npm run dev
   ```

3. **Open Your Browser**:
   - Go to `http://localhost:5173`

4. **Test Google OAuth**:
   - Click "Sign in with Google"
   - You should be redirected to Google
   - Sign in with your Google account
   - Grant permissions
   - You should be redirected back to the app

5. **Verify in Supabase**:
   - Go to Supabase Dashboard → Authentication → Users
   - You should see your user account listed

---

## Step 7: Set Up for Production (Vercel)

### Backend Deployment (Railway/Render/Similar)

1. **Set Environment Variables** in your backend hosting platform:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ANTHROPIC_API_KEY=sk-ant-...
   NODE_ENV=production
   ```

2. **Get Your Backend URL**: Something like `https://your-app.railway.app`

### Frontend Deployment (Vercel)

1. **Connect Your GitHub Repository** to Vercel

2. **Set Environment Variables** in Vercel:
   - Go to your project → Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJ...
     VITE_API_URL=https://your-backend-url.com/api
     ```

3. **Update Supabase Redirect URLs**:
   - Go back to Supabase → Authentication → URL Configuration
   - Add your Vercel URL to the redirect URLs list
   - Also update Google Cloud Console OAuth redirect URIs with:
     ```
     https://your-vercel-app.vercel.app
     ```

---

## Troubleshooting

### "Invalid redirect URI" Error
- Make sure the redirect URI in Google Cloud Console matches exactly:
  - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- Check that Google OAuth is enabled in Supabase

### "Missing Supabase environment variables"
- Verify `.env` files exist in both `backend/` and `frontend/` directories
- Check that variable names are exactly correct (case-sensitive)
- Restart your dev servers after changing `.env` files

### "Invalid or expired token"
- Make sure you're using the correct keys:
  - Frontend uses `anon/public` key
  - Backend uses `service_role` key
- Never mix them up!

### Database errors
- Verify you ran the SQL schema in SQL Editor
- Check Table Editor to see if tables exist
- Make sure RLS policies are set (the schema should have created them)

---

## Quick Reference Checklist

- [ ] Supabase project created
- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Google OAuth enabled in Supabase with credentials
- [ ] Database schema executed in SQL Editor
- [ ] Tables verified in Table Editor
- [ ] Project URL copied
- [ ] Anon/public key copied
- [ ] Service role key copied (and kept secret!)
- [ ] Backend `.env` file created with all variables
- [ ] Frontend `.env` file created with all variables
- [ ] Tested Google OAuth sign-in locally
- [ ] User appears in Supabase Authentication → Users
- [ ] Environment variables set in Vercel (for production)
- [ ] Redirect URLs updated for production

---

## Need Help?

If you run into issues:
1. Check the Supabase logs: Dashboard → Logs
2. Check browser console for frontend errors
3. Check backend server logs for API errors
4. Verify all environment variables are set correctly

