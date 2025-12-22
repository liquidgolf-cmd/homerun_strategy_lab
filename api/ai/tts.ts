import { VercelRequest, VercelResponse } from '@vercel/node';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { verifyAuth } from '../auth/verify';

// Initialize Google TTS client
let ttsClient: TextToSpeechClient | null = null;

function getTTSClient(): TextToSpeechClient {
  if (!ttsClient) {
    // Google Cloud TTS requires service account credentials
    // Option 1: Use GOOGLE_APPLICATION_CREDENTIALS (service account JSON file path)
    // Option 2: Use environment variable for service account JSON content
    const credentialsJson = process.env.GOOGLE_TTS_CREDENTIALS;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    if (credentialsJson) {
      // Parse JSON credentials from environment variable
      try {
        const credentials = JSON.parse(credentialsJson);
        ttsClient = new TextToSpeechClient({
          credentials: credentials,
        });
      } catch (error) {
        throw new Error('GOOGLE_TTS_CREDENTIALS must be valid JSON');
      }
    } else if (credentialsPath) {
      // Use file path for service account
      ttsClient = new TextToSpeechClient({
        keyFilename: credentialsPath,
      });
    } else {
      // Try default credentials (for GCP environments)
      ttsClient = new TextToSpeechClient();
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
    
    if (error.message?.includes('GOOGLE_TTS_CREDENTIALS') || error.message?.includes('credentials')) {
      return res.status(500).json({ error: 'TTS service not configured. Please set GOOGLE_TTS_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS environment variable.' });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

