# Anthropic Model Names Reference

If you're getting 404 errors with the Anthropic API, the model name might be incorrect. Here are the correct model identifiers to try:

## Current Model Options

### Claude 3.5 Sonnet (Recommended - Best Balance)
- `claude-3-5-sonnet-20241022` (full version)
- `claude-3-5-sonnet` (simplified, may auto-resolve to latest)

### Claude 3 Opus (Most Capable)
- `claude-3-opus-20240229` (full version)
- `claude-3-opus` (simplified)

### Claude 3 Haiku (Fastest, Most Cost-Effective)
- `claude-3-haiku-20240307` (full version)
- `claude-3-haiku` (simplified)

## How to Change the Model

### Option 1: Via Vercel Environment Variables (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add or update:
   - `ANTHROPIC_CHAT_MODEL` = `claude-3-5-sonnet-20241022` (for chat)
   - `ANTHROPIC_AUDIT_MODEL` = `claude-3-5-sonnet-20241022` (for audit reviews)
3. Redeploy your application

### Option 2: Test Different Model Names

If `claude-3-5-sonnet` doesn't work, try:
- `claude-3-5-sonnet-20241022` (full version with date)
- Check Anthropic's latest documentation for current model names

## Troubleshooting

**404 Error:**
- The model name might be incorrect
- Your API key might not have access to that model
- Try a different model name from the list above

**Check Available Models:**
You can test which models your API key has access to by checking the Anthropic console or trying different model names.

**Current Default:**
The code now defaults to `claude-3-5-sonnet` (without date suffix). If this doesn't work, set `ANTHROPIC_CHAT_MODEL` and `ANTHROPIC_AUDIT_MODEL` environment variables with the full model name including the date.

