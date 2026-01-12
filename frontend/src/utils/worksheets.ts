/**
 * Worksheet PDF Generation Utilities
 * Creates print-ready PDF worksheets for each module
 */

import { jsPDF } from 'jspdf';

// Brand colors (RGB values)
const PRIMARY_COLOR_R = 15;
const PRIMARY_COLOR_G = 71;
const PRIMARY_COLOR_B = 97;
const TEXT_COLOR_R = 51;
const TEXT_COLOR_G = 51;
const TEXT_COLOR_B = 51;
const SECONDARY_TEXT_R = 102;
const SECONDARY_TEXT_G = 102;
const SECONDARY_TEXT_B = 102;

// Page settings
const PAGE_WIDTH = 8.5;
const PAGE_HEIGHT = 11;
const MARGIN = 0.5;
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN);

/**
 * Helper function to add header to worksheet
 */
function addWorksheetHeader(pdf: jsPDF, moduleTitle: string, worksheetName: string): number {
  let yPos = MARGIN;
  
  // Module title
  pdf.setFontSize(16);
  pdf.setTextColor(PRIMARY_COLOR_R, PRIMARY_COLOR_G, PRIMARY_COLOR_B);
  pdf.setFont('helvetica', 'bold');
  pdf.text(moduleTitle, MARGIN, yPos);
  yPos += 0.25;
  
  // Worksheet name
  pdf.setFontSize(14);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'bold');
  pdf.text(worksheetName, MARGIN, yPos);
  yPos += 0.2;
  
  // Draw line
  pdf.setDrawColor(PRIMARY_COLOR_R, PRIMARY_COLOR_G, PRIMARY_COLOR_B);
  pdf.setLineWidth(0.01);
  pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
  yPos += 0.25;
  
  return yPos;
}

/**
 * Helper function to add section heading
 */
function addSectionHeading(pdf: jsPDF, text: string, yPos: number): number {
  pdf.setFontSize(12);
  pdf.setTextColor(PRIMARY_COLOR_R, PRIMARY_COLOR_G, PRIMARY_COLOR_B);
  pdf.setFont('helvetica', 'bold');
  pdf.text(text, MARGIN, yPos);
  return yPos + 0.2;
}

/**
 * Helper function to add field with label and line
 */
function addField(pdf: jsPDF, label: string, yPos: number, multiline: boolean = false): number {
  const lineHeight = 0.2;
  const fieldHeight = multiline ? 0.8 : 0.3;
  
  // Label
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  const labelLines = pdf.splitTextToSize(label, CONTENT_WIDTH);
  pdf.text(labelLines, MARGIN, yPos);
  yPos += labelLines.length * lineHeight + 0.05;
  
  // Line for writing
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.005);
  const lines = multiline ? Math.ceil(fieldHeight / 0.2) : 1;
  for (let i = 0; i < lines; i++) {
    pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += lineHeight;
  }
  yPos += 0.15;
  
  return yPos;
}

/**
 * Helper function to check if we need a new page
 */
function checkNewPage(pdf: jsPDF, yPos: number, spaceNeeded: number): number {
  if (yPos + spaceNeeded > PAGE_HEIGHT - MARGIN) {
    pdf.addPage();
    return MARGIN;
  }
  return yPos;
}

/**
 * MODULE 0 WORKSHEETS
 */

