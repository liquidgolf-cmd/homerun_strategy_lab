import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';

interface AuditReviewProps {
  moduleNumber: number;
  moduleTitle: string;
  auditReview: string;
  onNext: () => void;
  isLastModule: boolean;
}

export default function AuditReview({
  moduleNumber,
  moduleTitle,
  auditReview,
  onNext,
  isLastModule,
}: AuditReviewProps) {
  const navigate = useNavigate();
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    // Convert markdown to HTML with inline styles
    const htmlContent = await marked(auditReview);
    
    // Create a container for PDF generation
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '816px'; // 8.5in in pixels
    pdfContainer.style.padding = '40px';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    pdfContainer.style.fontSize = '16px';
    pdfContainer.style.lineHeight = '1.75';
    pdfContainer.style.color = '#374151';
    
    // Add header
    const header = document.createElement('div');
    header.style.marginBottom = '30px';
    header.style.paddingBottom = '20px';
    header.style.borderBottom = '3px solid #0f4761';
    header.innerHTML = `
      <h1 style="font-size: 28px; font-weight: bold; color: #0f4761; margin-bottom: 8px; margin-top: 0;">${moduleTitle}</h1>
      <p style="font-size: 14px; color: #666; margin: 4px 0;">Module ${moduleNumber} Audit Review</p>
      <p style="font-size: 14px; color: #666; margin: 4px 0;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    `;
    pdfContainer.appendChild(header);
    
    // Add content with styled wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = htmlContent;
    
    // Apply styles to common markdown elements
    const styleElement = (el: Element) => {
      const tagName = el.tagName.toLowerCase();
      const style = (el as HTMLElement).style;
      
      if (tagName === 'h1') {
        style.fontSize = '32px';
        style.fontWeight = 'bold';
        style.color = '#0f4761';
        style.marginTop = '32px';
        style.marginBottom = '16px';
        style.borderBottom = '1px solid #e5e7eb';
        style.paddingBottom = '12px';
      } else if (tagName === 'h2') {
        style.fontSize = '24px';
        style.fontWeight = 'bold';
        style.color = '#0f4761';
        style.marginTop = '32px';
        style.marginBottom = '16px';
      } else if (tagName === 'h3') {
        style.fontSize = '20px';
        style.fontWeight = 'bold';
        style.color = '#111827';
        style.marginTop = '24px';
        style.marginBottom = '12px';
      } else if (tagName === 'p') {
        style.marginBottom = '16px';
        style.color = '#374151';
        style.lineHeight = '1.75';
      } else if (tagName === 'ul' || tagName === 'ol') {
        style.marginLeft = '24px';
        style.marginBottom = '16px';
        style.paddingLeft = '0';
      } else if (tagName === 'li') {
        style.marginBottom = '8px';
        style.color = '#374151';
      } else if (tagName === 'strong') {
        style.fontWeight = '600';
        style.color = '#111827';
      } else if (tagName === 'code') {
        style.backgroundColor = '#f3f4f6';
        style.color = '#0f4761';
        style.padding = '2px 6px';
        style.borderRadius = '4px';
        style.fontSize = '14px';
      } else if (tagName === 'blockquote') {
        style.borderLeft = '4px solid #0f4761';
        style.paddingLeft = '16px';
        style.marginLeft = '0';
        style.marginTop = '16px';
        style.marginBottom = '16px';
        style.fontStyle = 'italic';
        style.color = '#4b5563';
      }
      
      // Process children
      Array.from(el.children).forEach(child => styleElement(child));
    };
    
    // Style all elements
    Array.from(contentWrapper.children).forEach(child => styleElement(child));
    // Also style nested elements
    contentWrapper.querySelectorAll('*').forEach(el => styleElement(el));
    
    pdfContainer.appendChild(contentWrapper);
    
    // Position off-screen but visible for html2canvas
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.top = '0';
    pdfContainer.style.left = '0';
    pdfContainer.style.zIndex = '99999';
    document.body.appendChild(pdfContainer);
    
    // Wait for rendering
    setTimeout(() => {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `module-${moduleNumber}-audit-review.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
      };

      html2pdf()
        .set(opt)
        .from(pdfContainer)
        .save()
        .then(() => {
          // Clean up
          if (document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
          }
        })
        .catch((error) => {
          console.error('PDF generation error:', error);
          // Clean up on error
          if (document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
          }
        });
    }, 500);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="mb-4">
          <span className="text-sm font-semibold text-primary">
            Module {moduleNumber} Complete
          </span>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">{moduleTitle}</h1>
        <p className="text-lg text-secondary">
          Here's your module audit review. Review it carefully before proceeding.
        </p>
      </div>

      {/* Audit Review Document */}
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Audit Review Document</h2>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download PDF
          </button>
        </div>
        <div className="p-8">
          <div ref={pdfContentRef} className="prose prose-lg prose-slate max-w-none 
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
            <ReactMarkdown>{auditReview}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(`/module/${moduleNumber}`)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back to Module
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            {isLastModule ? 'View Final Summary →' : 'Next Module →'}
          </button>
        </div>
      </div>
    </div>
  );
}



