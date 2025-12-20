# Step-by-Step: Deploy to Vercel via GitHub

## Pre-requisites

✅ Your code is already on GitHub: `liquidgolf-cmd/homerun_strategy_lab`  
✅ Vercel account (free tier works great)

## Step 1: Get Your Firebase Service Account Key

1. Go to https://console.firebase.google.com
2. Select your project: **homerun-strategy-lab**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate new private key"**
6. Click **"Generate key"** in the dialog
7. A JSON file will download - **save this somewhere safe!**

## Step 2: Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

## Step 3: Import Your GitHub Repository

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find: **liquidgolf-cmd/homerun_strategy_lab**
4. Click **"Import"**

## Step 4: Configure Project Settings

Vercel should auto-detect some settings. Here's what to check:

### Root Directory
- Leave as **"."** (root of repository)

### Framework Preset
- Select: **Vite** (or Other)

### Build and Output Settings

**Build Command:**
```bash
cd frontend && npm run build
```

**Output Directory:**
```bash
frontend/dist
```

**Install Command:**
```bash
npm install && cd frontend && npm install
```

## Step 5: Add Environment Variables

Click **"Environment Variables"** and add these:

### Required Variables:

1. **ANTHROPIC_API_KEY**
   - Value: Your Anthropic API key
   - Environment: Production, Preview, Development (check all)

2. **GCLOUD_PROJECT**
   - Value: `homerun-strategy-lab`
   - Environment: Production, Preview, Development (check all)

3. **GOOGLE_APPLICATION_CREDENTIALS**
   - Value: Paste the **entire contents** of the Firebase service account JSON file you downloaded
   - Environment: Production, Preview, Development (check all)
   - ⚠️ **Important**: This is sensitive data, mark it as "Secret" if option is available

   OR if you prefer, you can create a single environment variable with the JSON:

4. **FIREBASE_SERVICE_ACCOUNT** (Alternative)
   - Value: The entire JSON content from service account file
   - Then update backend code to read from this env var instead

## Step 6: Configure Functions (For Backend API)

Since your backend uses Express, you have two options:

### Option A: Use Vercel Serverless Functions

Create API routes in `api/` folder that Vercel will automatically deploy as serverless functions.

### Option B: Keep Backend Separate on Firebase Functions

Deploy backend to Firebase separately, and have frontend call Firebase Functions URL.

For now, let's use **Option B** (simpler) since we already have Firebase set up.

## Step 7: Update Frontend to Use Firebase Functions URL

If deploying frontend only to Vercel, update the API base URL:

1. Get your Firebase Functions URL:
   ```bash
   firebase deploy --only functions
   ```
   It will show you the URL like: `https://us-central1-homerun-strategy-lab.cloudfunctions.net/api`

2. Update `frontend/src/services/api.ts` to use this URL in production.

## Step 8: Deploy!

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Vercel will give you a URL like: `https://homerun-strategy-lab.vercel.app`

## Step 9: Test Your Deployment

Visit your Vercel URL and test the app!

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure all environment variables are set
- Verify Node version is 18.x

### API Calls Fail
- Check that Firebase Functions are deployed
- Verify API URL is correct in frontend
- Check CORS settings in backend

### Firestore Connection Errors
- Verify `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
- Check that service account JSON is valid
- Verify `GCLOUD_PROJECT` matches your Firebase project

---

## Quick Command Reference

```bash
# Deploy backend to Firebase Functions
firebase deploy --only functions

# Deploy frontend to Vercel (via GitHub push, or Vercel CLI)
vercel

# Or just push to GitHub - Vercel will auto-deploy if connected
git push
```

