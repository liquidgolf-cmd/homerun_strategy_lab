import { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ModuleConfig } from '../types';

interface AIChatInterfaceProps {
  config: ModuleConfig;
  moduleContext: string;
  moduleNumber: number;
  existingTranscript: Array<{ role: string; content: string; timestamp?: string }>;
  onSave: (data: { aiTranscript: Array<{ role: string; content: string }> }) => void;
  onComplete: () => void;
  onSwitchToForm: () => void;
}

export default function AIChatInterface({
  config,
  moduleContext,
  moduleNumber,
  existingTranscript,
  onSave,
  onComplete,
  onSwitchToForm,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>
  >(
    existingTranscript.length > 0
      ? existingTranscript.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
        }))
      : [
          {
            role: 'assistant',
            content: `Hello! I'm here to help you complete ${config.title}. I'll ask you some questions to understand your current situation. Let's start - can you tell me a bit about where you are right now with ${config.title.toLowerCase()}?`,
            timestamp: new Date().toISOString(),
          },
        ]
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      const response = await apiService.chat(conversationMessages, moduleNumber, moduleContext);

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">{config.title}</h2>
          <button
            onClick={onSwitchToForm}
            className="text-sm text-primary hover:underline"
          >
            Switch to Form
          </button>
        </div>
        <p className="text-secondary">{config.description}</p>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4" style={{ height: '500px', overflowY: 'auto' }}>
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

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            disabled={loading}
          />
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              onClick={onComplete}
              className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
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

