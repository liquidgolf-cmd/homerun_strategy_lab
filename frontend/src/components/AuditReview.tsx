import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';

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
    // Convert markdown to HTML first
    const htmlContent = await marked(auditReview);
    
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
    pdf.text(moduleTitle, margin, yPosition);
    yPosition += 0.3;
    
    pdf.setFontSize(10);
    pdf.setTextColor(102, 102, 102); // #666
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Module ${moduleNumber} Audit Review`, margin, yPosition);
    yPosition += 0.15;
    pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, yPosition);
    yPosition += 0.25;
    
    // Draw line
    pdf.setDrawColor(15, 71, 97);
    pdf.setLineWidth(0.01);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 0.2;
    
    // Function to replace emoji/icons with text equivalents for PDF
    // jsPDF has limited Unicode support, so we replace emojis with ASCII equivalents
    const replaceIconsWithText = (text: string): string => {
      let replaced = text;
      
      // Green circles/checkmarks (for patterns) - use ASCII text label
      replaced = replaced.replace(/🟢|✅|✔|☑|✓/g, '[OK]');
      
      // Red circles/warnings (for red flags) - use ASCII text label
      replaced = replaced.replace(/🔴|❌|✗|✘|✕/g, '[X]');
      replaced = replaced.replace(/⚠|⚠️/g, '[!]');
      
      // Lightbulbs/ideas (for insights) - use ASCII text label
      replaced = replaced.replace(/💡|💭|💬|💡️/g, '[IDEA]');
      
      // Targets/goals (for strategies) - use ASCII text label
      replaced = replaced.replace(/🎯|📍|🔖/g, '[GOAL]');
      
      // Stars - use asterisk (widely supported)
      replaced = replaced.replace(/⭐|🌟|✨/g, '*');
      
      // Circles (colored circles that might be used as icons) - use bullet
      replaced = replaced.replace(/⚫|⚪|🔵|🟡|🟠|🟣/g, '•');
      
      // Arrows - replace with ASCII equivalents
      replaced = replaced.replace(/→/g, '->');
      replaced = replaced.replace(/←/g, '<-');
      replaced = replaced.replace(/↑/g, '^');
      replaced = replaced.replace(/↓/g, 'v');
      replaced = replaced.replace(/⇒/g, '=>');
      replaced = replaced.replace(/⇐/g, '<=');
      
      // Remove any remaining emoji-like characters (high Unicode ranges)
      // This catches emojis that might not be in the specific patterns above
      replaced = replaced.replace(/[\u{1F300}-\u{1F9FF}]/gu, '[ICON]');
      replaced = replaced.replace(/[\u{2600}-\u{26FF}]/gu, '[SYMBOL]');
      replaced = replaced.replace(/[\u{2700}-\u{27BF}]/gu, '[SYMBOL]');
      replaced = replaced.replace(/[\u{1F000}-\u{1F02F}]/gu, '[SYMBOL]'); // Additional symbol range
      
      return replaced;
    };
    
    // Function to clean text - remove HTML entities and normalize special characters
    const cleanText = (text: string): string => {
      // Create a temporary element to decode HTML entities
      const temp = document.createElement('div');
      temp.innerHTML = text;
      let cleaned = temp.textContent || temp.innerText || text;
      
      // Remove any remaining HTML tags
      cleaned = cleaned.replace(/<[^>]*>/g, '');
      
      // Decode HTML entities
      cleaned = cleaned.replace(/&[#\w]+;/g, (entity) => {
        const temp2 = document.createElement('div');
        temp2.innerHTML = entity;
        return temp2.textContent || entity;
      });
      
      // Replace icons/emojis with text equivalents
      cleaned = replaceIconsWithText(cleaned);
      
      // Remove zero-width and other problematic Unicode characters
      cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
      
      // Normalize whitespace (preserve single spaces, normalize tabs)
      cleaned = cleaned.replace(/[ \t]+/g, ' ');
      
      return cleaned.trim();
    };
    
    // Function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [55, 65, 81]) => {
      // Clean the text first
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
    
    // Process HTML elements recursively
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
          // Check for nested strong/bold tags
          const hasStrong = element.querySelector('strong, b');
          if (hasStrong) {
            // Process paragraph text with formatting
            let fullText = '';
            element.childNodes.forEach(child => {
              if (child.nodeType === Node.TEXT_NODE) {
                fullText += child.textContent || '';
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as Element;
                if (el.tagName.toLowerCase() === 'strong' || el.tagName.toLowerCase() === 'b') {
                  fullText += el.textContent || '';
                } else {
                  fullText += el.textContent || '';
                }
              }
            });
            addText(fullText, 12, false);
          } else {
            addText(text, 12, false);
          }
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
      } else if (tagName === 'li') {
        // Handled by parent ul/ol
        return;
      } else if (tagName === 'strong' || tagName === 'b') {
        const text = element.textContent?.trim() || '';
        if (text) {
          addText(text, 12, true);
        }
      } else if (tagName === 'code') {
        const text = element.textContent?.trim() || '';
        if (text) {
          pdf.setFontSize(10);
          pdf.setTextColor(15, 71, 97);
          pdf.setFont('courier', 'normal');
          const lines = pdf.splitTextToSize(text, contentWidth - 0.2);
          lines.forEach((line: string) => {
            if (yPosition + 0.2 > maxHeight) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin + 0.1, yPosition);
            yPosition += 0.15;
          });
        }
      } else if (tagName === 'img') {
        // Handle images/icons - use alt text or skip
        const imgElement = element as HTMLImageElement;
        const altText = imgElement.alt || imgElement.title || '';
        if (altText) {
          // Add alt text as a replacement for the icon
          addText(`[${altText}]`, 12, false, [100, 100, 100]);
          yPosition += 0.05;
        }
        // If no alt text, skip the image silently
      } else if (tagName === 'svg') {
        // Handle SVG icons - use aria-label, title, or skip
        const svgElement = element as SVGElement;
        const title = svgElement.querySelector('title');
        const ariaLabel = svgElement.getAttribute('aria-label');
        const titleText = title?.textContent || ariaLabel || '';
        if (titleText) {
          addText(`[${titleText}]`, 12, false, [100, 100, 100]);
          yPosition += 0.05;
        }
        // If no title/aria-label, skip the SVG silently
      } else if (tagName === 'blockquote') {
        const text = element.textContent?.trim() || '';
        if (text) {
          const startY = yPosition;
          pdf.setDrawColor(15, 71, 97);
          pdf.setLineWidth(0.02);
          pdf.setTextColor(75, 85, 99);
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(12);
          const lines = pdf.splitTextToSize(text, contentWidth - 0.2);
          lines.forEach((line: string) => {
            if (yPosition + 0.2 > maxHeight) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin + 0.2, yPosition);
            yPosition += 0.15;
          });
          pdf.line(margin, startY - 0.05, margin, yPosition - 0.05);
          yPosition += 0.1;
        }
      } else {
        // For container elements, process children
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
    pdf.save(`module-${moduleNumber}-audit-review.pdf`);
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



