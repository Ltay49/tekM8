const fs = require('fs');
const vision = require('@google-cloud/vision');

// Initialize Google Vision client with your credentials file
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'tekmate-vision-key.json',
});

async function extractTextFromPdf(pdfFilePath) {
  try {
    // Read PDF file from disk
    const pdfBuffer = fs.readFileSync(pdfFilePath);

    // Convert PDF buffer to base64 string
    const pdfBase64 = pdfBuffer.toString('base64');

    // Build request payload for DOCUMENT_TEXT_DETECTION with PDF content
    const request = {
      requests: [
        {
          inputConfig: {
            content: pdfBase64,
            mimeType: 'application/pdf',
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
        },
      ],
    };

    // Send request to Google Cloud Vision
    const [response] = await client.documentTextDetection(request);

    // Extracted text
    const extractedText = response.fullTextAnnotation?.text || 'No text found';

    console.log('Extracted text from PDF:\n', extractedText);
  } catch (error) {
    console.error('Error extracting text:', error);
  }
}

// Change the path to your PDF file location
const pdfFilePath = '/Users/lewistaylor/Desktop/Induction_Checksheet.pdf';

extractTextFromPdf(pdfFilePath);
