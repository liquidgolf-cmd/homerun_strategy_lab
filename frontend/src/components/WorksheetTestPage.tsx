/**
 * Temporary test page to generate and review all worksheet PDFs
 * This page should be removed or restricted after review
 */

import {
  generateAtBatSnapshotPDF,
  generateHomeRunClarityExercisePDF,
  generateIdealCustomerProfilePDF,
  generateBestVsWorstClientsPDF,
  generatePainsDesiresOutcomesMapPDF,
  generateCoreOfferBuilderPDF,
  generateOfferPathDiagramPDF,
  generateEssentialAssetsChecklistPDF,
  generateBlindSpotAuditPDF,
  generate90DayGamePlanPDF,
  generateProjectBreakdownSheetPDF,
  generateWeeklyRhythmChecklistPDF,
} from '../utils/worksheets';

export default function WorksheetTestPage() {
  const worksheets = [
    { module: 'Module 0', name: 'At Bat Snapshot', generator: generateAtBatSnapshotPDF },
    { module: 'Module 0', name: 'Home Run Clarity Exercise', generator: generateHomeRunClarityExercisePDF },
    { module: 'Module 1', name: 'Ideal Customer Profile', generator: generateIdealCustomerProfilePDF },
    { module: 'Module 1', name: 'Best vs Worst Clients', generator: generateBestVsWorstClientsPDF },
    { module: 'Module 2', name: 'Pains/Desires/Outcomes Map', generator: generatePainsDesiresOutcomesMapPDF },
    { module: 'Module 2', name: 'Core Offer Builder', generator: generateCoreOfferBuilderPDF },
    { module: 'Module 3', name: 'Offer Path Diagram', generator: generateOfferPathDiagramPDF },
    { module: 'Module 3', name: 'Essential Assets Checklist', generator: generateEssentialAssetsChecklistPDF },
    { module: 'Module 3', name: 'Blind-Spot Audit', generator: generateBlindSpotAuditPDF },
    { module: 'Module 4', name: '90-Day Game Plan', generator: generate90DayGamePlanPDF },
    { module: 'Module 4', name: 'Project Breakdown Sheet', generator: generateProjectBreakdownSheetPDF },
    { module: 'Module 4', name: 'Weekly Rhythm Checklist', generator: generateWeeklyRhythmChecklistPDF },
  ];

  const generateAll = () => {
    worksheets.forEach((worksheet, index) => {
      setTimeout(() => {
        try {
          worksheet.generator();
        } catch (error) {
          console.error(`Error generating ${worksheet.name}:`, error);
        }
      }, index * 500); // Stagger downloads by 500ms
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Worksheet PDF Test Page</h1>
          <p className="text-gray-600 mb-6">
            Click any button below to generate a sample PDF worksheet. Use this page to review the formatting and content.
          </p>
          
          <button
            onClick={generateAll}
            className="mb-6 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Generate All PDFs (Downloads will be staggered)
          </button>
        </div>

        <div className="space-y-6">
          {['Module 0', 'Module 1', 'Module 2', 'Module 3', 'Module 4'].map((module) => {
            const moduleWorksheets = worksheets.filter((w) => w.module === module);
            return (
              <div key={module} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-primary mb-4">{module}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moduleWorksheets.map((worksheet) => (
                    <button
                      key={worksheet.name}
                      onClick={() => {
                        try {
                          worksheet.generator();
                        } catch (error) {
                          console.error(`Error generating ${worksheet.name}:`, error);
                          alert(`Error generating PDF: ${error}`);
                        }
                      }}
                      className="flex items-center justify-between p-4 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-primary transition-colors text-left"
                    >
                      <span className="text-gray-900 font-medium">{worksheet.name}</span>
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a temporary test page. Remember to remove or restrict access to this route after reviewing the PDFs.
          </p>
        </div>
      </div>
    </div>
  );
}