export function generateAtBatSnapshotPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 0: Current Reality (At Bat)', 'At Bat Snapshot');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Use this worksheet to capture your current business reality and starting point.', MARGIN, yPos);
  yPos += 0.25;
  
  yPos = addSectionHeading(pdf, 'Business Overview', yPos);
  yPos = addField(pdf, 'Business/Role Description (2-3 sentences)', yPos, true);
  yPos = addField(pdf, 'Why are you doing this lab now?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Current Situation', yPos);
  yPos = addField(pdf, 'Main Offers/Responsibilities', yPos, true);
  yPos = addField(pdf, 'Where does your time go?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'What\'s Working', yPos);
  yPos = addField(pdf, '3 things that are working (and why)', yPos, true);
  yPos = addField(pdf, 'What you\'re most proud of (last 6-12 months)', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'What\'s Not Working', yPos);
  yPos = addField(pdf, 'Where you feel stuck, confused, or scattered', yPos, true);
  yPos = addField(pdf, 'What\'s draining your energy or budget', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Constraints & Concerns', yPos);
  yPos = addField(pdf, 'Current constraints (time, money, family, health, team, etc.)', yPos, true);
  yPos = addField(pdf, 'If nothing changes in 12 months, what worries you most?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.0);
  yPos = addSectionHeading(pdf, 'Your 90-Day Home Run', yPos);
  yPos = addField(pdf, 'In one sentence: "If, 90 days from now, ____ had happened, this would feel like a home run."', yPos, true);
  
  pdf.save('At-Bat-Snapshot.pdf');
}

export function generateHomeRunClarityExercisePDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 0: Current Reality (At Bat)', 'Home Run for the Next 90 Days');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Complete this exercise to define what success looks like for you over the next 90 days.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Define Your 90-Day Home Run', yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  const instruction = 'Complete this sentence: "If, 90 days from now, ____ had happened, this would feel like a home run."';
  const instructionLines = pdf.splitTextToSize(instruction, CONTENT_WIDTH);
  pdf.text(instructionLines, MARGIN, yPos);
  yPos += instructionLines.length * 0.15 + 0.2;
  
  yPos = addField(pdf, 'Your 90-Day Home Run', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Why This Matters', yPos);
  yPos = addField(pdf, 'Why is this important to you?', yPos, true);
  yPos = addField(pdf, 'What will be different if you achieve this?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'What Success Looks Like', yPos);
  yPos = addField(pdf, 'Specific outcomes or results you\'ll see', yPos, true);
  yPos = addField(pdf, 'How you\'ll know you\'ve achieved your home run', yPos, true);
  
  pdf.save('Home-Run-90-Days.pdf');
}

/**
 * MODULE 1 WORKSHEETS
 */

export function generateIdealCustomerProfilePDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 1: 1st Base - Define Who You\'re Really For', 'Ideal Customer Profile');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Use this template to create 1-2 clear Ideal Customer Profiles. Fill out one template per profile.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Who They Are', yPos);
  yPos = addField(pdf, 'Role/Title', yPos);
  yPos = addField(pdf, 'Company/Organization Stage', yPos);
  yPos = addField(pdf, 'Industry/Context', yPos);
  yPos = addField(pdf, 'Key characteristics or demographics', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'What They Want', yPos);
  yPos = addField(pdf, 'What they\'re trying to achieve', yPos, true);
  yPos = addField(pdf, 'Their goals and aspirations', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'What Frustrates Them', yPos);
  yPos = addField(pdf, 'Key frustrations and challenges', yPos, true);
  yPos = addField(pdf, 'Pain points they experience', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'What They Value', yPos);
  yPos = addField(pdf, 'What they value in a partner/provider', yPos, true);
  yPos = addField(pdf, 'How they prefer to work', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.0);
  yPos = addSectionHeading(pdf, 'Why They Choose You', yPos);
  yPos = addField(pdf, 'What makes you stand out to this ideal customer', yPos, true);
  
  pdf.save('Ideal-Customer-Profile.pdf');
}

export function generateBestVsWorstClientsPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 1: 1st Base - Define Who You\'re Really For', 'Best vs Worst Clients');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Reflect on your past clients to identify patterns that define your best and worst fits.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Best-Fit Clients', yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('List 3-5 of your favorite past customers/clients:', MARGIN, yPos);
  yPos += 0.2;
  
  for (let i = 1; i <= 5; i++) {
    yPos = addField(pdf, `Client ${i}:`, yPos);
  }
  
  yPos = checkNewPage(pdf, yPos, 2.0);
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Why did working with them feel good?', MARGIN, yPos);
  yPos += 0.2;
  yPos = addField(pdf, '', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 2.0);
  pdf.text('What results did they get?', MARGIN, yPos);
  yPos += 0.2;
  yPos = addField(pdf, '', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Worst-Fit Clients', yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('List 2-3 customers you wouldn\'t want to repeat:', MARGIN, yPos);
  yPos += 0.2;
  
  for (let i = 1; i <= 3; i++) {
    yPos = addField(pdf, `Client ${i}:`, yPos);
  }
  
  yPos = checkNewPage(pdf, yPos, 2.0);
  pdf.text('What made them a bad fit? (behavior, expectations, values, stage, etc.)', MARGIN, yPos);
  yPos += 0.2;
  yPos = addField(pdf, '', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Patterns & Insights', yPos);
  yPos = addField(pdf, 'What do your best-fit customers have in common?', yPos, true);
  yPos = addField(pdf, 'What do your worst-fit customers have in common?', yPos, true);
  
  pdf.save('Best-vs-Worst-Clients.pdf');
}

