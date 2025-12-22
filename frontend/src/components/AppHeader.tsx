import { useTTS } from '../contexts/TTSContext';
import logo from '../assets/LoamStrategy4Logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AppHeader() {
  const { ttsEnabled, toggleTTS } = useTTS();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-4">
        {/* Mobile Layout: Stacked */}
        <div className="md:hidden">
          {/* Top Row: Back button and TTS toggle */}
          <div className="flex items-center justify-between mb-2">
            {!isHomePage && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1"
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
                Back
              </button>
            )}
            {isHomePage && <div />}
            {/* TTS Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">TTS</span>
              <button
                type="button"
                onClick={toggleTTS}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                  ttsEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-pressed={ttsEnabled}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    ttsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
          {/* Bottom Row: Logo and Title */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Loam Strategy"
              className="h-8"
            />
            <h1 className="text-base font-bold text-primary leading-tight">Homerun Strategy Lab</h1>
          </div>
        </div>

        {/* Desktop Layout: Side by side */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            {!isHomePage && (
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
            )}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Loam Strategy"
                className="h-10"
              />
              <h1 className="text-xl font-bold text-primary">Homerun Strategy Lab</h1>
            </div>
          </div>

          {/* TTS Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Text-to-Speech</span>
            <button
              type="button"
              onClick={toggleTTS}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                ttsEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-pressed={ttsEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

