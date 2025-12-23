# How to Run the Application

## ✅ Dependencies Installed!

The dependencies have been installed. Here's how to start the app:

## Step 1: Start Both Servers

**From the project root directory**, run:

```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:3000
- **Frontend** on http://localhost:3001

You should see output in your terminal showing both servers starting up.

## Step 2: Open the App

1. Open your browser
2. Go to: **http://localhost:3001**
3. You should see the Homeruns Strategy Lab landing page

## Step 3: Configure API Key (Optional for Testing)

The `.env` file is created with a placeholder. To use AI features:

1. Edit `backend/.env`
2. Replace `your_key_here` with your actual Anthropic API key
3. Restart the servers (Ctrl+C and run `npm run dev` again)

## Troubleshooting

### If you see 404 errors:

1. **Check both servers are running** - You should see two processes in your terminal
2. **Test backend health**: Open http://localhost:3000/api/health in browser
   - Should show: `{"status":"ok"}`
3. **Check browser console** (F12) for specific error messages

### If servers won't start:

```bash
# Make sure you're in the project root
cd /Users/michaelhill/Documents/GitHub/Homeruns\ Strategy\ Lab

# Install dependencies again if needed
npm run install:all

# Then start
npm run dev
```

### CSP Warnings in Console

If you see Content Security Policy warnings in the browser console:
- These are usually from browser extensions
- They won't break the app
- You can safely ignore them if the app works

## Need Help?

Check the actual error message in:
- **Browser console** (F12 → Console tab)
- **Terminal** where servers are running

Share the specific error message for more help!