/**
 * MODULE 2 WORKSHEETS
 */

export function generatePainsDesiresOutcomesMapPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 2: 2nd Base - Design What They Actually Want', 'Pains / Desires / Outcomes Map');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Map your customer\'s journey from pain to possibility. Focus on outcomes, not features.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Pains & Frustrations', yPos);
  yPos = addField(pdf, 'What problems do they face?', yPos, true);
  yPos = addField(pdf, 'What frustrates them most?', yPos, true);
  yPos = addField(pdf, 'What fears or concerns do they have?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Desires & Aspirations', yPos);
  yPos = addField(pdf, 'What do they want to achieve?', yPos, true);
  yPos = addField(pdf, 'What transformation are they seeking?', yPos, true);
  yPos = addField(pdf, 'What would make them feel successful?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Desired Outcomes', yPos);
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('List 5-10 concrete outcomes your work helps create:', MARGIN, yPos);
  yPos += 0.2;
  
  for (let i = 1; i <= 10; i++) {
    yPos = addField(pdf, `Outcome ${i}:`, yPos);
  }
  
  pdf.save('Pains-Desires-Outcomes-Map.pdf');
}

export function generateCoreOfferBuilderPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 2: 2nd Base - Design What They Actually Want', 'Core Offer Builder');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Use this template to build your core offer statement: "We help [who] do [what], so they can [outcome], without [fear]."', MARGIN, yPos);
  yPos += 0.35;
  
  yPos = addSectionHeading(pdf, 'Core Offer Components', yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('We help [WHO]', MARGIN, yPos);
  yPos += 0.15;
  yPos = addField(pdf, 'Your ideal customer (from Module 1)', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.0);
  pdf.text('do [WHAT]', MARGIN, yPos);
  yPos += 0.15;
  yPos = addField(pdf, 'What you help them do or achieve', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.0);
  pdf.text('so they can [OUTCOME]', MARGIN, yPos);
  yPos += 0.15;
  yPos = addField(pdf, 'The specific outcome they achieve', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.0);
  pdf.text('without [FEAR]', MARGIN, yPos);
  yPos += 0.15;
  yPos = addField(pdf, 'What they avoid, fear, or don\'t want', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Complete Core Offer Statement', yPos);
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Write your complete core offer statement:', MARGIN, yPos);
  yPos += 0.2;
  yPos = addField(pdf, 'We help...', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Offer Variations', yPos);
  pdf.text('Write 3 variations of your core offer:', MARGIN, yPos);
  yPos += 0.2;
  
  for (let i = 1; i <= 3; i++) {
    yPos = addField(pdf, `Variation ${i}:`, yPos, true);
  }
  
  pdf.save('Core-Offer-Builder.pdf');
}

/**
 * MODULE 3 WORKSHEETS
 */

export function generateOfferPathDiagramPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 3: 3rd Base - Map How You\'ll Deliver It', 'Offer Path Diagram');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Break your delivery process into 3-5 simple stages. Name each stage in human, non-jargony language.', MARGIN, yPos);
  yPos += 0.35;
  
  for (let i = 1; i <= 5; i++) {
    yPos = checkNewPage(pdf, yPos, 1.2);
    yPos = addSectionHeading(pdf, `Stage ${i}`, yPos);
    yPos = addField(pdf, 'Stage name:', yPos);
    yPos = addField(pdf, 'What are we doing?', yPos, true);
    yPos = addField(pdf, 'What is the customer feeling?', yPos, true);
    yPos = addField(pdf, 'What is the outcome?', yPos, true);
    yPos += 0.1;
  }
  
  pdf.save('Offer-Path-Diagram.pdf');
}

export function generateEssentialAssetsChecklistPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 3: 3rd Base - Map How You\'ll Deliver It', 'Essential Assets Checklist');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Prioritize which assets move the needle first. Focus on essential, not "nice to have".', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Essential Assets (Must Have)', yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Assets that are critical for delivery:', MARGIN, yPos);
  yPos += 0.2;
  
  // Add checkboxes
  const checkboxX = MARGIN;
  const checkboxSize = 0.15;
  const lineSpacing = 0.25;
  
  for (let i = 1; i <= 10; i++) {
    yPos = checkNewPage(pdf, yPos, lineSpacing);
    pdf.rect(checkboxX, yPos - 0.1, checkboxSize, checkboxSize);
    pdf.text(`Asset ${i}:`, checkboxX + 0.2, yPos);
    yPos += lineSpacing;
  }
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Nice to Have (Future)', yPos);
  pdf.text('Assets that could be helpful but aren\'t essential:', MARGIN, yPos);
  yPos += 0.2;
  
  for (let i = 1; i <= 8; i++) {
    yPos = checkNewPage(pdf, yPos, lineSpacing);
    pdf.rect(checkboxX, yPos - 0.1, checkboxSize, checkboxSize);
    pdf.text(`Asset ${i}:`, checkboxX + 0.2, yPos);
    yPos += lineSpacing;
  }
  
  pdf.save('Essential-Assets-Checklist.pdf');
}

export function generateBlindSpotAuditPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 3: 3rd Base - Map How You\'ll Deliver It', 'Blind-Spot Audit');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Use this audit to identify gaps in your current strategy, visuals, and messaging.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Confusion Points', yPos);
  yPos = addField(pdf, 'Where do customers currently get confused or stuck?', yPos, true);
  yPos = addField(pdf, 'What questions do customers ask repeatedly?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Organization & Process', yPos);
  yPos = addField(pdf, 'Where do you feel disorganized or rushed?', yPos, true);
  yPos = addField(pdf, 'What processes need clarification?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Visuals & Messaging Gaps', yPos);
  yPos = addField(pdf, 'What visuals are missing or unclear?', yPos, true);
  yPos = addField(pdf, 'What messaging needs improvement?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Immediate Fixes', yPos);
  yPos = addField(pdf, 'What should be adjusted now (high priority)?', yPos, true);
  yPos = addField(pdf, 'What can wait until later (low priority)?', yPos, true);
  
  pdf.save('Blind-Spot-Audit.pdf');
}

/**
 * MODULE 4 WORKSHEETS
 */

export function generate90DayGamePlanPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 4: The HomeRun - Build Your 90-Day Game Plan', '90-Day Game Plan');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Translate your strategy into a focused, realistic 90-day plan with 3-5 strategic projects.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, '90-Day North Star', yPos);
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('In one sentence: "In 90 days, it will be a win if _____, and this matters to my customer because ____."', MARGIN, yPos);
  yPos += 0.25;
  yPos = addField(pdf, '', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 1.0);
  yPos = addField(pdf, 'Why this, and why now?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 2.0);
  yPos = addSectionHeading(pdf, 'Strategic Projects (3-5)', yPos);
  
  for (let i = 1; i <= 5; i++) {
    yPos = checkNewPage(pdf, yPos, 1.5);
    pdf.setFontSize(11);
    pdf.setTextColor(PRIMARY_COLOR_R, PRIMARY_COLOR_G, PRIMARY_COLOR_B);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Project ${i}`, MARGIN, yPos);
    yPos += 0.2;
    
    pdf.setFontSize(10);
    pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
    pdf.setFont('helvetica', 'normal');
    yPos = addField(pdf, 'Project name:', yPos);
    yPos = addField(pdf, 'What does "done" mean?', yPos, true);
    yPos = addField(pdf, '3-7 concrete next steps:', yPos, true);
    yPos += 0.1;
  }
  
  pdf.save('90-Day-Game-Plan.pdf');
}

export function generateProjectBreakdownSheetPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 4: The HomeRun - Build Your 90-Day Game Plan', 'Project → Task Breakdown Sheet');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Break down each project into specific tasks with timelines and owners.', MARGIN, yPos);
  yPos += 0.3;
  
  for (let i = 1; i <= 3; i++) {
    yPos = checkNewPage(pdf, yPos, 2.0);
    pdf.setFontSize(11);
    pdf.setTextColor(PRIMARY_COLOR_R, PRIMARY_COLOR_G, PRIMARY_COLOR_B);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Project ${i}`, MARGIN, yPos);
    yPos += 0.2;
    
    pdf.setFontSize(10);
    pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
    pdf.setFont('helvetica', 'normal');
    yPos = addField(pdf, 'Project name:', yPos);
    
    // Task breakdown table header
    yPos += 0.15;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tasks:', MARGIN, yPos);
    yPos += 0.15;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Task | Timeline | Owner', MARGIN, yPos);
    yPos += 0.15;
    
    // Task rows
    for (let j = 1; j <= 7; j++) {
      pdf.line(MARGIN, yPos - 0.05, PAGE_WIDTH - MARGIN, yPos - 0.05);
      pdf.text(`Task ${j}:`, MARGIN + 0.1, yPos);
      pdf.text('__________', MARGIN + 1.5, yPos);
      pdf.text('_____', MARGIN + 3.5, yPos);
      pdf.text('_____', MARGIN + 5, yPos);
      yPos += 0.25;
    }
    yPos += 0.2;
  }
  
  pdf.save('Project-Breakdown-Sheet.pdf');
}

