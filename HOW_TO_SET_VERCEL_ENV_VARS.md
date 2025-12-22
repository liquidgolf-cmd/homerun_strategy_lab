# How to Set Environment Variables in Vercel - Step by Step

## Step 1: Go to Vercel Dashboard

1. Open your web browser
2. Go to: **https://vercel.com**
3. Click **"Log In"** (top right) if you're not already logged in
4. Sign in with your account (GitHub, GitLab, or email)

## Step 2: Find Your Project

1. Once logged in, you'll see the Vercel Dashboard
2. Look for your project - it should be named something like:
   - `homerun-strategy-lab`
   - `homeruns-strategy-lab`
   - Or whatever name you used when deploying
3. **Click on your project name** to open it

## Step 3: Navigate to Environment Variables

1. In your project page, look at the top navigation bar
2. You'll see tabs like: **Overview**, **Deployments**, **Settings**, **Analytics**, etc.
3. **Click on "Settings"** (it's usually the 3rd or 4th tab)
4. In the left sidebar (under Settings), you'll see a list of options:
   - General
   - **Environment Variables** ← Click this one!
   - Git
   - Domains
   - Integrations
   - etc.

## Step 4: Add Environment Variables

1. You should now see the "Environment Variables" page
2. Click the **"Add New"** button (usually blue, on the right side)
3. A form will appear with these fields:
   - **Key** (text input)
   - **Value** (text input - can be hidden/shown with an eye icon)
   - **Environment** (checkboxes: Production, Preview, Development)

4. **Add the first variable:**
   - **Key:** `ANTHROPIC_CHAT_MODEL`
   - **Value:** `claude-3-5-sonnet-20241022`
   - **Environment:** Check all three: ☑ Production, ☑ Preview, ☑ Development
   - Click **"Save"**

5. **Add the second variable:**
   - Click **"Add New"** again
   - **Key:** `ANTHROPIC_AUDIT_MODEL`
   - **Value:** `claude-3-5-sonnet-20241022`
   - **Environment:** Check all three: ☑ Production, ☑ Preview, ☑ Development
   - Click **"Save"**

## Step 5: Verify Your Variables Are Set

After adding them, you should see both variables listed on the page:
- `ANTHROPIC_CHAT_MODEL`
- `ANTHROPIC_AUDIT_MODEL`

Each will show:
- The key name
- Whether it's encrypted (eye icon)
- Which environments it's enabled for
- Edit/Delete buttons

## Step 6: Redeploy (IMPORTANT!)

**Environment variables only apply to NEW deployments!**

1. Go to the **"Deployments"** tab (top navigation)
2. Find your latest deployment (should be at the top)
3. Click the **three dots** (...) on the right side of that deployment
4. Click **"Redeploy"** from the dropdown menu
5. Wait for the deployment to complete (usually 1-2 minutes)

## Alternative: Quick Deploy from Command Line

If you have Vercel CLI installed locally, you can also trigger a redeploy:

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
vercel --prod
```

## Visual Guide (What You'll See)

```
Vercel Dashboard
├── Projects List
│   └── Your Project (homerun-strategy-lab) ← Click here
│       ├── Overview Tab
│       ├── Deployments Tab
│       ├── Settings Tab ← Click here
│       │   ├── General
│       │   ├── Environment Variables ← Click here
│       │   ├── Git
│       │   └── ...
│       └── ...
```

## Troubleshooting

**Can't find your project?**
- Make sure you're logged into the correct Vercel account
- Check if the project is under a team/organization (look for team switcher at top)

**Can't see Environment Variables option?**
- Make sure you're in the Settings tab
- Make sure you have permissions to edit the project (you need to be the owner or have write access)

**Variables not working after redeploy?**
- Double-check the variable names are exactly correct (case-sensitive!)
- Make sure you redeployed AFTER adding the variables
- Check the Vercel build logs to see if variables are being read

## Quick Checklist

- [ ] Logged into Vercel.com
- [ ] Found and opened your project
- [ ] Clicked "Settings" tab
- [ ] Clicked "Environment Variables" in left sidebar
- [ ] Added `ANTHROPIC_CHAT_MODEL` = `claude-3-5-sonnet-20241022`
- [ ] Added `ANTHROPIC_AUDIT_MODEL` = `claude-3-5-sonnet-20241022`
- [ ] Checked all three environments (Production, Preview, Development)
- [ ] Clicked "Save" for both
- [ ] Redeployed the project

