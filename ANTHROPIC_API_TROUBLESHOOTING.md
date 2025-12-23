# Troubleshooting Anthropic API 404 Errors

If you're seeing a 500 error with a nested 404 from `/api/ai/chat`, it's likely an issue with your Anthropic API key.

## Quick Fix Checklist

1. **Verify API Key is Set in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Look for `ANTHROPIC_API_KEY`
   - Make sure it's set for **Production**, **Preview**, and **Development**

2. **Check API Key Format:**
   - Anthropic API keys should start with `sk-ant-`
   - They're usually long strings (40+ characters)
   - Make sure there are no extra spaces or newlines

3. **Get Your API Key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign in to your account
   - Go to **API Keys** section
   - Copy your API key (or create a new one if needed)

4. **Redeploy After Setting Variables:**
   - Environment variables only apply to NEW deployments
   - Go to Vercel Dashboard → Deployments
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**

## Verify It's Working

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `/api/ai/chat` function
   - Click to view logs
   - Look for detailed error messages (the improved error handling will show more info)

2. **Test the Health Endpoint:**
   - Visit: `https://your-app.vercel.app/api/health`
   - It should show `ANTHROPIC_API_KEY: set` (not `missing`)

3. **Try the Chat Again:**
   - After redeploying with the correct API key, try using the AI chat
   - The error should be resolved

## Common Error Messages

- **404 Error:** Usually means invalid API key or API key not set
- **401/403 Error:** API key is invalid or expired
- **"ANTHROPIC_API_KEY is not set":** Environment variable is missing

## Still Having Issues?

Check the Vercel function logs for detailed error information. The improved error handling will show:
- HTTP status code
- Error message from Anthropic
- Full error details

If the error persists, verify:
1. Your Anthropic account has credits/usage available
2. The API key hasn't been revoked
3. You're using the correct API key for your Anthropic account


