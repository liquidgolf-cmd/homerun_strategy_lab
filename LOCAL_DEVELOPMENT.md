# Local Development Setup

## Option 1: Using Firebase Emulators (Recommended)

Firebase emulators allow you to test locally with Firestore without connecting to the real database.

### 1. Install Firebase Tools
```bash
npm install -g firebase-tools
firebase login
```

### 2. Start Firebase Emulators
```bash
firebase emulators:start --only firestore
```

This will start Firestore emulator on port 8080 (default).

### 3. Set Environment Variables
```bash
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=demo-project
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

The backend will automatically use the Firestore emulator.

### 5. Start Frontend
```bash
cd frontend
npm run dev
```

## Option 2: Direct Firestore (Requires Firebase Project)

If you have a Firebase project set up and want to use the real Firestore:

### 1. Get Firebase Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file

### 2. Set Environment Variable
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
export GCLOUD_PROJECT=your-project-id
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

## Quick Start (Using Emulators)

```bash
# Terminal 1: Start Firestore emulator
firebase emulators:start --only firestore

# Terminal 2: Start backend (in backend directory)
cd backend
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=demo-project
npm run dev

# Terminal 3: Start frontend (in frontend directory)
cd frontend
npm run dev
```

Then visit: http://localhost:5173

## Troubleshooting

### "Failed to load resource: 404" Error
- Make sure backend server is running on port 3000
- Check that `/api/modules/session` endpoint exists
- Verify CORS is configured correctly

### Firestore Connection Errors
- If using emulator: Make sure `FIRESTORE_EMULATOR_HOST` is set
- If using real Firestore: Check `GOOGLE_APPLICATION_CREDENTIALS` is set
- Verify Firebase Admin is initialized correctly

### Port Already in Use
- Backend defaults to port 3000
- Frontend defaults to port 5173 (Vite)
- Change ports if needed: `PORT=3001 npm run dev`



