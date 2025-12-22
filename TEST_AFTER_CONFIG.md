# Test Your Configuration

## Step 1: Test Your App

1. Visit your Vercel site: `https://homerun-strategy-lab.vercel.app`
2. Open browser console (Press F12)
3. Go to the **Console** tab
4. Try to sign in with Google

## Step 2: Check What You See

### ✅ Success Signs:
- API requests go to: `https://homerun-strategy-lab-production-1f3b.up.railway.app/api/modules/session`
- Response is JSON (not HTML)
- No "Session data missing session object" error
- Google sign-in works

### ❌ If Still Getting Errors:

**Check Network Tab:**
1. Open browser console (F12)
2. Go to **Network** tab
3. Try to sign in
4. Look for the `/api/modules/session` request
5. Check:
   - **Request URL**: Should include `/api` in the path
   - **Response**: Should be JSON, not HTML

**Common Issues:**

1. **Still getting HTML:**
   - Verify `VITE_API_URL` in Vercel includes `/api` at the end
   - Make sure you redeployed after changing the env var
   - Clear browser cache and try again

2. **404 or Network Error:**
   - Check Railway backend is running (check Deployment logs)
   - Verify Railway service is "Online" (green dot)

3. **Google Sign-In Issues:**
   - Check Supabase Redirect URLs include your Vercel domain
   - Check Google Cloud Console has Supabase callback URL

## Step 3: Verify Backend is Working

Test the backend health endpoint directly:
```
https://homerun-strategy-lab-production-1f3b.up.railway.app/api/health
```

Should return: `{"status":"ok"}`

If this doesn't work, the backend might not be running correctly.



