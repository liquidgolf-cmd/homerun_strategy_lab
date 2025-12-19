import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import VideoPlaceholder from './VideoPlaceholder';
import logo from '../assets/LoamStrategy4Logo.png';

export default function MainPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
        setName(parsed.user?.name || '');
        setEmail(parsed.user?.email || '');
      } catch (e) {
        console.error('Error parsing saved session:', e);
      }
    }
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      alert('Please enter your name and email');
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.createSession(email, name);
      localStorage.setItem('session', JSON.stringify(data));
      setSession(data);
      // Navigate to current module or module 0
      navigate(`/module/${data.session.currentModule}`);
    } catch (error: any) {
      console.error('Error creating session:', error);
      alert('Error starting session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (session) {
      navigate(`/module/${session.session.currentModule}`);
    }
  };

  const handleModuleClick = (moduleNumber: number) => {
    if (session && moduleNumber <= session.session.currentModule) {
      navigate(`/module/${moduleNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4">
            <img
              src={logo}
              alt="Loam Strategy"
              className="h-16 mx-auto mb-4"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Homeruns Strategy Lab</h1>
          <p className="text-xl text-secondary">
            A structured approach to clarifying your business strategy
          </p>
        </header>

        {/* Video Placeholder */}
        <div className="mb-12 max-w-4xl mx-auto">
          <VideoPlaceholder />
        </div>

        {/* Login/Start Form */}
        {!session ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Get Started</h2>
            <form onSubmit={handleStart}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Starting...' : 'Start Course'}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Welcome back, {name}!</h2>
              <p className="text-secondary mb-6">
                Progress: {session.session.completionStatus} of 5 modules completed
              </p>
              <button
                onClick={handleContinue}
                className="bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors"
              >
                Continue to Module {session.session.currentModule}
              </button>
            </div>

            {/* Module List */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { num: 0, title: 'Current Reality', subtitle: 'At Bat' },
                { num: 1, title: 'Ideal Customer', subtitle: '1st Base' },
                { num: 2, title: 'Core Offer', subtitle: '2nd Base' },
                { num: 3, title: 'Delivery Path', subtitle: '3rd Base' },
                { num: 4, title: '90-Day Plan', subtitle: 'Home' },
              ].map((module) => {
                const isAvailable = session.session.currentModule >= module.num;
                const isCompleted = session.session.completionStatus > module.num;
                return (
                  <button
                    key={module.num}
                    onClick={() => handleModuleClick(module.num)}
                    disabled={!isAvailable}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      isCompleted
                        ? 'bg-green-50 border-green-500'
                        : isAvailable
                        ? 'bg-white border-primary hover:shadow-lg cursor-pointer'
                        : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-sm font-semibold text-primary mb-1">
                      Module {module.num}
                    </div>
                    <div className="font-bold text-lg mb-1">{module.title}</div>
                    <div className="text-sm text-secondary">{module.subtitle}</div>
                    {isCompleted && (
                      <div className="mt-2 text-green-600 text-sm font-medium">✓ Completed</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

