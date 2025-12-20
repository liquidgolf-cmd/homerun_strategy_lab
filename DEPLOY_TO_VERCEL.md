# Deploy to Vercel - Quick Guide

## Your Setup: Frontend on Vercel + Backend on Firebase Functions

Since you're using Firestore, the best approach is:
- **Frontend**: Deploy to Vercel (via GitHub)
- **Backend**: Deploy to Firebase Functions (we already set this up)
- **Database**: Firestore (already configured)

---

## Step 1: Deploy Backend to Firebase Functions

First, deploy your backend so it has a URL:

```bash
# Make sure you're in the project root
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"

# Deploy backend to Firebase Functions
firebase deploy --only functions
```

After deployment, you'll see a URL like:
```
https://us-central1-homerun-strategy-lab.cloudfunctions.net/api
```

**Save this URL** - you'll need it for Step 3.

---

## Step 2: Connect GitHub to Vercel

1. Go to **https://vercel.com**
2. Sign in with **GitHub** (use your GitHub account)
3. Click **"Add New..."** → **"Project"**
4. Find your repository: **liquidgolf-cmd/homerun_strategy_lab**
5. Click **"Import"**

---

## Step 3: Configure Vercel Project

Vercel should auto-detect your Vite setup. Here's what to set:

### Build Settings:
- **Framework Preset**: Vite (or "Other")
- **Root Directory**: `.` (leave as is)
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install && cd frontend && npm install`

### Environment Variables:

Click **"Environment Variables"** and add:

1. **VITE_API_URL**
   - Value: Your Firebase Functions URL from Step 1
   - Example: `https://us-central1-homerun-strategy-lab.cloudfunctions.net/api`
   - Environments: Production, Preview, Development (check all)

2. **ANTHROPIC_API_KEY** (optional - only if backend needs it)
   - Value: Your Anthropic API key
   - Note: This is already set in Firebase Functions, so might not be needed here

---

## Step 4: Deploy!

Click **"Deploy"** button.

Vercel will:
1. Install dependencies
2. Build your frontend
3. Deploy it

You'll get a URL like: `https://homerun-strategy-lab.vercel.app`

---

## Step 5: Test

Visit your Vercel URL and test the app!

---

## Auto-Deploy on Git Push

Once connected, Vercel will automatically deploy whenever you push to GitHub:

```bash
git push
```

That's it! Your app will auto-deploy.

---

## Troubleshooting

### API calls fail (CORS errors)
- Make sure Firebase Functions CORS is configured correctly
- Check that `VITE_API_URL` environment variable is set correctly

### Build fails
- Check Vercel build logs
- Make sure all dependencies are in `package.json`
- Verify Node version (should be 18.x)

### Firestore errors
- Backend needs Firestore credentials (handled by Firebase Functions)
- Make sure backend is deployed to Firebase Functions

---

## Summary

✅ **Backend**: Already on Firebase Functions (just deploy with `firebase deploy --only functions`)  
✅ **Frontend**: Deploy to Vercel (connect GitHub repo, configure, deploy)  
✅ **Database**: Firestore (already configured)

You're all set! 🚀

