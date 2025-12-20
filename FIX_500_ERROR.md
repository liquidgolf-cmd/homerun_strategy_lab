# Fix 500 Internal Server Error

## The Problem

The backend is returning a 500 error when trying to create a session. This is likely because Firestore isn't properly initialized.

## For Local Development

You need Firestore to be available. You have two options:

### Option 1: Use Firebase Emulator (Recommended)

**Terminal 1 - Start Emulator:**
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase emulators:start --only firestore
```

**Terminal 2 - Start Backend with Environment Variables:**
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/backend"
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=homerun-strategy-lab
npm run dev
```

### Option 2: Use Real Firestore

1. Get service account key from Firebase Console
2. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   export GCLOUD_PROJECT=homerun-strategy-lab
   ```
3. Start backend: `npm run dev`

## Check Backend Logs

Look at the terminal where your backend is running. You should see error messages that tell you exactly what's wrong. Common issues:

- "Failed to initialize Firebase Admin" - Need emulator or credentials
- "Firestore connection failed" - Firestore not available
- Other errors will show what's failing

## Quick Fix

The fastest way is to start the Firebase emulator, then restart your backend with the environment variables set.
