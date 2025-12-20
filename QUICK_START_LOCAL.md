# Quick Start for Local Development

## The Setup (You Need 3 Things Running)

### 1. Firebase Emulator (Terminal 1)
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase emulators:start --only firestore
```

### 2. Backend Server (Terminal 2)
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/backend"
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=homerun-strategy-lab
npm run dev
```

### 3. Frontend Dev Server (Terminal 3)
```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab/frontend"
npm run dev
```

## What Ports to Use

- **Frontend**: http://localhost:5173 (Vite dev server) ← **Use this URL in your browser!**
- **Backend API**: http://localhost:3000/api
- **Firestore Emulator**: localhost:8080

## Important:

**Don't access `http://localhost:3000` directly** - that's just the backend API server. 

**Access `http://localhost:5173`** - that's your frontend app.

The frontend will automatically proxy API calls to `/api/*` which will go to the backend.

## CSP Errors?

If you see Content Security Policy errors, they're likely from a browser extension. You can ignore them or disable the extension temporarily.

## Common Issues:

1. **500 Error**: Backend needs Firestore (start emulator)
2. **404 Error**: Frontend dev server not running (start with `npm run dev` in frontend folder)
3. **CSP Errors**: Usually from browser extensions, can be ignored

