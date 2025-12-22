import { VercelRequest, VercelResponse } from '@vercel/node';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { verifyAuth } from '../auth/verify';

// Initialize Google TTS client
let ttsClient: TextToSpeechClient | null = null;

function getTTSClient(): TextToSpeechClient {
  if (!ttsClient) {
    // Google Cloud TTS requires service account credentials
    // Option 1: Use GOOGLE_TTS_CREDENTIALS (service account JSON content as string)
    // Option 2: Use GOOGLE_APPLICATION_CREDENTIALS (service account JSON file path)
    const credentialsJson = process.env.GOOGLE_TTS_CREDENTIALS;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    if (credentialsJson) {
      // Parse JSON credentials from environment variable
      try {
        const credentials = JSON.parse(credentialsJson);
        ttsClient = new TextToSpeechClient({
          credentials: credentials,
          projectId: credentials.project_id,
        });
      } catch (error: any) {
        console.error('Error parsing GOOGLE_TTS_CREDENTIALS:', error);
        throw new Error(`GOOGLE_TTS_CREDENTIALS must be valid JSON: ${error.message}`);
      }
    } else if (credentialsPath) {
      // Use file path for service account
      ttsClient = new TextToSpeechClient({
        keyFilename: credentialsPath,
      });
    } else {
      // Try default credentials (for GCP environments like Cloud Run, App Engine)
      try {
        ttsClient = new TextToSpeechClient();
      } catch (error: any) {
        console.error('Failed to initialize TTS client:', error);
        throw new Error('Google TTS not configured. Please set GOOGLE_TTS_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS');
      }
    }
  }
  return ttsClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    await verifyAuth(req);

    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const client = getTTSClient();
    
    // Request TTS synthesis
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'NEUTRAL',
        name: 'en-US-Neural2-D', // High-quality neural voice
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    });

    if (!response.audioContent) {
      return res.status(500).json({ error: 'Failed to generate audio' });
    }

    // Convert audio content to base64 for sending to client
    const audioBase64 = (response.audioContent as Buffer).toString('base64');
    const audioDataUrl = `data:audio/mp3;base64,${audioBase64}`;

    return res.status(200).json({ audioDataUrl });
  } catch (error: any) {
    console.error('TTS Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack,
    });
    
    // Check for authentication/configuration errors
    if (error.message?.includes('GOOGLE_TTS_CREDENTIALS') || 
        error.message?.includes('credentials') ||
        error.message?.includes('not configured') ||
        error.code === 'ENOENT' ||
        error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        error: 'TTS service not configured. Please set GOOGLE_TTS_CREDENTIALS environment variable in Vercel.',
        details: error.message 
      });
    }
    
    // Check for API permission errors
    if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
      return res.status(500).json({ 
        error: 'TTS API permission denied. Please check that the service account has Text-to-Speech API User role.',
        details: error.message 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.code || 'Unknown error'
    });
  }
}

