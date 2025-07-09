import { Request, Response } from 'express';
import { extractFromImageWithVision } from '../models/vision.model';
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: './src/tekmate-vision-key.json',
});

export const handleVisionExtract = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawImagePath = req.body?.imagePath;

    // ✅ Type narrowing and runtime check
    if (typeof rawImagePath !== 'string' || rawImagePath.trim() === '') {
      res.status(400).json({ error: 'imagePath is required and must be a non-empty string.' });
      return;
    }

    const imagePath: string = rawImagePath.trim(); // ✅ Now TypeScript knows it's a real string

    const result = await extractFromImageWithVision(imagePath);
    res.json(result);
  } catch (error) {
    console.error('❌ Vision API Error:', error);
    res.status(500).json({ error: 'Failed to process image with Vision API' });
  }
};

export const extractCardData = async (req: Request, res: Response): Promise<any> => {
  console.log('🛠️ [extractCardData] Controller triggered with files:', Object.keys(req.files || {}));

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files?.frontImage?.[0]?.path || !files?.backImage?.[0]?.path) {
      console.warn('⚠️ Missing frontImage or backImage in request');
      return res.status(400).json({ error: 'Both frontImage and backImage are required' });
    }

    const frontPath = files.frontImage[0].path;
    const backPath = files.backImage[0].path;

    const [frontResult] = await client.textDetection(frontPath);
    const [backResult] = await client.textDetection(backPath);

    const frontText = frontResult.textAnnotations?.[0]?.description || '';
    const backText = backResult.textAnnotations?.[0]?.description || '';

// Extract all lines for line-based scanning
const lines = frontText.split('\n').map(line => line.trim());

// Index of the line with REG NO
const regLineIndex = lines.findIndex(line => /REG\.?\s*NO/i.test(line));

let name = null;

if (regLineIndex > 0) {
  // Look 1–3 lines above REG NO
  for (let i = regLineIndex - 1; i >= 0 && i >= regLineIndex - 3; i--) {
    const candidate = lines[i];
    if (
      /^[A-Z\s]+$/.test(candidate) && // all uppercase
      !candidate.includes('CSCS') &&
      !candidate.includes('CONSTRUCTION') &&
      !candidate.includes('SKILLS') &&
      !candidate.includes('SCHEME') &&
      !candidate.includes('WORKER') &&
      candidate.length >= 5 // avoid short noise
    ) {
      name = candidate.trim();
      break;
    }
  }
}
    const regMatch = frontText.match(/\b\d{6,10}\b/);
    const expiryMatch = frontText.match(/EXPIRES(?: END)?[:\s]*([A-Za-z]+\s\d{4})/i);
    const qualificationMatch = backText.match(/BTEC.*|NVQ.*|Level\s\d.*|Diploma.*|Degree.*/i);

    const result = {
      front: {
        rawText: frontText,
        name: name || null,
        registrationNumber: regMatch?.[0] || null,
        expiryDate: expiryMatch?.[1] || null,
        dummy: 'dummy field test'
      },
      back: {
        rawText: backText,
        qualification: qualificationMatch?.[0] || null,
      },
    };

    console.log('🧠 Extracted CSCS Card Details:', JSON.stringify(result, null, 2));

    res.json(result);
  } catch (err) {
    console.error('❌ Vision extract error:', err);
    res.status(500).json({ error: 'Failed to extract text from images' });
  }
};



