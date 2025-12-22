# Firebase Setup Complete! ✅

Your Firebase setup is now configured. Here's what we have:

## Configuration Files Created/Updated:

1. ✅ `.firebaserc` - Points to project: `homerun-strategy-lab`
2. ✅ `firebase.json` - Configured with:
   - Hosting: `frontend/dist`
   - Functions: `backend` (your existing backend folder)
   - Firestore: rules and indexes
3. ✅ `firestore.rules` - Basic security rules (allows all for development)
4. ✅ `firestore.indexes.json` - Firestore indexes configuration

## Next Steps:

### 1. Set Environment Variables for Deployment

Set your Anthropic API key in Firebase Functions:

```bash
firebase functions:config:set anthropic.api_key="your-api-key-here"
```

Or use the newer secrets method:
```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
```
(Then paste your API key when prompted)

### 2. Build Frontend

```bash
cd frontend
npm install
npm run build
```

### 3. Deploy

```bash
# Deploy everything
firebase deploy

# Or deploy individually:
firebase deploy --only hosting    # Frontend only
firebase deploy --only functions  # Backend only
firebase deploy --only firestore  # Rules only
```

## For Local Development:

### Option A: Use Firebase Emulators

1. Install Java (required for emulators):
   ```bash
   brew install openjdk
   ```

2. Start emulators:
   ```bash
   firebase emulators:start
   ```

3. In another terminal, set environment and start backend:
   ```bash
   cd backend
   export FIRESTORE_EMULATOR_HOST=localhost:8080
   export GCLOUD_PROJECT=homerun-strategy-lab
   npm run dev
   ```

4. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Option B: Use Real Firestore (Requires Service Account)

1. Download service account key from Firebase Console
2. Set: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm run dev`

## Test It:

After deploying, visit:
- Your Firebase Hosting URL: `https://homerun-strategy-lab.web.app` (or similar)
- API health check: `https://homerun-strategy-lab.web.app/api/health`

## Important Notes:

- Firestore rules are currently open (allows all). Update `firestore.rules` for production security.
- Your backend code is already set up to use Firestore
- The `backend/src/index.ts` file exports the Cloud Function named `api`
- Frontend is configured to use `/api/*` which maps to your Cloud Function

You're all set! 🎉