export function generateWeeklyRhythmChecklistPDF(): void {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  let yPos = addWorksheetHeader(pdf, 'Module 4: The HomeRun - Build Your 90-Day Game Plan', 'Weekly Rhythm & Review Checklist');
  
  pdf.setFontSize(10);
  pdf.setTextColor(SECONDARY_TEXT_R, SECONDARY_TEXT_G, SECONDARY_TEXT_B);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Design a simple weekly check-in routine to track progress and adjust as needed.', MARGIN, yPos);
  yPos += 0.3;
  
  yPos = addSectionHeading(pdf, 'Weekly Review Schedule', yPos);
  yPos = addField(pdf, 'When will you review this plan each week? (day/time)', yPos);
  yPos = addField(pdf, 'What will you look at or update?', yPos, true);
  
  yPos = checkNewPage(pdf, yPos, 2.0);
  yPos = addSectionHeading(pdf, 'Weekly Review Checklist', yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(TEXT_COLOR_R, TEXT_COLOR_G, TEXT_COLOR_B);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Use this checklist each week:', MARGIN, yPos);
  yPos += 0.2;
  
  const checkboxX = MARGIN;
  const checkboxSize = 0.15;
  const lineSpacing = 0.25;
  const checklistItems = [
    'Review progress on each project',
    'Update task status and timelines',
    'Identify blockers or challenges',
    'Celebrate wins and milestones',
    'Adjust plan if needed',
    'Set priorities for next week',
    'Review risks and mitigation strategies',
    'Check in on support/accountability needs'
  ];
  
  for (const item of checklistItems) {
    yPos = checkNewPage(pdf, yPos, lineSpacing);
    pdf.rect(checkboxX, yPos - 0.1, checkboxSize, checkboxSize);
    pdf.text(item, checkboxX + 0.2, yPos);
    yPos += lineSpacing;
  }
  
  yPos = checkNewPage(pdf, yPos, 1.5);
  yPos = addSectionHeading(pdf, 'Notes & Adjustments', yPos);
  yPos = addField(pdf, 'Week of:', yPos);
  yPos = addField(pdf, 'Key updates or changes:', yPos, true);
  
  pdf.save('Weekly-Rhythm-Checklist.pdf');
}

/**
 * Helper function to get all worksheet generators for a module
 */
export function getModuleWorksheets(moduleNumber: number): Array<{ name: string; generator: () => void }> {
  switch (moduleNumber) {
    case 0:
      return [
        { name: 'At Bat Snapshot', generator: generateAtBatSnapshotPDF },
        { name: 'Home Run Clarity Exercise', generator: generateHomeRunClarityExercisePDF },
      ];
    case 1:
      return [
        { name: 'Ideal Customer Profile', generator: generateIdealCustomerProfilePDF },
        { name: 'Best vs Worst Clients', generator: generateBestVsWorstClientsPDF },
      ];
    case 2:
      return [
        { name: 'Pains/Desires/Outcomes Map', generator: generatePainsDesiresOutcomesMapPDF },
        { name: 'Core Offer Builder', generator: generateCoreOfferBuilderPDF },
      ];
    case 3:
      return [
        { name: 'Offer Path Diagram', generator: generateOfferPathDiagramPDF },
        { name: 'Essential Assets Checklist', generator: generateEssentialAssetsChecklistPDF },
        { name: 'Blind-Spot Audit', generator: generateBlindSpotAuditPDF },
      ];
    case 4:
      return [
        { name: '90-Day Game Plan', generator: generate90DayGamePlanPDF },
        { name: 'Project Breakdown Sheet', generator: generateProjectBreakdownSheetPDF },
        { name: 'Weekly Rhythm Checklist', generator: generateWeeklyRhythmChecklistPDF },
      ];
    default:
      return [];
  }
}

