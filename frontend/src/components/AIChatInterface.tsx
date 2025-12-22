import { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ModuleConfig } from '../types';

// Text-to-speech utility using Web Speech API (Google TTS)
const speakText = (text: string, onEnd?: () => void) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    window.speechSynthesis.speak(utterance);
    return utterance;
  }
  return null;
};

const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

interface AIChatInterfaceProps {
  config: ModuleConfig;
  moduleContext: string;
  existingTranscript: Array<{ role: string; content: string; timestamp?: string }>;
  onSave: (data: { aiTranscript: Array<{ role: string; content: string }> }) => void;
  onComplete: () => void;
  onSwitchToForm: () => void;
}

export default function AIChatInterface({
  config,
  moduleContext,
  existingTranscript,
  onSave,
  onComplete,
  onSwitchToForm,
}: AIChatInterfaceProps) {
  // Get initial message based on module
  const getInitialMessage = () => {
    if (existingTranscript.length > 0) {
      return existingTranscript.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.timestamp || new Date().toISOString(),
      }));
    }
    
    // Module 1 specific initial question
    if (config.number === 1) {
      return [
        {
          role: 'assistant' as const,
          content: `Hello! I'm here to help you complete ${config.title}. Can you describe your ideal customer/client/user? Who are you really serving?`,
          timestamp: new Date().toISOString(),
        },
      ];
    }
    
    // Default initial message for other modules
    return [
      {
        role: 'assistant' as const,
        content: `Hello! I'm here to help you complete ${config.title}. I'll ask you some questions to understand your current situation. Let's start - can you tell me a bit about where you are right now with ${config.title.toLowerCase()}?`,
        timestamp: new Date().toISOString(),
      },
    ];
  };

  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>
  >(getInitialMessage());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Scroll chat container to top on initial load
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = 0;
    }
  }, []); // Run once on mount

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 1) {
      // Only auto-scroll to bottom if there are multiple messages (user has responded)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle text-to-speech for assistant messages
  useEffect(() => {
    if (ttsEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only speak assistant messages
      if (lastMessage.role === 'assistant') {
        // Strip markdown formatting for cleaner speech
        const textToSpeak = lastMessage.content
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/#{1,6}\s/g, '') // Remove markdown headers
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
          .replace(/`([^`]+)`/g, '$1') // Remove inline code
          .trim();
        
        if (textToSpeak) {
          currentUtteranceRef.current = speakText(textToSpeak);
        }
      }
    } else if (!ttsEnabled) {
      // Stop speaking when TTS is disabled
      stopSpeaking();
      currentUtteranceRef.current = null;
    }

    // Cleanup: stop speech when component unmounts
    return () => {
      stopSpeaking();
    };
  }, [messages, ttsEnabled]);

  const handleTtsToggle = () => {
    const newTtsEnabled = !ttsEnabled;
    setTtsEnabled(newTtsEnabled);
    if (!newTtsEnabled) {
      stopSpeaking();
      currentUtteranceRef.current = null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await apiService.chat(conversationMessages, moduleContext);

      const assistantMessage = {
        role: 'assistant' as const,
        content: response,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      // Auto-save transcript
      onSave({
        aiTranscript: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">{config.title}</h2>
          <div className="flex items-center gap-4">
            {/* Text-to-Speech Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-gray-700">Text-to-Speech</span>
              <button
                type="button"
                onClick={handleTtsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  ttsEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label="Toggle text-to-speech"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <button
              onClick={onSwitchToForm}
              className="text-sm text-primary hover:underline"
            >
              Switch to Form
            </button>
          </div>
        </div>
        <p className="text-secondary">{config.description}</p>
      </div>

      {/* Chat Messages */}
      <div 
        id="chat-messages-container"
        className="bg-white rounded-lg shadow-lg p-6 mb-4 flex-1 overflow-y-auto min-h-0"
        ref={(el) => {
          if (el && messages.length > 0 && messages[0].role === 'assistant') {
            // Scroll to top when first message loads
            el.scrollTop = 0;
          }
        }}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom on mobile */}
      <div className="bg-white rounded-lg shadow-lg p-4 flex-shrink-0">
        {/* Mobile: Textarea above buttons */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none order-1 md:order-none"
            rows={3}
            disabled={loading}
          />
          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 order-2 md:order-none">
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex-1 md:flex-none bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              onClick={onComplete}
              className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Complete & Review
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

