# Google Cloud Text-to-Speech Setup

This application uses Google Cloud Text-to-Speech API for text-to-speech functionality.

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for TTS API)

### 2. Enable Text-to-Speech API

1. Navigate to [Text-to-Speech API page](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)
2. Click "Enable" to activate the API for your project

### 3. Create Service Account and Download Credentials

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the service account details:
   - Name: `homerun-strategy-lab-tts` (or any name you prefer)
   - Description: "Service account for Text-to-Speech API"
4. Click "Create and Continue"
5. Grant the role: "Cloud Text-to-Speech API User" (or "Text-to-Speech API User")
6. Click "Continue" then "Done"

### 4. Generate JSON Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (e.g., `google-tts-credentials.json`)

### 5. Set Environment Variable in Vercel

You have two options:

#### Option A: JSON Content as Environment Variable (Recommended for Vercel)

1. Open the downloaded JSON file (e.g., `google-tts-credentials.json`)
2. **IMPORTANT**: The JSON must be minified (all on one line, no line breaks) for Vercel's environment variables
3. You have two options:
   
   **Option A1: Minify JSON manually**
   - Remove all line breaks and extra spaces
   - The JSON should look like: `{"type":"service_account","project_id":"your-project",...}` (all on one line)
   - Or use an online JSON minifier: https://jsonformatter.org/json-minify
   
   **Option A2: Use command line (if you have the file locally)**
   ```bash
   cat google-tts-credentials.json | jq -c .
   ```
   This will output minified JSON that you can copy
   
4. In Vercel project settings:
   - Go to Settings > Environment Variables
   - Click "Add New"
   - **Name**: `GOOGLE_TTS_CREDENTIALS`
   - **Value**: Paste the minified JSON (must be all on one line with no extra spaces/line breaks)
   - **Environment**: Select Production, Preview, and/or Development (check all you need)
   - Click "Save"
5. **Redeploy** your application after adding the environment variable

#### Option B: Service Account File Path (Not recommended for Vercel serverless)

If running locally or on a server with file system access, you can use:
- **Name**: `GOOGLE_APPLICATION_CREDENTIALS`
- **Value**: `/path/to/google-tts-credentials.json`

## Environment Variables Summary

Add to Vercel (Settings > Environment Variables):

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `GOOGLE_TTS_CREDENTIALS` | Full JSON content of service account credentials | `{"type":"service_account","project_id":"..."}` |

## Testing

After setting up the environment variable:

1. Deploy to Vercel
2. Open your application
3. Navigate to a module with chat
4. Toggle the "Text-to-Speech" switch
5. The toggle should announce "Text to speech on" or "Text to speech off"
6. Assistant messages should be spoken when TTS is enabled

## Troubleshooting

### Error: "TTS service not configured"

- Check that `GOOGLE_TTS_CREDENTIALS` is set in Vercel
- Ensure the JSON is valid (no syntax errors)
- Redeploy after adding the environment variable

### Error: "Permission denied" or "Authentication failed"

- Verify the service account has "Text-to-Speech API User" role
- Check that Text-to-Speech API is enabled in your Google Cloud project
- Ensure billing is enabled for your Google Cloud project

### Audio not playing

- Check browser console for errors
- Verify the API endpoint `/api/ai/tts` is accessible
- Check network tab to see if the request succeeds

## API Endpoint

The TTS endpoint is located at: `/api/ai/tts`

**Request:**
```json
POST /api/ai/tts
Authorization: Bearer <supabase_token>
Content-Type: application/json

{
  "text": "Text to convert to speech"
}
```

**Response:**
```json
{
  "audioDataUrl": "data:audio/mp3;base64,..."
}
```

## Pricing

Google Cloud Text-to-Speech pricing:
- Free tier: 0 to 4 million characters per month
- Paid: $4.00 per million characters after free tier

Check current pricing at: https://cloud.google.com/text-to-speech/pricing

