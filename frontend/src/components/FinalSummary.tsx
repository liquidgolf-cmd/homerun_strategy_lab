import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function FinalSummary() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [combinedOverview, setCombinedOverview] = useState<string>('');
  const [actionPlan, setActionPlan] = useState<string>('');

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
      checkCompletion();
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

  const checkCompletion = async () => {
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

  const handleGenerateDocuments = async () => {
    setGenerating(true);
    try {
      const result = await apiService.generateFinalDocuments();
      setCombinedOverview(result.combinedOverview);
      setActionPlan(result.actionPlan);
    } catch (error: any) {
      console.error('Error generating final documents:', error);
      alert(error.response?.data?.error || error.message || 'Error generating final documents. Please try again.');
    } finally {
      setGenerating(false);
    }
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

          {!combinedOverview && !actionPlan && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-lg text-secondary mb-6">
                Ready to generate your final strategic documents?
              </p>
              <p className="text-gray-600 mb-6">
                We'll create a Combined Overview and a detailed 90-Day Action Plan based on all your module work.
              </p>
              <button
                onClick={handleGenerateDocuments}
                disabled={generating}
                className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Generating Documents...
                  </>
                ) : (
                  'Generate Final Documents'
                )}
              </button>
            </div>
          )}

          {generating && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Final Documents</h3>
              <p className="text-gray-600">This may take a moment. Please wait while we create your comprehensive overview and action plan.</p>
            </div>
          )}

          {combinedOverview && (
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 mb-8 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
                <h2 className="text-2xl font-bold text-primary">Combined Overview</h2>
              </div>
              <div className="p-8">
                <div className="prose prose-lg prose-slate max-w-none 
                          prose-headings:text-primary prose-headings:font-bold
                          prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3 prose-h1:mb-6
                          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-primary
                          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-900
                          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                          prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-1
                          prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-1
                          prose-li:text-gray-700 prose-li:mb-1
                          prose-strong:text-gray-900 prose-strong:font-semibold
                          prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                          prose-a:text-primary prose-a:underline hover:prose-a:text-primary-dark">
                  <ReactMarkdown>{combinedOverview}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {actionPlan && (
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 mb-8 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
                <h2 className="text-2xl font-bold text-primary">90-Day Action Plan</h2>
              </div>
              <div className="p-8">
                <div className="prose prose-lg prose-slate max-w-none 
                          prose-headings:text-primary prose-headings:font-bold
                          prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3 prose-h1:mb-6
                          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-primary
                          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-900
                          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                          prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-1
                          prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-1
                          prose-li:text-gray-700 prose-li:mb-1
                          prose-strong:text-gray-900 prose-strong:font-semibold
                          prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
                          prose-a:text-primary prose-a:underline hover:prose-a:text-primary-dark">
                  <ReactMarkdown>{actionPlan}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {(combinedOverview || actionPlan) && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
