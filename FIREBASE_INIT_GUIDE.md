# Step 5: Firebase Init - Detailed Guide

## Where to Run This

Open your **Terminal** application (on macOS, it's in Applications → Utilities → Terminal, or press Cmd+Space and type "Terminal").

Then navigate to your project directory:

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
```

## What `firebase init` Does

This command will:
1. Ask you which Firebase services to set up
2. Link your local project to your Firebase project
3. Create configuration files
4. Set up the necessary folders and files

## Step-by-Step Walkthrough

### 1. Run the Command

In your terminal, type:
```bash
firebase init
```

Press Enter.

### 2. Select Features (First Screen)

You'll see something like this:
```
     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab

? Which Firebase features do you want to set up for this directory? 
Press Space to select features, then Enter to confirm your choices.
```

**Use arrow keys to move up/down, press SPACE to select/deselect:**

- [ ] Database: Deploy Firebase Realtime Database Rules
- [ ] Firestore: Deploy security rules and create indexes
- [ ] Functions: Configure and deploy Cloud Functions
- [ ] Hosting: Configure and deploy Firebase Hosting sites
- [ ] Storage: Deploy Cloud Storage security rules

**Select these 3:**
- ✅ **Firestore** (press Space to check it)
- ✅ **Functions** (press Space to check it)  
- ✅ **Hosting** (press Space to check it)

**Then press Enter** to confirm.

### 3. Select Firebase Project

Next, you'll see:
```
? Please select an option: (Use arrow keys)
> Use an existing project
  Create a new project
  Add Firebase to an existing Google Cloud Platform project
  Don't set up a default project
```

**Select "Use an existing project"** (should be the default, just press Enter)

Then you'll see a list of your Firebase projects:
```
? Please select an option: Use an existing project
? Select a default Firebase project for this directory: (Use arrow keys)
> homeruns-strategy-lab (homeruns-strategy-lab-xxxxx)
  [another project if you have one]
```

**Use arrow keys to select the project you created in Step 3, then press Enter.**

### 4. Firestore Setup

```
? What file should be used for Firestore Rules? (firestore.rules)
```

**Just press Enter** to use the default `firestore.rules`

```
? What file should be used for Firestore indexes? (firestore.indexes.json)
```

**Just press Enter** to use the default `firestore.indexes.json`

### 5. Functions Setup

```
? What language would you like to use to write Cloud Functions? (Use arrow keys)
> JavaScript
  TypeScript
```

**Use arrow keys to select "TypeScript", then press Enter.**

```
? Do you want to use ESLint to catch probable bugs and enforce style? (Y/n)
```

**Type `y` and press Enter** (or just press Enter, as Y is the default)

```
? Do you want to install dependencies with npm now? (Y/n)
```

**Type `y` and press Enter** to install dependencies now.

### 6. Hosting Setup

```
? What do you want to use as your public directory? (public)
```

**Type `frontend/dist` and press Enter** (this is where your built frontend files are)

```
? Configure as a single-page app (rewrite all urls to /index.html)? (y/N)
```

**Type `y` and press Enter** (this is important for React Router to work)

```
? Set up automatic builds and deploys with GitHub? (y/N)
```

**Type `n` and press Enter** (we'll deploy manually for now)

### 7. Completion

You should see:
```
✔  Firebase initialization complete!
```

And Firebase will create/update these files:
- `firebase.json` - Firebase configuration
- `.firebaserc` - Your project ID (already exists, but may be updated)
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore index configuration
- `functions/` directory - For Cloud Functions (if created)

## Common Issues

### "Command not found: firebase"
- Make sure you installed Firebase CLI: `npm install -g firebase-tools`
- If you got a permissions error, try: `sudo npm install -g firebase-tools`

### "No projects found"
- Make sure you're logged in: `firebase login`
- Make sure you created a project in Firebase Console first (Step 3)

### "Directory already contains files"
- That's okay! Firebase will ask if you want to overwrite. 
- Say `n` (no) for files you want to keep
- Say `y` (yes) only if you want to overwrite with Firebase defaults

## What Files Get Created

After `firebase init`, you'll have:

```
Homeruns Strategy Lab/
├── firebase.json          (Firebase config - already exists)
├── .firebaserc            (Project ID - will be updated)
├── firestore.rules        (NEW - Security rules)
├── firestore.indexes.json (NEW - Database indexes)
└── functions/             (NEW - Cloud Functions folder)
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```

**Note:** Since we already have a `backend/` folder with our functions, we might need to adjust things. Let me know when you've run `firebase init` and I'll help you integrate it properly!




