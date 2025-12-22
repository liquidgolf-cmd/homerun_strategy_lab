import { createContext, useContext, useState, ReactNode } from 'react';
import { apiService } from '../services/api';

interface TTSContextType {
  ttsEnabled: boolean;
  toggleTTS: () => Promise<void>;
  speakText: (text: string) => Promise<void>;
  stopSpeaking: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

let currentAudio: HTMLAudioElement | null = null;

// Text-to-speech utility using Google Cloud TTS API
const speakTextImpl = async (text: string): Promise<void> => {
  try {
    // Stop any ongoing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    console.log('[TTS] Calling Google Cloud TTS API for text:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    // Call Google TTS API
    const audioDataUrl = await apiService.textToSpeech(text);
    
    if (!audioDataUrl) {
      console.error('[TTS] API returned empty audio data URL');
      throw new Error('TTS API returned empty audio data');
    }
    
    console.log('[TTS] Received audio data URL, length:', audioDataUrl.length);
    
    // Create audio element and play
    const audio = new Audio(audioDataUrl);
    currentAudio = audio;
    
    audio.onended = () => {
      console.log('[TTS] Audio playback completed');
      currentAudio = null;
    };
    
    audio.onerror = (error) => {
      console.error('[TTS] Audio playback error:', error);
      currentAudio = null;
    };
    
    console.log('[TTS] Starting audio playback...');
    await audio.play();
    console.log('[TTS] Audio playback started successfully');
  } catch (error: any) {
    console.error('[TTS] Error in speakTextImpl:', error);
    console.error('[TTS] Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });
    currentAudio = null;
    // Don't throw - just log the error so the UI doesn't break
    // Users can check console for error details
  }
};

const stopSpeakingImpl = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
};

export function TTSProvider({ children }: { children: ReactNode }) {
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const toggleTTS = async () => {
    // Stop any ongoing speech first
    stopSpeakingImpl();
    
    const newTtsEnabled = !ttsEnabled;
    setTtsEnabled(newTtsEnabled);
    console.log('[TTS] Toggle TTS:', newTtsEnabled ? 'ON' : 'OFF');
    
    // Announce the toggle state
    const announcement = newTtsEnabled ? 'Text to speech on' : 'Text to speech off';
    await speakTextImpl(announcement);
  };

  const speakText = async (text: string) => {
    if (ttsEnabled) {
      await speakTextImpl(text);
    }
  };

  const stopSpeaking = stopSpeakingImpl;

  return (
    <TTSContext.Provider value={{ ttsEnabled, toggleTTS, speakText, stopSpeaking }}>
      {children}
    </TTSContext.Provider>
  );
}

export function useTTS() {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
}

