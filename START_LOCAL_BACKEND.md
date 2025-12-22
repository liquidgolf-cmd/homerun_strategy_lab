# Starting Backend for Local Development

The backend needs Firestore to work. You have two options:

## Option 1: Use Firebase Emulator (Recommended)

### Step 1: Start Firebase Emulator

In Terminal 1:
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase emulators:start --only firestore
```

Wait until you see: `✔  All emulators ready!`

### Step 2: Start Backend

In Terminal 2 (new terminal window):
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/backend"
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=homerun-strategy-lab
npm run dev
```

You should see: `Server running on http://localhost:3000`

### Step 3: Frontend should now work!

Your frontend (running on port 3002) should now be able to connect to the backend.

---

## Option 2: Use Real Firestore (Requires Setup)

1. Get service account key from Firebase Console
2. Set: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`
3. Start backend: `cd backend && npm run dev`

---

## Quick Start (Recommended)

Just run these two commands in separate terminals:

**Terminal 1:**
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab" && firebase emulators:start --only firestore
```

**Terminal 2:**
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/backend" && FIRESTORE_EMULATOR_HOST=localhost:8080 GCLOUD_PROJECT=homerun-strategy-lab npm run dev
```



