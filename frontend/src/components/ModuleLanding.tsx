import { useNavigate } from 'react-router-dom';
import type { ModuleConfig } from '../types';
import VideoEmbed from './VideoEmbed';
import VideoPlaceholder from './VideoPlaceholder';

interface ModuleLandingProps {
  config: ModuleConfig;
  moduleContext: string;
  onSelectInputMethod: (method: 'ai' | 'form') => void;
}

export default function ModuleLanding({
  config,
  moduleContext: _moduleContext,
  onSelectInputMethod,
}: ModuleLandingProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-4">
          <span className="text-sm font-semibold text-primary">
            Module {config.number}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">{config.title}</h1>
        <p className="text-lg text-secondary leading-relaxed">{config.description}</p>
      </div>

      {/* Module Video */}
      <div className="mb-8">
        {config.videoUrl ? (
          <VideoEmbed videoUrl={config.videoUrl} />
        ) : (
          <VideoPlaceholder />
        )}
      </div>

      {/* Input Method Selection */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Choose Your Input Method
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Chat Option */}
          <button
            onClick={() => onSelectInputMethod('ai')}
            className="p-6 border-2 border-primary rounded-lg hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-dark transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary">AI Chat Interview</h3>
            </div>
            <p className="text-secondary mb-4">
              Have a guided conversation with an AI business strategy coach. The AI will ask
              you questions to gather all necessary information for this module.
            </p>
            <div className="text-sm text-primary font-medium">Start Conversation →</div>
          </button>

          {/* Manual Form Option */}
          <button
            onClick={() => onSelectInputMethod('form')}
            className="p-6 border-2 border-primary rounded-lg hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-dark transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary">Manual Workbook</h3>
            </div>
            <p className="text-secondary mb-4">
              Fill out a structured form with all the questions for this module. You can work
              at your own pace and save your progress.
            </p>
            <div className="text-sm text-primary font-medium">Fill Out Form →</div>
          </button>
        </div>
      </div>
    </div>
  );
}

