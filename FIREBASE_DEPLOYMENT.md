# Firebase Deployment Guide

## ✅ Migration Complete!

All database operations have been migrated from SQLite to Firestore. The application is now ready for Firebase deployment.

## Quick Start

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Firestore Database** (Native mode)
4. Note your project ID

### 3. Update Project Configuration
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 4. Initialize Firebase (if not done)
```bash
firebase init
```
- Select: **Hosting** and **Functions**
- Use existing `firebase.json` and `.firebaserc`
- Language: **TypeScript**
- Install dependencies: **Yes**

### 5. Set Environment Variables

#### Option A: Firebase Functions Config (Recommended)
```bash
firebase functions:config:set anthropic.api_key="your-anthropic-api-key"
```

#### Option B: Environment Variables (for local testing)
Create `backend/.env`:
```
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 6. Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 7. Deploy
```bash
# Deploy everything (hosting + functions)
firebase deploy

# Or deploy separately
firebase deploy --only hosting
firebase deploy --only functions
```

## Firestore Security Rules

Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for now (restrict in production)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important**: Update these rules for production to restrict access appropriately.

## Firestore Indexes

Firestore may require composite indexes. If you see errors about missing indexes:

1. Check Firebase Console → Firestore → Indexes
2. Create any missing composite indexes
3. Or update queries to avoid multiple `orderBy` clauses

## Testing

1. **Frontend**: `https://your-project.firebaseapp.com`
2. **API Health**: `https://your-project.firebaseapp.com/api/health`
3. **Functions Logs**: `firebase functions:log`

## Local Development

### Run Firebase Emulators
```bash
firebase emulators:start
```

This runs:
- Firestore emulator
- Functions emulator
- Hosting emulator

### Local Testing
1. Start emulators: `firebase emulators:start`
2. Frontend will connect to emulators automatically
3. Set `ANTHROPIC_API_KEY` in `backend/.env`

## Troubleshooting

### Functions Not Deploying
- Check `backend/package.json` has correct dependencies
- Verify TypeScript compiles: `cd backend && npm run build`
- Check Firebase CLI is logged in: `firebase login`

### Database Errors
- Make sure Firestore is enabled in Firebase Console
- Check Firestore rules allow read/write
- Verify database initialization code runs

### CORS Errors
- Cloud Functions CORS is configured to allow all origins
- Firebase Hosting and Functions are on same domain, so should work

### API Key Issues
- Verify API key is set: `firebase functions:config:get`
- For local: check `backend/.env` file exists

## Cost Considerations

- **Firebase Hosting**: Free tier available
- **Cloud Functions**: Pay per invocation (generous free tier)
- **Firestore**: Free tier available, pay for reads/writes

## What Changed

### Database
- ✅ SQLite → Firestore
- ✅ All queries converted to Firestore operations
- ✅ All route handlers made async

### Dependencies
- ✅ Removed: `better-sqlite3`, `@types/better-sqlite3`
- ✅ Added: `firebase-admin`, `firebase-functions`

### Files Updated
- ✅ `backend/src/db/schema.ts` → `backend/src/db/firestore.ts`
- ✅ `backend/src/routes/modules.ts` (all handlers async)
- ✅ `backend/src/routes/documents.ts` (all handlers async)
- ✅ `backend/src/services/anthropicService.ts` (Firebase config support)
- ✅ `backend/src/index.ts` (Cloud Functions entry point)
- ✅ `backend/package.json` (dependencies updated)

## Next Steps

1. ✅ Migration complete
2. ⏭️ Create Firebase project
3. ⏭️ Set environment variables
4. ⏭️ Deploy to Firebase
5. ⏭️ Test deployed application

