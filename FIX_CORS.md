# Fix CORS Error

## The Problem

Your frontend on Vercel (`https://homerun-strategy-lab.vercel.app`) is trying to call Firebase Functions, but CORS is blocking it.

## The Fix

I've updated the CORS configuration in `backend/src/index.ts` to:
1. Allow requests from your Vercel domain
2. Allow requests from any Vercel preview deployments
3. Allow localhost for development

## Next Steps

### 1. Redeploy Backend to Firebase Functions

After the code is pushed to GitHub, redeploy your backend:

```bash
cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
firebase deploy --only functions
```

### 2. Wait for Deployment

Firebase Functions deployment takes 1-2 minutes.

### 3. Test Again

Go back to your Vercel app and try again. The CORS error should be gone!

## If Still Not Working

If you still see CORS errors after redeploying:

1. **Clear browser cache** or try incognito mode
2. **Check the Firebase Functions logs**:
   ```bash
   firebase functions:log
   ```
3. **Verify the CORS headers** are being sent (check Network tab in browser DevTools)

The fix has been pushed to GitHub, so you just need to redeploy the backend!




