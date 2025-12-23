# Railway: How to Find Service Settings (Root Directory)

## Important: Service Settings vs Project Settings

Railway has two different levels of settings:
- **Project Settings** (what you're seeing now) - for the whole project
- **Service Settings** (where Root Directory is) - for individual services

## Step-by-Step to Find Root Directory

### Step 1: Exit Project Settings

1. **Click on your project name** in the top left (where it says "homerun strategy lab")
2. OR click the **back arrow** or **"←"** button
3. This takes you back to the **project overview** page

### Step 2: Find Your Service

On the project overview page, you'll see:
- **Service cards/boxes** (one for each service/repository you've deployed)
- Look for a card that shows your repository name or "New Service"

### Step 3: Click on the Service

1. **Click on the service card** (the box representing your backend deployment)
2. If you just connected the repo, it might say "New Service" or show your repo name

### Step 4: Open Service Settings

Once you're inside the service view:

1. You'll see tabs at the top like:
   - **Deployments**
   - **Metrics** 
   - **Logs**
   - **Settings** ← **CLICK THIS ONE**
   
2. Click **"Settings"** tab

### Step 5: Find Root Directory

In the Service Settings tab, you'll see:

- **Name**
- **Source** (or **Root Directory**) ← **THIS IS IT!**
- **Build Command**
- **Start Command**
- **Variables** (link to environment variables)

Enter `backend` in the Root Directory field.

## Visual Navigation Path

```
Railway Dashboard
│
├── [Your Project: "homerun strategy lab"] ← You are here (Project Settings)
│   └── Project Settings (General, Usage, Environments, etc.)
│
└── Click project name or back arrow
    │
    └── Project Overview Page
        │
        └── [Service Card/Box] ← Click this service
            │
            └── Service View
                │
                ├── Deployments tab
                ├── Metrics tab
                ├── Logs tab
                └── Settings tab ← CLICK HERE
                    │
                    └── Root Directory: [backend] ← ENTER "backend" HERE
```

## If You Don't Have a Service Yet

If you haven't created a service yet:

1. On the **project overview page**
2. Click **"+ New"** or **"Add Service"** button
3. Select **"GitHub Repo"**
4. Select your repository: `liquidgolf-cmd/homerun_strategy_lab`
5. Railway will create the service
6. Then follow steps above to set Root Directory

## Quick Check

- ✅ **Correct place**: Service → Settings tab → Root Directory
- ❌ **Wrong place**: Project → Settings → General (where you are now)

## Alternative: Set It During Service Creation

When Railway asks you to configure the service after connecting your repo:
- Look for **"Root Directory"** or **"Working Directory"** field
- Enter: `backend`
- Railway will remember this setting




