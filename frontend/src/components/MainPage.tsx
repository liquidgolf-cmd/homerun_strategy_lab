import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { supabase } from '../lib/supabase';
import VideoEmbed from './VideoEmbed';
import VideoPlaceholder from './VideoPlaceholder';
import { introConfig } from '../config/intro';

export default function MainPage() {
  const navigate = useNavigate();
  const { user, session: authSession, loading: authLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [appSession, setAppSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'choose' | 'email-signin' | 'email-signup'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoadingState, setAuthLoadingState] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // When user is authenticated, get or create app session
  useEffect(() => {
    if (user && authSession && !appSession && !loading) {
      loadAppSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authSession]);

  const loadAppSession = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Loading app session...');
      const data = await apiService.getSession();
      console.log('Session data received:', data);
      if (data && data.session) {
        setAppSession(data);
        console.log('App session set successfully');
      } else {
        console.error('Session data missing session object:', data);
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      // If error, user might not be fully set up, but that's OK
      // Show error to user for debugging
      if (error.response?.status === 401) {
        console.error('Authentication error - token may be invalid');
      } else if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        console.error('Backend not found or not accessible - check VITE_API_URL');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
      // After sign-in, the useEffect will call loadAppSession
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setAuthError(error.message || 'Error signing in with Google. Please try again.');
    }
  };

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    try {
      setAuthError(null);
      setAuthLoadingState(true);
      await signInWithEmail(email, password);
      // After sign-in, the useEffect will call loadAppSession
      // Clear form on success
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      setAuthError(error.message || 'Error signing in. Please check your email and password.');
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    try {
      setAuthError(null);
      setAuthLoadingState(true);
      await signUpWithEmail(email, password, name || undefined);
      // Check if we got a session (email confirmation might be disabled)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Email confirmation disabled - user is signed in
        setAuthError(null);
        setEmail('');
        setPassword('');
        setName('');
      } else {
        // Email confirmation required
        setAuthError('Sign up successful! Please check your email to verify your account before signing in.');
      }
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      setAuthError(error.message || 'Error signing up. Please try again.');
    } finally {
      setAuthLoadingState(false);
    }
  };

  const handleContinue = () => {
    if (appSession?.session) {
      navigate(`/module/${appSession.session.currentModule || 0}`);
    }
  };

  const handleModuleClick = (moduleNumber: number) => {
    const currentModule = appSession?.session?.currentModule || 0;
    // Allow access to current module or any completed module
    if (appSession?.session && moduleNumber <= currentModule) {
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
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-8 md:mb-12">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="relative text-center py-8 md:py-12">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-primary font-semibold text-sm">Strategic Business Planning Made Simple</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 md:mb-6 leading-tight">{introConfig.hero.title}</h1>
            <p className="text-xl md:text-2xl text-secondary px-2 max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12">
              {introConfig.hero.subtitle}
            </p>
            
            {/* Quick stats or benefits */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center mt-6 md:mt-8">
              <div className="flex flex-col items-center animate-[fadeInUp_0.6s_ease-out_0.2s_both] min-w-[100px]">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 transform hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">5</div>
                <div className="text-sm md:text-base text-secondary">Strategic Modules</div>
              </div>
              <div className="flex flex-col items-center animate-[fadeInUp_0.6s_ease-out_0.4s_both] min-w-[100px]">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 transform hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">90</div>
                <div className="text-sm md:text-base text-secondary">Day Action Plan</div>
              </div>
              <div className="flex flex-col items-center animate-[fadeInUp_0.6s_ease-out_0.6s_both] min-w-[100px]">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 transform hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">AI</div>
                <div className="text-sm md:text-base text-secondary">Guided Coaching</div>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Video - Always show, with placeholder if no URL */}
        <div className="mb-8 md:mb-16 max-w-5xl mx-auto px-4">
          {introConfig.videoUrl ? (
            <VideoEmbed videoUrl={introConfig.videoUrl} title="Introduction Video" />
          ) : (
            <VideoPlaceholder />
          )}
        </div>

        {/* Instructional Content */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-12 space-y-6 md:space-y-8 px-4">
          {/* What You'll See */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">{introConfig.whatYoullSee.title}</h2>
                <p className="text-secondary leading-relaxed text-sm md:text-base">{introConfig.whatYoullSee.content}</p>
              </div>
            </div>
          </div>

          {/* What You Need to Do */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">{introConfig.whatToDo.title}</h2>
                <p className="text-secondary leading-relaxed text-sm md:text-base">{introConfig.whatToDo.content}</p>
              </div>
            </div>
          </div>

          {/* What You Can Expect to Get */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">{introConfig.whatToExpect.title}</h2>
                <p className="text-secondary leading-relaxed text-sm md:text-base">{introConfig.whatToExpect.content}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Preview Section - For unauthenticated users */}
        {!user && (
          <div className="max-w-6xl mx-auto mb-12 md:mb-16 px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-primary text-center mb-3 md:mb-6">Your Journey to Clarity</h2>
            <p className="text-center text-secondary mb-6 md:mb-12 max-w-2xl mx-auto text-sm md:text-base px-4">
              Work through five strategic modules, each building on the last, to create a comprehensive strategy tailored to your business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              {[
                { num: 0, title: 'Current Reality', subtitle: 'At Bat', icon: '🎯', description: 'Understand where you are' },
                { num: 1, title: 'Ideal Customer', subtitle: '1st Base', icon: '👥', description: 'Define who you serve' },
                { num: 2, title: 'Core Offer', subtitle: '2nd Base', icon: '💎', description: 'Clarify what they want' },
                { num: 3, title: 'Delivery Path', subtitle: '3rd Base', icon: '🚀', description: 'Map how you deliver' },
                { num: 4, title: '90-Day Plan', subtitle: 'Home', icon: '🏆', description: 'Create your action plan' },
              ].map((module) => (
                <div key={module.num} className="bg-white rounded-lg p-5 md:p-6 border-2 border-gray-200 text-center hover:border-primary hover:shadow-lg active:scale-[0.98] transition-all duration-300 group touch-manipulation">
                  <div className="text-4xl md:text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{module.icon}</div>
                  <div className="text-xs font-semibold text-primary mb-1">Module {module.num}</div>
                  <div className="font-bold text-sm md:text-base mb-1 text-gray-900">{module.title}</div>
                  <div className="text-xs md:text-sm text-secondary mb-2">{module.subtitle}</div>
                  <div className="text-xs text-gray-500 mt-2">{module.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Benefits Section - For unauthenticated users */}
        {!user && (
          <div className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-6 md:p-12 border border-primary/10">
              <h2 className="text-xl md:text-3xl font-bold text-primary text-center mb-6 md:mb-8">Why This Approach Works</h2>
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">No More Guessing</h3>
                  <p className="text-secondary text-sm">Follow a proven framework that eliminates confusion and gives you confidence in every decision</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Personalized Strategy</h3>
                  <p className="text-secondary text-sm">Get expert-level insights and recommendations specifically tailored to your unique business situation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Ready to Execute</h3>
                  <p className="text-secondary text-sm">Leave with a concrete 90-day roadmap that you can start implementing the moment you finish</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Section - For unauthenticated users */}
        {!user && introConfig.testimonials.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8 md:mb-12">What Others Are Saying</h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {introConfig.testimonials.map((testimonial, index) => {
                const rating = testimonial.rating ?? 5;
                return (
                  <div key={index} className="bg-white rounded-lg p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      {[...Array(rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-secondary">
                        {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Section - For unauthenticated users */}
        {!user && introConfig.faqs && introConfig.faqs.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-primary text-center mb-6 md:mb-12">Frequently Asked Questions</h2>
            <div className="space-y-3 md:space-y-4">
              {introConfig.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md active:shadow-sm transition-shadow duration-300 touch-manipulation"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-4 py-4 md:px-8 md:py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset group min-h-[60px] md:min-h-[72px]"
                  >
                    <span className="font-semibold text-gray-900 text-sm md:text-lg pr-8 group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-primary flex-shrink-0 transform transition-transform duration-300 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 md:px-8 pb-4 md:pb-5 pt-0">
                      <p className="text-secondary leading-relaxed text-sm md:text-base">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign In / Session View */}
        {!user ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-100">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Get Started Today</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Join entrepreneurs building clearer, more strategic businesses
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <p className="text-red-700 text-sm">{authError}</p>
                </div>
              )}

              {authMode === 'choose' && (
                <div className="space-y-4">
                  <button
                    onClick={handleSignInWithGoogle}
                    disabled={authLoadingState}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-4 md:py-3.5 px-6 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px]"
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
                    Continue with Google
                  </button>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAuthMode('email-signin')}
                    className="w-full py-4 md:py-3.5 px-6 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm touch-manipulation min-h-[48px]"
                  >
                    Sign in with Email
                  </button>
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setAuthMode('email-signup')}
                      className="text-sm text-secondary hover:text-primary transition-colors underline"
                    >
                      Don't have an account? Sign up
                    </button>
                  </div>
                </div>
              )}

            {authMode === 'email-signin' && (
              <form onSubmit={handleSignInWithEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoadingState}
                  className="w-full py-4 md:py-3.5 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation min-h-[48px]"
                >
                  {authLoadingState ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('choose');
                    setEmail('');
                    setPassword('');
                    setAuthError(null);
                  }}
                  className="w-full py-2 text-gray-600 hover:text-primary transition-colors text-sm"
                >
                  Back
                </button>
              </form>
            )}

            {authMode === 'email-signup' && (
              <form onSubmit={handleSignUpWithEmail} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="•••••••• (min 6 characters)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoadingState}
                  className="w-full py-4 md:py-3.5 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation min-h-[48px]"
                >
                  {authLoadingState ? 'Signing up...' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('choose');
                    setEmail('');
                    setPassword('');
                    setName('');
                    setAuthError(null);
                  }}
                  className="w-full py-2 text-gray-600 hover:text-primary transition-colors text-sm"
                >
                  Back
                </button>
              </form>
            )}
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Self-Paced</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>No Credit Card Required</span>
                </div>
              </div>
            </div>
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
                    {appSession.session.completionStatus >= 5
                      ? 'All modules completed! View your final summary.'
                      : appSession.session.completionStatus > 0
                      ? `Continue with Module ${appSession.session.currentModule}`
                      : 'Start with Module 0: Current Reality'}
                  </p>
                  <button
                    onClick={handleContinue}
                    className="bg-primary text-white py-4 md:py-3.5 px-6 rounded-lg font-medium hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm touch-manipulation min-h-[48px]"
                  >
                    {appSession.session.completionStatus >= 5
                      ? 'View Final Summary'
                      : appSession.session.completionStatus > appSession.session.currentModule
                      ? `Review Module ${appSession.session.currentModule}`
                      : `Start Module ${appSession.session.currentModule}`}
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
                  const currentModule = appSession.session.currentModule || 0;
                  const completionStatus = appSession.session.completionStatus || 0;
                  // Module is available if it's the current module or a completed module
                  const isAvailable = module.num <= currentModule;
                  const isCompleted = module.num < completionStatus;
                return (
                  <button
                    key={module.num}
                    onClick={() => isAvailable && handleModuleClick(module.num)}
                    disabled={!isAvailable}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      isCompleted
                        ? 'bg-green-50 border-green-500 hover:shadow-lg cursor-pointer'
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
                    {!isAvailable && (
                      <div className="mt-2 text-gray-500 text-xs font-medium">Locked</div>
                    )}
                    {isCompleted && (
                      <div className="mt-2 text-green-600 text-sm font-medium">✓ Completed</div>
                    )}
                    {isAvailable && !isCompleted && module.num === currentModule && (
                      <div className="mt-2 text-primary text-sm font-medium">Continue →</div>
                    )}
                  </button>
                );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 mt-16 md:mt-24">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Loam Strategy, LLC</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Transform your business clarity with a proven, step-by-step strategy framework designed to help you achieve your goals.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">About</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                <p>© {new Date().getFullYear()} Loam Strategy, LLC. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

