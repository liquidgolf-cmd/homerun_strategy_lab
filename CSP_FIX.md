# CSP (Content Security Policy) Errors - Explanation

## What You're Seeing

The CSP errors in the console are **warnings**, not errors that break functionality. They're likely coming from:

1. **Cursor browser extensions** - Some extensions inject CSP headers
2. **Browser security settings** - Your browser may have strict CSP settings
3. **Development tools** - Dev tools sometimes show CSP warnings

## The Errors Explained

1. **Font loading violations**: The browser is trying to load fonts (like `Soleil.woff2`) that may not exist or are being blocked. Since we're using system fonts, this is just a warning.

2. **Connection violations**: The `.well-known/appspecific/` path is a Cursor/browser feature, not part of our app.

3. **404 errors**: Likely related to missing assets or the backend not running.

## Fixes

### Option 1: Ignore CSP Warnings (Recommended)
These warnings typically don't break functionality. If the app works, you can safely ignore them.

### Option 2: Disable Browser Extensions
Try running in an incognito/private window with extensions disabled to see if warnings go away.

### Option 3: The Real Issue - 404 Errors
Focus on fixing 404s:
1. Ensure backend is running: `cd backend && npm run dev`
2. Ensure frontend is running: `cd frontend && npm run dev`
3. Check that API calls work: Open browser console and check Network tab

## What to Check

The **real** error to focus on is the 404. Check:
- Is the backend running on port 3000?
- Can you access `http://localhost:3000/api/health` in your browser?
- What specific URL is returning 404?

The CSP warnings are cosmetic and won't prevent the app from working.

