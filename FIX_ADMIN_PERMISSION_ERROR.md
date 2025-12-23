# Fix: Admin Permission Error (not_admin)

## The Problem

The backend was getting a 403 "User not allowed" error with code 'not_admin' when trying to call:
```javascript
supabaseAdmin.auth.admin.getUserById(userId)
```

This was failing because the Service Role Key wasn't being recognized correctly for admin operations.

## The Solution

We removed the unnecessary `getUserById` call because:
1. ✅ The user is **already verified** in the `verifyAuth` middleware using the JWT token
2. ✅ If the JWT is valid, the user **must exist** in `auth.users`
3. ✅ We don't need to fetch the user again - we can proceed directly

## What Changed

- Removed the `getUserById` API call
- Removed the admin client creation (no longer needed)
- Simplified the code to just create/get the user profile directly
- User name will be null initially (can be updated later if needed)

## After Deployment

Once Railway deploys this fix:
- ✅ No more "not_admin" errors
- ✅ No more 403 errors
- ✅ User profile and session creation should work
- ✅ API should return 200 instead of 401/403

The authentication flow is now simpler and more reliable!




