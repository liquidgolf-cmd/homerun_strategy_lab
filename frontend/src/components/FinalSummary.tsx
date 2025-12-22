import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export default function FinalSummary() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [documents, setDocuments] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

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
    setLoading(false);
  };

  const handleGenerate = async () => {
    // MVP: Final documents not available yet (need all modules)
    alert('Final documents generation will be available after all modules are complete (coming soon in MVP)');
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              You've completed all 5 modules of the Homeruns Strategy Lab
            </p>
          </div>

          {!documents ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-lg text-secondary mb-6">
                Ready to generate your final overview and 90-day action plan?
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Final Documents'}
              </button>
            </div>
          ) : (
            <>
              {/* Combined Overview */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-primary">Combined Overview</h2>
                  <button
                    onClick={() =>
                      handleDownload(
                        documents.combinedOverviewDocument,
                        'combined-overview.md'
                      )
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Download
                  </button>
                </div>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {documents.combinedOverviewDocument}
                  </div>
                </div>
              </div>

              {/* 90-Day Action Plan */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-primary">90-Day Action Plan</h2>
                  <button
                    onClick={() =>
                      handleDownload(documents.actionPlanDocument, '90-day-action-plan.md')
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Download
                  </button>
                </div>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {documents.actionPlanDocument}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
                  >
                    Regenerate Documents
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
