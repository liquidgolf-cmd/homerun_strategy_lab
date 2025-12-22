# Anthropic Model Names Reference

If you're getting 404 errors with the Anthropic API, the model name might be incorrect. Here are the correct model identifiers to try:

## Current Model Options (Anthropic Recommended)

### Claude Sonnet 4 (Recommended - Best Balance)
- `claude-sonnet-4-20250514` - **DEFAULT** - Best balance of intelligence and speed

### Claude Haiku 4.5 (Faster/Cheaper)
- `claude-haiku-4-5-20251001` - Faster and more cost-effective responses

## How to Change the Model

### Option 1: Via Vercel Environment Variables (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add or update:
   - `ANTHROPIC_CHAT_MODEL` = `claude-sonnet-4-20250514` (recommended - best balance)
   - `ANTHROPIC_AUDIT_MODEL` = `claude-sonnet-4-20250514` (recommended - best balance)
   - OR use `claude-haiku-4-5-20251001` for faster/cheaper responses
3. Redeploy your application

### Option 2: Use Faster/Cheaper Model

For faster and more cost-effective responses, use Haiku:
- `ANTHROPIC_CHAT_MODEL` = `claude-haiku-4-5-20251001`
- `ANTHROPIC_AUDIT_MODEL` = `claude-haiku-4-5-20251001`

## Troubleshooting

**404 Error:**
- The model name might be incorrect
- Your API key might not have access to that model
- Make sure you're using the exact model name: `claude-sonnet-4-20250514` or `claude-haiku-4-5-20251001`

**Check Available Models:**
You can test which models your API key has access to by checking the Anthropic console or trying different model names.

**Current Default:**
The code now defaults to `claude-sonnet-4-20250514` (Anthropic's recommended model for best balance of intelligence and speed). This is the correct model name as of Anthropic's latest recommendations.

