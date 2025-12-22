#!/bin/bash
# Script to minify Google Cloud credentials JSON for Vercel environment variable

if [ "$#" -ne 1 ]; then
    echo "Usage: ./scripts/minify-google-credentials.sh <path-to-credentials.json>"
    echo ""
    echo "Example:"
    echo "  ./scripts/minify-google-credentials.sh ~/Downloads/google-tts-credentials.json"
    exit 1
fi

CREDENTIALS_FILE="$1"

if [ ! -f "$CREDENTIALS_FILE" ]; then
    echo "Error: File not found: $CREDENTIALS_FILE"
    exit 1
fi

echo "Minifying Google credentials JSON..."
echo ""

# Check if jq is installed
if command -v jq &> /dev/null; then
    echo "Using jq to minify..."
    MINIFIED=$(jq -c . "$CREDENTIALS_FILE")
else
    echo "jq not found. Using Node.js to minify..."
    if command -v node &> /dev/null; then
        MINIFIED=$(node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('$CREDENTIALS_FILE', 'utf8'))))")
    else
        echo "Error: Neither jq nor node found. Please install one of them."
        echo "  macOS: brew install jq"
        echo "  Or use an online JSON minifier: https://jsonformatter.org/json-minify"
        exit 1
    fi
fi

echo ""
echo "Minified JSON (copy this to Vercel GOOGLE_TTS_CREDENTIALS variable):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$MINIFIED"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Instructions:"
echo "1. Copy the entire JSON above (it's all on one line)"
echo "2. Go to Vercel > Your Project > Settings > Environment Variables"
echo "3. Add new variable:"
echo "   - Name: GOOGLE_TTS_CREDENTIALS"
echo "   - Value: Paste the JSON above"
echo "   - Environment: Production, Preview, Development (as needed)"
echo "4. Save and redeploy your application"

