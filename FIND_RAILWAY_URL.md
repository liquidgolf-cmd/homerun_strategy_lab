# How to Find Your Railway URL

## Step-by-Step Guide

### Step 1: Go to Railway Dashboard

1. Open: https://railway.app
2. Sign in (if not already signed in)

### Step 2: Open Your Project

1. You should see your project: **homerun-strategy-lab**
2. Click on it

### Step 3: Open Your Service

1. You should see a service (likely named something like "backend" or "homerun-strategy-lab")
2. Click on the service (not the project)

### Step 4: Find Your Public URL

You can find your Railway URL in **two places**:

#### Option A: Settings Tab (Recommended)

1. Click the **"Settings"** tab (at the top)
2. Scroll down to find **"Networking"** section
3. Look for:
   - **"Generate Domain"** button - Click this if you don't have a domain yet
   - **"Public Domain"** - This shows your URL (e.g., `homerun-strategy-lab-production-xxxx.up.railway.app`)
   - Copy this URL (you'll need to add `https://` in front)

#### Option B: Deployments Tab

1. Click the **"Deployments"** tab (at the top)
2. Click on the latest deployment (the one with a green checkmark)
3. Look in the logs for a line that says something like:
   ```
   Your service is available at https://homerun-strategy-lab-production-xxxx.up.railway.app
   ```

### Step 5: Your Full Railway URL

Once you find it, your Railway URL will look like:
```
https://homerun-strategy-lab-production-XXXX.up.railway.app
```

(Replace `XXXX` with your actual numbers/letters)

### Step 6: Test It

Open this URL in your browser (replace with your actual URL):
```
https://YOUR_URL_HERE.railway.app/api/health
```

Should return: `{"status":"ok"}`

### Step 7: Set in Vercel

Once you have your Railway URL, set `VITE_API_URL` in Vercel to:
```
https://YOUR_URL_HERE.railway.app/api
```

(Don't forget the `/api` at the end!)

## Visual Guide

Railway Dashboard Structure:
```
Railway Dashboard
└── Projects
    └── homerun-strategy-lab (PROJECT)
        └── [Your Service] (SERVICE) ← Click here
            ├── Deployments tab
            ├── Variables tab
            ├── Metrics tab
            └── Settings tab ← Your URL is here
                └── Networking section
                    └── Public Domain: your-url.railway.app
```

## Can't Find It?

If you don't see a public domain:

1. Go to **Settings** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** button
4. Railway will generate a domain for you
5. Copy that domain and use it

## Still Stuck?

Share a screenshot of:
- Your Railway project page (showing services)
- Your service's Settings tab
- And I can help you locate it!



