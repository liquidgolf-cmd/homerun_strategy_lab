import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import VideoPlaceholder from './VideoPlaceholder';
import logo from '../assets/LoamStrategy4Logo.png';

export default function MainPage() {
  const navigate = useNavigate();
  const { user, session: authSession, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [appSession, setAppSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // When user is authenticated, get or create app session
  useEffect(() => {
    if (user && authSession && !appSession) {
      loadAppSession();
    }
  }, [user, authSession]);

  const loadAppSession = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await apiService.getSession();
      setAppSession(data);
    } catch (error: any) {
      console.error('Error loading session:', error);
      // If error, user might not be fully set up, but that's OK
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // After sign-in, the useEffect will call loadAppSession
    } catch (error: any) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    }
  };

  const handleContinue = () => {
    if (appSession?.session) {
      navigate(`/module/${appSession.session.currentModule || 0}`);
    }
  };

  const handleModuleClick = (moduleNumber: number) => {
    if (appSession?.session && moduleNumber <= (appSession.session.currentModule || 0)) {
      navigate(`/module/${moduleNumber}`);
    }
  };

  if (authLoading || (user && !appSession && loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

        {/* Sign In / Session View */}
        {!user ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Sign in with your Google account to begin your strategy journey.
            </p>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Welcome back{appSession?.user?.name ? `, ${appSession.user.name}` : ''}!
                  </h2>
                  {user.email && (
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
                >
                  Sign Out
                </button>
              </div>
              {appSession?.session ? (
                <>
                  <p className="text-secondary mb-6">
                    Progress: {appSession.session.completionStatus || 0} of 5 modules completed
                  </p>
                  <button
                    onClick={handleContinue}
                    className="bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors"
                  >
                    Continue to Module {appSession.session.currentModule || 0}
                  </button>
                </>
              ) : (
                <p className="text-gray-600">Loading your session...</p>
              )}
            </div>

            {/* Module List */}
            {appSession?.session && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { num: 0, title: 'Current Reality', subtitle: 'At Bat' },
                  { num: 1, title: 'Ideal Customer', subtitle: '1st Base' },
                  { num: 2, title: 'Core Offer', subtitle: '2nd Base' },
                  { num: 3, title: 'Delivery Path', subtitle: '3rd Base' },
                  { num: 4, title: '90-Day Plan', subtitle: 'Home' },
                ].map((module) => {
                  const isAvailable = (appSession.session.currentModule || 0) >= module.num;
                  const isCompleted = (appSession.session.completionStatus || 0) > module.num;
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

