const { exec } = require('child_process');
const path = require('path');

function convertPdfToPng(pdfPath) {
  const outputDir = path.dirname(pdfPath);
  const outputPrefix = path.join(outputDir, 'converted');

  const command = `pdftocairo -png -scale-to 1024 "${pdfPath}" "${outputPrefix}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Conversion failed:', error.message);
      return;
    }
    console.log('✅ PDF converted to PNG!');
    console.log(`Image saved at: ${outputPrefix}-1.png`);
  });
}

const pdfPath = '/Users/lewistaylor/Desktop/InductionChecklist.pdf';
convertPdfToPng(pdfPath);
