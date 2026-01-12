/**
 * Script to convert sample review markdown files to PDF
 */

const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

const sampleReviewsDir = path.join(__dirname, '../public/sample-reviews');
const outputDir = path.join(__dirname, '../public/sample-reviews');

// List of markdown files to convert
const markdownFiles = [
  'module0-sample-review.md',
  'module1-sample-review.md',
  'module2-sample-review.md',
  'module3-sample-review.md',
  'module4-sample-review.md',
  'final-combined-overview.md',
  'final-90-day-action-plan.md',
];

async function convertToPdf(filename) {
  const inputPath = path.join(sampleReviewsDir, filename);
  const outputPath = path.join(outputDir, filename.replace('.md', '.pdf'));

  try {
    console.log(`Converting ${filename}...`);
    
    const stylesheetPath = path.join(__dirname, 'styles.css');
    
    const pdf = await mdToPdf(
      { path: inputPath },
      {
        dest: outputPath,
        pdf_options: {
          format: 'Letter',
          margin: {
            top: '0.75in',
            bottom: '0.75in',
            left: '0.75in',
            right: '0.75in',
          },
        },
        stylesheet: stylesheetPath,
      }
    );

    if (pdf) {
      fs.writeFileSync(outputPath, pdf.content);
      console.log(`✅ Created ${filename.replace('.md', '.pdf')}`);
    } else {
      console.log(`❌ Failed to convert ${filename}`);
    }
  } catch (error) {
    console.error(`Error converting ${filename}:`, error.message);
  }
}

async function convertAll() {
  console.log('Starting PDF conversion...\n');
  
  for (const file of markdownFiles) {
    await convertToPdf(file);
  }
  
  console.log('\n✅ All conversions complete!');
}

convertAll().catch(console.error);
