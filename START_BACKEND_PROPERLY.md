# How to Start Backend Properly

The 500 error is happening because your backend needs Firestore to work. Here's how to start it correctly:

## Step 1: Start Firebase Emulator

**Open Terminal 1** and run:
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase emulators:start --only firestore
```

Wait until you see: `✔  All emulators ready!`

## Step 2: Start Backend with Environment Variables

**Open Terminal 2** (new terminal window) and run:
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/backend"
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=homerun-strategy-lab
npm run dev
```

You should see:
- `Firebase Admin initialized with emulator: localhost:8080`
- `Server running on http://localhost:3000`

## Step 3: Start Frontend

**Open Terminal 3** and run:
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/frontend"
npm run dev
```

## Step 4: Test

Go to: `http://localhost:5173` (or whatever port Vite shows)

The 500 error should be gone!

## What Was Wrong?

Your backend was trying to use Firestore but:
1. Firebase emulator wasn't running, OR
2. Environment variables weren't set

Now with the emulator running and env vars set, Firestore will work locally.




