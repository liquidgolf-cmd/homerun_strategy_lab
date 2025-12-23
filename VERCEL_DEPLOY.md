# Deploy to Vercel via GitHub

## Current Setup Note

Your app uses **Firestore** for the database, which will work with Vercel. You have two deployment options:

### Option 1: Frontend on Vercel + Backend on Vercel Functions (Recommended)

This keeps everything together and works with Firestore.

### Option 2: Frontend on Vercel + Backend on Firebase Functions

This splits the deployment but uses Firebase Functions we already set up.

---

## Option 1: Full Stack on Vercel (Recommended)

### Step 1: Create vercel.json Configuration

The `vercel.json` already exists. We'll update it for your setup.

### Step 2: Push to GitHub

Your code is already on GitHub at: `liquidgolf-cmd/homerun_strategy_lab`

### Step 3: Connect GitHub to Vercel

1. Go to https://vercel.com
2. Sign up/Login (use GitHub to sign in)
3. Click **"Add New Project"**
4. Import your repository: `liquidgolf-cmd/homerun_strategy_lab`
5. Vercel will detect it's a project with a frontend

### Step 4: Configure Vercel Settings

**Root Directory**: Leave as `.` (root)

**Build Settings:**
- Framework Preset: Vite
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install && cd frontend && npm install && cd ../backend && npm install`

**Environment Variables:**
Add these in Vercel dashboard:
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `GCLOUD_PROJECT` - `homerun-strategy-lab`
- `GOOGLE_APPLICATION_CREDENTIALS` - Service account key JSON (or use Firebase Admin with default credentials)

**Functions:**
- Functions Directory: `backend/src` (or we can set up API routes)

### Step 5: Deploy

Click **"Deploy"** - Vercel will build and deploy your app!

---

## Important: Firestore Setup for Vercel

Since you're using Firestore, you need to:

1. **Get Firebase Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Add to Vercel as Environment Variable:**
   - In Vercel project settings → Environment Variables
   - Add: `GOOGLE_APPLICATION_CREDENTIALS` 
   - Value: Paste the entire JSON content (or store as secret)

   OR use Firebase Admin default credentials (simpler):
   - Just set `GCLOUD_PROJECT=homerun-strategy-lab`
   - Vercel can use Firebase Admin with default credentials if configured

---

## Option 2: Frontend on Vercel, Backend on Firebase Functions

Keep backend on Firebase Functions (we already set it up), deploy only frontend to Vercel.

### Steps:

1. Update frontend API URL to point to Firebase Functions
2. Deploy backend to Firebase: `firebase deploy --only functions`
3. Deploy frontend to Vercel (same as above, but simpler)

---

## Quick Deploy Steps

1. **Push latest code to GitHub** (already done)
2. **Go to vercel.com and sign in with GitHub**
3. **Import repository**: `liquidgolf-cmd/homerun_strategy_lab`
4. **Configure environment variables** (API keys, Firebase config)
5. **Deploy!**

Let me know which option you prefer and I'll help you set it up!




