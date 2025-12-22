import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

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

  const handleDownloadPDF = () => {
    if (!pdfContentRef.current) return;

    // Use the actual rendered content from the DOM
    const sourceElement = pdfContentRef.current;
    
    // Create a container for PDF with header
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '816px';
    pdfContainer.style.padding = '40px';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '0';
    pdfContainer.style.top = '0';
    
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
    
    // Deep clone the source element with all its computed styles
    const clone = sourceElement.cloneNode(true) as HTMLElement;
    
    // Apply inline styles based on computed styles
    const applyInlineStyles = (element: HTMLElement) => {
      const computed = window.getComputedStyle(element);
      
      // Copy important styles
      element.style.color = computed.color;
      element.style.fontSize = computed.fontSize;
      element.style.fontFamily = computed.fontFamily;
      element.style.fontWeight = computed.fontWeight;
      element.style.lineHeight = computed.lineHeight;
      element.style.margin = computed.margin;
      element.style.marginTop = computed.marginTop;
      element.style.marginBottom = computed.marginBottom;
      element.style.marginLeft = computed.marginLeft;
      element.style.marginRight = computed.marginRight;
      element.style.padding = computed.padding;
      element.style.backgroundColor = computed.backgroundColor;
      element.style.maxWidth = 'none';
      element.style.width = '100%';
      
      // Process all children
      Array.from(element.children).forEach(child => {
        applyInlineStyles(child as HTMLElement);
      });
    };
    
    applyInlineStyles(clone);
    pdfContainer.appendChild(clone);
    
    // Add to body - position at top of viewport but make it small
    pdfContainer.style.top = '0';
    pdfContainer.style.height = 'auto';
    pdfContainer.style.overflow = 'visible';
    document.body.appendChild(pdfContainer);
    
    // Force a reflow to ensure rendering
    const height = pdfContainer.offsetHeight;
    console.log('PDF container height:', height);
    console.log('PDF container has content:', pdfContainer.textContent?.length || 0, 'characters');
    
    // Generate PDF after a short delay to ensure rendering
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



