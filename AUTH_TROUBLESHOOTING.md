# Authentication Troubleshooting Guide

## Email/Password Login Errors

### "Invalid login credentials" Error

This error means the email/password combination is incorrect. Common causes:

1. **Account doesn't exist yet**
   - Solution: Click "Sign up" to create an account first
   - Then sign in with the credentials you just created

2. **Wrong password**
   - Solution: Double-check your password
   - Use the "Forgot password" feature if available (coming soon)

3. **Email not confirmed** (if email confirmation is enabled)
   - Solution: Check your email inbox for a confirmation link
   - Click the link to verify your account
   - Then try signing in again

### Email Confirmation in Supabase

By default, Supabase requires email confirmation for new sign-ups. This means:

1. When you sign up, you'll receive a confirmation email
2. You must click the link in the email to verify your account
3. Only after verification can you sign in

**To disable email confirmation (for development/testing):**

1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle it OFF
4. Save

**Note:** For production, it's recommended to keep email confirmation enabled for security.

### Testing Email/Password Auth

1. **Sign Up First:**
   - Click "Sign up" on the login page
   - Enter email, password (min 6 characters), and optional name
   - Click "Sign Up"
   - If email confirmation is enabled, check your email

2. **Then Sign In:**
   - Use the same email and password you just created
   - You should be signed in successfully

### Google OAuth vs Email/Password

- **Google OAuth**: No email confirmation needed, instant sign-in
- **Email/Password**: May require email confirmation depending on Supabase settings

### Still Having Issues?

1. **Check Supabase Dashboard:**
   - Go to Authentication → Users
   - See if your user account exists
   - Check if email is confirmed

2. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Look at Console tab for detailed error messages
   - Share the error message for help

3. **Try Google OAuth:**
   - If email/password isn't working, try Google OAuth as an alternative
   - It's usually more reliable for quick testing

