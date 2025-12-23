# Quick Start Guide

## First Time Setup

1. **Install dependencies** (if not done):
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Start the development servers**:
   ```bash
   # From project root
   npm run dev
   ```
   
   This starts:
   - Backend on http://localhost:3000
   - Frontend on http://localhost:3001

4. **Open the app**:
   - Go to http://localhost:3001 in your browser
   - The backend API will be available at http://localhost:3000/api

## If You're Getting 404 Errors

### Check 1: Are both servers running?
Look for two terminal processes:
- One showing "Server running on http://localhost:3000" 
- One showing "VITE ready" with localhost:3001

### Check 2: Test the backend
Open in browser: http://localhost:3000/api/health
Should return: `{"status":"ok"}`

### Check 3: Test the frontend
Open in browser: http://localhost:3001
Should show the Homeruns Strategy Lab landing page

### Check 4: Check browser console
Press F12 → Console tab
- Red errors = actual problems
- Yellow warnings = usually safe to ignore (like CSP warnings)

## Troubleshooting

### "Cannot find module" errors
Run: `npm run install:all` again

### Port already in use
Kill processes on ports 3000/3001:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Backend won't start
1. Check `.env` file exists in `backend/` directory
2. Check that ANTHROPIC_API_KEY is set (even if it's a placeholder)
3. Check terminal for error messages

### Frontend won't start
1. Make sure backend is running first
2. Check that port 3001 is available
3. Check terminal for error messages

## Common Errors

### CSP (Content Security Policy) Warnings
These are usually from browser extensions and can be ignored if the app works.

### 404 on API calls
- Backend not running → Start it with `cd backend && npm run dev`
- Wrong URL → Check that API calls go to `/api/*`

### Module pages not loading
- Make sure you've created a session first (from main page)
- Check localStorage in browser DevTools for 'session' key




