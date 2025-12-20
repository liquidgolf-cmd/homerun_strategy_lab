# Deploy Everything to Cloud - Step by Step

Everything will run in the cloud - no local setup needed!

---

## Step 1: Set Your Anthropic API Key in Firebase

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase functions:secrets:set ANTHROPIC_API_KEY
```

When prompted, paste your actual Anthropic API key and press Enter.

---

## Step 2: Deploy Backend to Firebase Functions

```bash
firebase deploy --only functions
```

This takes 2-3 minutes. After it finishes, you'll see a URL like:
```
Function URL (api): https://us-central1-homerun-strategy-lab.cloudfunctions.net/api
```

**Copy this URL** - you'll need it for Step 4.

---

## Step 3: Make Sure Frontend is on Vercel

If you haven't connected Vercel yet:

1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import: `liquidgolf-cmd/homerun_strategy_lab`
5. Configure:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
6. Click **"Deploy"**

---

## Step 4: Set API URL in Vercel

In Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Firebase Functions URL from Step 2
     - Example: `https://us-central1-homerun-strategy-lab.cloudfunctions.net/api`
   - **Environments**: Check all (Production, Preview, Development)
3. Click **"Save"**
4. Go to **Deployments** tab and click **"Redeploy"** (or push to GitHub to auto-deploy)

---

## Step 5: Test!

Visit your Vercel URL and test the app. Everything should work!

---

## Done! 🎉

Now everything runs in the cloud:
- ✅ Backend: Firebase Functions
- ✅ Frontend: Vercel
- ✅ Database: Firestore (Firebase)

No more local setup needed!

---

## Quick Commands Reference

```bash
# Deploy backend
firebase deploy --only functions

# Check backend logs
firebase functions:log

# Update API key secret
firebase functions:secrets:set ANTHROPIC_API_KEY
```

