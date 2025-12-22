import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export default function FinalSummary() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/');
      } else {
        loadSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  useEffect(() => {
    if (session) {
      loadDocuments();
    }
  }, [session]);

  const loadSession = async () => {
    try {
      const data = await apiService.getSession();
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      navigate('/');
    }
  };

  const loadDocuments = async () => {
    // MVP: Final documents not available yet (need all modules)
    // This component is disabled in MVP
    console.log('Final documents not available in MVP');
    
    // Verify that all modules are actually completed
    if (session?.session) {
      const completionStatus = session.session.completionStatus || 0;
      if (completionStatus < 5) {
        // Not all modules completed - redirect to current module
        console.log(`Only ${completionStatus} modules completed, redirecting to module ${session.session.currentModule}`);
        navigate(`/module/${session.session.currentModule || 0}`);
        return;
      }
    }
    
    setLoading(false);
  };



  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Congratulations!</h1>
            <p className="text-xl text-secondary">
              You've completed all 5 modules of the Homerun Strategy Lab
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-lg text-secondary mb-6">
              Final documents generation will be available after all modules are complete.
            </p>
            <p className="text-gray-600 mb-6">
              Currently, only Module 0 (Current Reality) is available in the MVP.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
