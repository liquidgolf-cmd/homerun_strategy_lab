import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { moduleConfigs, moduleContexts } from '../modules';
import ModuleLanding from './ModuleLanding';
import AIChatInterface from './AIChatInterface';
import ManualForm from './ManualForm';
import AuditReview from './AuditReview';

type ViewState = 'landing' | 'input' | 'review';

export default function ModulePage() {
  const { moduleNumber } = useParams<{ moduleNumber: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const moduleNum = parseInt(moduleNumber || '0');
  const config = moduleConfigs[moduleNum];
  const moduleContext = moduleContexts[moduleNum];

  const [viewState, setViewState] = useState<ViewState>('landing');
  const [inputMethod, setInputMethod] = useState<'ai' | 'form' | null>(null);
  const [session, setSession] = useState<any>(null);
  const [moduleResponse, setModuleResponse] = useState<any>(null);
  const [auditReview, setAuditReview] = useState<string>('');
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
      loadModuleResponse();
    }
  }, [session, moduleNum]);

  const loadSession = async () => {
    try {
      const data = await apiService.getSession();
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadModuleResponse = async () => {
    if (!session) return;

    try {
      const response = await apiService.getModuleResponse(session.session.id, moduleNum);
      setModuleResponse(response);

      if (response.completedAt && response.auditReviewDocument) {
        setAuditReview(response.auditReviewDocument);
        setViewState('review');
      } else if (response.inputMethod) {
        setInputMethod(response.inputMethod);
        setViewState('input');
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error loading module response:', error);
      }
      // 404 is expected if no response exists yet
    }
  };

  const handleInputMethodSelect = (method: 'ai' | 'form') => {
    setInputMethod(method);
    setViewState('input');
  };

  const handleDataSave = async (data: {
    aiTranscript?: Array<{ role: string; content: string }>;
    formData?: Record<string, any>;
  }) => {
    if (!session) return;

    try {
      await apiService.saveModuleResponse(
        session.session.id,
        moduleNum,
        inputMethod!,
        data
      );
      setModuleResponse({ ...moduleResponse, ...data, inputMethod });
    } catch (error) {
      console.error('Error saving module data:', error);
      alert('Error saving. Please try again.');
    }
  };

  const handleGenerateAudit = async () => {
    if (!session || !moduleResponse) return;

    setLoading(true);
    try {
      const review = await apiService.generateAuditReview(
        moduleNum,
        moduleResponse.aiTranscript,
        moduleResponse.formData
      );
      setAuditReview(review);

      // Save audit review
      await apiService.saveAuditReview(session.session.id, moduleNum, review);

      setViewState('review');
    } catch (error) {
      console.error('Error generating audit review:', error);
      alert('Error generating audit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextModule = () => {
    if (moduleNum < 4) {
      navigate(`/module/${moduleNum + 1}`);
      setViewState('landing');
      setInputMethod(null);
    } else {
      // All modules complete, go to summary
      navigate('/summary');
    }
  };

  if (loading && !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!config) {
    return <div>Invalid module</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {viewState === 'landing' && (
          <ModuleLanding
            config={config}
            moduleContext={moduleContext}
            onSelectInputMethod={handleInputMethodSelect}
          />
        )}

        {viewState === 'input' && inputMethod === 'ai' && (
          <AIChatInterface
            config={config}
            moduleContext={moduleContext}
            moduleNumber={moduleNum}
            existingTranscript={moduleResponse?.aiTranscript || []}
            onSave={handleDataSave}
            onComplete={handleGenerateAudit}
            onSwitchToForm={() => {
              setInputMethod('form');
              setViewState('input');
            }}
          />
        )}

        {viewState === 'input' && inputMethod === 'form' && (
          <ManualForm
            config={config}
            existingData={moduleResponse?.formData || {}}
            onSave={handleDataSave}
            onComplete={handleGenerateAudit}
            onSwitchToAI={() => {
              setInputMethod('ai');
              setViewState('input');
            }}
          />
        )}

        {viewState === 'review' && (
          <AuditReview
            moduleNumber={moduleNum}
            moduleTitle={config.title}
            auditReview={auditReview}
            onNext={handleNextModule}
            isLastModule={moduleNum === 4}
          />
        )}
      </div>
    </div>
  );
}

