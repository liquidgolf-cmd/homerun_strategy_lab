import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';

export default function FinalSummary() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [combinedOverview, setCombinedOverview] = useState<string>('');
  const [actionPlan, setActionPlan] = useState<string>('');
  const overviewContentRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadOverviewPDF = async () => {
    if (!combinedOverview) return;

    // Convert markdown to HTML first
    const htmlContent = await marked(combinedOverview);
    
    // Create a temporary div to parse and style the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });
    
    const pageWidth = 8.5;
    const pageHeight = 11;
    const margin = 0.5;
    const contentWidth = pageWidth - (2 * margin);
    const maxHeight = pageHeight - (2 * margin);
    let yPosition = margin;
    
    // Add header
    pdf.setFontSize(20);
    pdf.setTextColor(15, 71, 97); // #0f4761
    pdf.setFont('helvetica', 'bold');
    pdf.text('Combined Overview', margin, yPosition);
    yPosition += 0.3;
    
    pdf.setFontSize(10);
    pdf.setTextColor(102, 102, 102); // #666
    pdf.setFont('helvetica', 'normal');
    pdf.text('Homerun Strategy Lab - Final Summary', margin, yPosition);
    yPosition += 0.15;
    pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, yPosition);
    yPosition += 0.25;
    
    // Draw line
    pdf.setDrawColor(15, 71, 97);
    pdf.setLineWidth(0.01);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 0.2;
    
    // Function to replace emoji/icons with text equivalents for PDF
    const replaceIconsWithText = (text: string): string => {
      let replaced = text;
      replaced = replaced.replace(/🟢|✅|✔|☑|✓/g, '[OK]');
      replaced = replaced.replace(/🔴|❌|✗|✘|✕/g, '[X]');
      replaced = replaced.replace(/🟡/g, '[!]');
      replaced = replaced.replace(/⚠|⚠️/g, '[!]');
      replaced = replaced.replace(/💡|💭|💬|💡️/g, '[IDEA]');
      replaced = replaced.replace(/🎯|📍|🔖/g, '[GOAL]');
      replaced = replaced.replace(/⭐|🌟|✨/g, '*');
      replaced = replaced.replace(/⚫|⚪|🔵|🟡|🟠|🟣/g, '•');
      replaced = replaced.replace(/→/g, '->');
      replaced = replaced.replace(/←/g, '<-');
      replaced = replaced.replace(/↑/g, '^');
      replaced = replaced.replace(/↓/g, 'v');
      replaced = replaced.replace(/⇒/g, '=>');
      replaced = replaced.replace(/⇐/g, '<=');
      replaced = replaced.replace(/[\u{1F300}-\u{1F9FF}]/gu, '[ICON]');
      replaced = replaced.replace(/[\u{2600}-\u{26FF}]/gu, '[SYMBOL]');
      replaced = replaced.replace(/[\u{2700}-\u{27BF}]/gu, '[SYMBOL]');
      replaced = replaced.replace(/[\u{1F000}-\u{1F02F}]/gu, '[SYMBOL]');
      return replaced;
    };
    
    // Function to clean text
    const cleanText = (text: string): string => {
      const temp = document.createElement('div');
      temp.innerHTML = text;
      let cleaned = temp.textContent || temp.innerText || text;
      cleaned = cleaned.replace(/<[^>]*>/g, '');
      cleaned = cleaned.replace(/&[#\w]+;/g, (entity) => {
        const temp2 = document.createElement('div');
        temp2.innerHTML = entity;
        return temp2.textContent || entity;
      });
      cleaned = replaceIconsWithText(cleaned);
      cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
      cleaned = cleaned.replace(/[ \t]+/g, ' ');
      return cleaned.trim();
    };
    
    // Function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [55, 65, 81]) => {
      const cleanedText = cleanText(text);
      if (!cleanedText) return;
      
      pdf.setFontSize(fontSize);
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(cleanedText, contentWidth);
      
      for (let i = 0; i < lines.length; i++) {
        if (yPosition + 0.2 > maxHeight) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(lines[i], margin, yPosition);
        yPosition += fontSize / 72 + 0.1;
      }
    };
    
    // Process HTML elements recursively (same as AuditReview)
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          addText(text, 12, false);
          yPosition += 0.05;
        }
        return;
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      if (tagName === 'h1') {
        if (yPosition > margin + 0.3) yPosition += 0.2;
        const text = element.textContent?.trim() || '';
        if (text) {
          addText(text, 18, true, [15, 71, 97]);
          yPosition += 0.15;
        }
      } else if (tagName === 'h2') {
        if (yPosition > margin + 0.3) yPosition += 0.15;
        const text = element.textContent?.trim() || '';
        if (text) {
          addText(text, 16, true, [15, 71, 97]);
          yPosition += 0.1;
        }
      } else if (tagName === 'h3') {
        if (yPosition > margin + 0.3) yPosition += 0.1;
        const text = element.textContent?.trim() || '';
        if (text) {
          addText(text, 14, true, [17, 24, 39]);
          yPosition += 0.08;
        }
      } else if (tagName === 'p') {
        const text = element.textContent?.trim() || '';
        if (text) {
          addText(text, 12, false);
          yPosition += 0.08;
        }
      } else if (tagName === 'ul') {
        const items = Array.from(element.querySelectorAll(':scope > li'));
        items.forEach((item) => {
          const text = item.textContent?.trim() || '';
          if (text) {
            addText('• ' + text, 12, false);
            yPosition += 0.05;
          }
        });
        yPosition += 0.05;
      } else if (tagName === 'ol') {
        const items = Array.from(element.querySelectorAll(':scope > li'));
        items.forEach((item, index) => {
          const text = item.textContent?.trim() || '';
          if (text) {
            addText(`${index + 1}. ${text}`, 12, false);
            yPosition += 0.05;
          }
        });
        yPosition += 0.05;
      } else if (tagName === 'strong' || tagName === 'b') {
        const text = element.textContent?.trim() || '';
        if (text) {
          addText(text, 12, true);
        }
      } else {
        Array.from(element.childNodes).forEach(child => processNode(child));
      }
    };
    
    // Process all top-level elements
    Array.from(tempDiv.childNodes).forEach(child => processNode(child));
    
    // If no structured content, add the text directly
    if (tempDiv.children.length === 0 && tempDiv.textContent?.trim()) {
      addText(tempDiv.textContent.trim(), 12, false);
    }
    
    // Save PDF
    pdf.save('combined-overview.pdf');
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
              <div className="border-b border-gray-200 bg-gray-50 px-8 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary">Combined Overview</h2>
                <button
                  onClick={handleDownloadOverviewPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
              <div className="p-8">
                <div ref={overviewContentRef} className="prose prose-lg prose-slate max-w-none 
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
