# Firebase Deployment Setup

## Overview

This setup deploys:
- **Frontend**: Firebase Hosting (static files)
- **Backend**: Cloud Functions (serverless API)
- **Database**: Firestore (NoSQL database - replaces SQLite)

## Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Create Firebase Project:
   - Go to https://console.firebase.google.com
   - Create a new project
   - Enable Firestore Database
   - Get your project ID

## Step 1: Initialize Firebase

1. Run in project root:
   ```bash
   firebase init
   ```

2. Select:
   - ✅ Hosting
   - ✅ Functions
   - Select your Firebase project
   - Use existing `firebase.json` and `.firebaserc` (we created them)

3. When asked about Functions:
   - Language: TypeScript
   - ESLint: Yes (optional)
   - Install dependencies: Yes

## Step 2: Convert Database to Firestore

**Important**: SQLite cannot be used with Cloud Functions. You need to convert to Firestore.

### Update backend/src/db/schema.ts

Replace SQLite with Firestore:

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Collections will be created automatically on first use
export const usersCollection = db.collection('users');
export const sessionsCollection = db.collection('sessions');
export const moduleResponsesCollection = db.collection('moduleResponses');
export const finalDocumentsCollection = db.collection('finalDocuments');

export default db;
```

### Update Backend Code

Replace all `better-sqlite3` queries with Firestore operations:

**Before (SQLite)**:
```typescript
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
```

**After (Firestore)**:
```typescript
const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
const user = userSnapshot.empty ? null : { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
```

## Step 3: Update Dependencies

Update `backend/package.json`:

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.3",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.1",
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.5.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.3"
  }
}
```

Remove `better-sqlite3` and `@types/better-sqlite3`.

## Step 4: Set Environment Variables

1. Set secrets in Firebase:
   ```bash
   firebase functions:secrets:set ANTHROPIC_API_KEY
   ```
   (Enter your API key when prompted)

2. Or use environment config:
   ```bash
   firebase functions:config:set anthropic.api_key="your_key_here"
   ```

## Step 5: Build Frontend

```bash
cd frontend
npm install
npm run build
```

## Step 6: Deploy

```bash
# Deploy everything
firebase deploy

# Or deploy separately
firebase deploy --only hosting
firebase deploy --only functions
```

## Step 7: Update Frontend API URL

Since Cloud Functions are at `/api/*`, the frontend should already work with relative paths.

However, if you need to customize:
- Update `frontend/src/services/api.ts` to use `/api` (which maps to Cloud Function)

## Important Notes

### Database Migration Required

⚠️ **You MUST convert from SQLite to Firestore**. Cloud Functions are serverless and cannot use SQLite.

Key differences:
- Firestore is NoSQL (collections/documents)
- SQLite is SQL (tables/rows)
- All database queries need to be rewritten
- All `db.prepare()` calls need to become Firestore queries

### Migration Steps

1. Update `backend/src/db/schema.ts` to use Firestore
2. Update all route files to use Firestore instead of SQLite:
   - `backend/src/routes/modules.ts`
   - `backend/src/routes/documents.ts`
3. Change all database operations from synchronous (SQLite) to asynchronous (Firestore)
4. Update all route handlers to be `async`

### Alternative: Use Cloud SQL

If you prefer SQL:
- Use Cloud SQL (PostgreSQL or MySQL) instead of Firestore
- Requires additional setup and costs
- More similar to SQLite structure

## Testing

1. Frontend: `https://your-project.firebaseapp.com`
2. API: `https://your-project.firebaseapp.com/api/health`
3. Cloud Functions logs: `firebase functions:log`

## Troubleshooting

### Functions Not Deploying
- Check `backend/package.json` has correct dependencies
- Verify TypeScript compiles: `cd backend && npm run build`
- Check Firebase CLI is logged in: `firebase login`

### Database Errors
- Make sure Firestore is enabled in Firebase Console
- Check Firestore rules allow read/write (for testing, use permissive rules)
- Verify database initialization code runs

### CORS Errors
- Cloud Functions CORS is configured to allow all origins
- Firebase Hosting and Functions are on same domain, so should work

## Cost Considerations

- Firebase Hosting: Free tier available
- Cloud Functions: Pay per invocation (generous free tier)
- Firestore: Free tier available, pay for reads/writes



