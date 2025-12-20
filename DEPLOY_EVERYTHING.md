# Deploy Everything to the Cloud

Since you want everything off your machine, here's how to deploy both frontend and backend:

## Backend → Firebase Functions
## Frontend → Vercel
## Database → Firestore (already in Firebase)

---

## Step 1: Set Environment Variables in Firebase Functions

Your backend needs the Anthropic API key. Set it:

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase functions:config:set anthropic.api_key="your-anthropic-api-key-here"
```

Or use the newer secrets method (recommended):
```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
```
Then paste your API key when prompted.

---

## Step 2: Deploy Backend to Firebase Functions

```bash
firebase deploy --only functions
```

This will take 2-3 minutes. You'll get a URL like:
`https://us-central1-homerun-strategy-lab.cloudfunctions.net/api`

**Save this URL** - you'll need it for Step 4.

---

## Step 3: Make Sure Frontend is Deployed to Vercel

If you haven't deployed to Vercel yet:
1. Go to https://vercel.com
2. Import your GitHub repo: `liquidgolf-cmd/homerun_strategy_lab`
3. Configure:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`

---

## Step 4: Set Vercel Environment Variable

In Vercel dashboard → Your Project → Settings → Environment Variables:

Add:
- **Name**: `VITE_API_URL`
- **Value**: Your Firebase Functions URL from Step 2
  - Example: `https://us-central1-homerun-strategy-lab.cloudfunctions.net/api`
- **Environments**: Check Production, Preview, Development

Then redeploy the frontend (or it will auto-deploy on next git push).

---

## Step 5: Test Everything

Visit your Vercel URL and test the app. Everything should work in the cloud!

---

## That's It!

Now you don't need to run anything locally:
- ✅ Backend runs on Firebase Functions
- ✅ Frontend runs on Vercel  
- ✅ Database is Firestore (in Firebase)
- ✅ Everything is in the cloud!

