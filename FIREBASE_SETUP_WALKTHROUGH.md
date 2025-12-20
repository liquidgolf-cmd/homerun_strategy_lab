# Firebase Setup Walkthrough

This guide will walk you through setting up Firebase for both local development and deployment.

## Part 1: Initial Firebase Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window. Sign in with your Google account.

### Step 3: Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "homeruns-strategy-lab")
4. Click **Continue**
5. Choose whether to enable Google Analytics (optional, can skip)
6. Click **Create project**
7. Wait for project creation (takes ~30 seconds)
8. Click **Continue**

### Step 4: Enable Firestore Database

1. In Firebase Console, click **Build** → **Firestore Database** (in left sidebar)
2. Click **Create database**
3. Choose **Start in test mode** (for now, we'll secure it later)
4. Select a location closest to you (e.g., `us-central1`)
5. Click **Enable**

### Step 5: Link Your Local Project to Firebase

In your project directory:

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase init
```

**When prompted, select:**
1. **Firestore** - Press Space to select, then Enter
2. **Functions** - Press Space to select, then Enter
3. **Hosting** - Press Space to select, then Enter
4. Press Enter to continue

**Choose your Firebase project:**
- Select the project you just created
- Press Enter

**For Firestore:**
- "What file should be used for Firestore Rules?" → Press Enter (default: `firestore.rules`)
- "What file should be used for Firestore indexes?" → Press Enter (default: `firestore.indexes.json`)

**For Functions:**
- "What language would you like to use?" → Select **TypeScript**
- "Do you want to use ESLint?" → Type `y` and press Enter (optional)
- "Do you want to install dependencies now?" → Type `y` and press Enter

**For Hosting:**
- "What do you want to use as your public directory?" → Type `frontend/dist` and press Enter
- "Configure as a single-page app?" → Type `y` and press Enter
- "Set up automatic builds and deploys with GitHub?" → Type `n` and press Enter (we'll do this manually)

### Step 6: Update Firebase Configuration

Edit `.firebaserc` and replace `your-firebase-project-id` with your actual project ID:

```bash
# Find your project ID in Firebase Console (it's shown in the URL or project settings)
# Then update .firebaserc
```

The file should look like:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Part 2: Local Development Setup

### Step 7: Set Up Environment Variables

Create `backend/.env` file:

```bash
cd backend
cat > .env << EOF
ANTHROPIC_API_KEY=your-anthropic-api-key-here
GCLOUD_PROJECT=your-firebase-project-id
EOF
```

Replace `your-anthropic-api-key-here` with your actual Anthropic API key.

### Step 8: Install Firebase Emulator Suite (Optional but Recommended)

For local testing without using real Firestore:

```bash
firebase init emulators
```

**When prompted:**
1. Select **Firestore Emulator** - Press Space to select, then Enter
2. Select **Functions Emulator** - Press Space to select, then Enter
3. Press Enter
4. For Firestore port, press Enter (default: 8080)
5. For Functions port, press Enter (default: 5001)
6. "Enable the Emulator UI?" → Type `y` and press Enter
7. "Emulator UI port?" → Press Enter (default: 4000)

This creates a `firebase.json` entry for emulators.

### Step 9: Test Local Development

#### Option A: Using Emulators (Recommended for Testing)

**Terminal 1 - Start Emulators:**
```bash
firebase emulators:start
```

You'll see output like:
```
✔  All emulators ready!
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect.         │
└─────────────────────────────────────────────────────────────┘
┌───────────┬────────────────┬─────────────────────────────────┐
│ Emulator  │ Host:Port      │ View in Emulator UI            │
├───────────┼────────────────┼─────────────────────────────────┤
│ Firestore │ localhost:8080 │ http://localhost:4000          │
│ Functions │ localhost:5001 │ http://localhost:4000          │
└───────────┴────────────────┴─────────────────────────────────┘
```

**Terminal 2 - Start Backend:**
```bash
cd backend
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GCLOUD_PROJECT=your-firebase-project-id
npm run dev
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 - it should work!

#### Option B: Using Real Firestore (Requires Authentication)

If you want to use the real Firestore database:

1. **Get Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click **"Generate new private key"**
   - Save the JSON file somewhere safe

2. **Set Environment Variable:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   export GCLOUD_PROJECT=your-firebase-project-id
   ```

3. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

## Part 3: Deployment Setup

### Step 10: Set Firebase Functions Configuration

Set your Anthropic API key as a Firebase Functions secret:

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
```

When prompted, paste your Anthropic API key.

Or use the older config method:
```bash
firebase functions:config:set anthropic.api_key="your-api-key-here"
```

### Step 11: Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates the `frontend/dist` folder that Firebase Hosting will serve.

### Step 12: Deploy Everything

**Deploy all services:**
```bash
firebase deploy
```

**Or deploy individually:**
```bash
# Deploy only Functions
firebase deploy --only functions

# Deploy only Hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

### Step 13: Test Deployed App

After deployment, Firebase will give you URLs like:
- Hosting: `https://your-project-id.web.app`
- Functions: `https://your-region-your-project-id.cloudfunctions.net/api`

Visit the Hosting URL to test your app!

## Part 4: Firestore Security Rules (Important!)

### Step 14: Update Firestore Rules

Currently, Firestore is in "test mode" which allows anyone to read/write. Update the rules:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection - users can only access their own sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null;
      // For now, allow all authenticated users
      // You can add more specific rules based on userId later
    }
    
    // Module responses - allow authenticated users to read/write
    match /moduleResponses/{responseId} {
      allow read, write: if request.auth != null;
    }
    
    // Final documents - allow authenticated users to read/write
    match /finalDocuments/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** Since we're not using Firebase Auth yet, you might want to keep it open for now:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Allow all for development
    }
  }
}
```

Then deploy rules:
```bash
firebase deploy --only firestore:rules
```

## Troubleshooting

### Emulator Not Starting
```bash
# Make sure Java is installed (required for emulators)
java -version

# If not installed, install it:
# macOS: brew install openjdk
# Or download from: https://adoptium.net/
```

### Functions Deployment Fails
- Make sure `backend/package.json` has correct dependencies
- Check that TypeScript compiles: `cd backend && npm run build`
- Verify you're logged in: `firebase login`

### CORS Errors
- Functions automatically handle CORS
- Make sure frontend uses relative paths (`/api/*`)

### API Key Not Working
- Verify it's set: `firebase functions:config:get`
- Check Functions logs: `firebase functions:log`

## Quick Reference Commands

```bash
# Start emulators
firebase emulators:start

# Deploy everything
firebase deploy

# View logs
firebase functions:log

# Open emulator UI
# Visit http://localhost:4000 when emulators are running
```

## Next Steps

1. ✅ Complete steps 1-6 to set up Firebase project
2. ✅ Complete step 7 to set environment variables
3. ✅ Choose Option A or B for local development (step 9)
4. ✅ Test locally
5. ✅ Complete steps 10-12 to deploy
6. ⏭️ Update Firestore security rules (step 14)
7. ⏭️ Add Firebase Authentication (optional, for user auth)

Let me know which step you're on or if you run into any issues!

