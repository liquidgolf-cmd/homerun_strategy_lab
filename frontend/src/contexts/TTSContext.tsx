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

    // Call Google TTS API
    const audioDataUrl = await apiService.textToSpeech(text);
    
    // Create audio element and play
    const audio = new Audio(audioDataUrl);
    currentAudio = audio;
    
    audio.onended = () => {
      currentAudio = null;
    };
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      currentAudio = null;
    };
    
    await audio.play();
  } catch (error) {
    console.error('TTS Error:', error);
    currentAudio = null;
    throw error;
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
    
    // Announce the toggle state
    const announcement = newTtsEnabled ? 'Text to speech on' : 'Text to speech off';
    try {
      await speakTextImpl(announcement);
    } catch (error) {
      console.error('Error announcing toggle state:', error);
    }
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

