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

// Fallback to browser's Web Speech API if Google TTS fails
const speakWithBrowserTTS = (text: string): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
};

// Text-to-speech utility using Google Cloud TTS API with fallback to browser TTS
const speakTextImpl = async (text: string): Promise<void> => {
  try {
    // Stop any ongoing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    console.log('[TTS] Attempting Google Cloud TTS for text:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    
    try {
      // Try Google Cloud TTS API first
      const audioDataUrl = await apiService.textToSpeech(text);
      
      if (!audioDataUrl) {
        throw new Error('TTS API returned empty audio data');
      }
      
      console.log('[TTS] Received audio data from Google Cloud TTS');
      
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
        // Fallback to browser TTS on playback error
        console.log('[TTS] Falling back to browser TTS');
        speakWithBrowserTTS(text);
      };
      
      await audio.play();
      console.log('[TTS] Google Cloud TTS audio playing');
      return;
    } catch (apiError: any) {
      // If Google TTS API fails, fallback to browser TTS
      console.warn('[TTS] Google Cloud TTS failed, using browser fallback:', apiError?.response?.data?.error || apiError?.message);
      console.log('[TTS] Using browser built-in TTS as fallback');
      speakWithBrowserTTS(text);
    }
  } catch (error: any) {
    console.error('[TTS] Unexpected error:', error);
    // Final fallback to browser TTS
    speakWithBrowserTTS(text);
  }
};

const stopSpeakingImpl = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  // Also stop browser TTS if it's running
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export function TTSProvider({ children }: { children: ReactNode }) {
  const [ttsEnabled, setTtsEnabled] = useState(true); // TTS enabled by default

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

