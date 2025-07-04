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
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files?.frontImage?.[0]?.path || !files?.backImage?.[0]?.path) {
      return res.status(400).json({ error: 'Both frontImage and backImage are required' });
    }

    const frontPath = files.frontImage[0].path;
    const backPath = files.backImage[0].path;

    const [frontResult] = await client.textDetection(frontPath);
    const [backResult] = await client.textDetection(backPath);

    const frontText = frontResult.textAnnotations?.[0]?.description || '';
    const backText = backResult.textAnnotations?.[0]?.description || '';

    // 🔍 Extract name by checking uppercase line BEFORE "CONSTRUCTION" or "CSCS"
    const nameMatch = frontText.match(/(?:\n|^)([A-Z]+\s[A-Z]+)\s*\nREG\.?\s*NO/i);
    const regMatch = frontText.match(/\b\d{6,10}\b/);
    const expiryMatch = frontText.match(/EXPIRES(?: END)?[:\s]*([A-Za-z]+\s\d{4})/i);
    const qualificationMatch = backText.match(/BTEC.*|NVQ.*|Level\s\d.*|Diploma.*|Degree.*/i);

    res.json({
      front: {
        rawText: frontText,
        name: nameMatch || null,
        registrationNumber: regMatch?.[0] || null,
        expiryDate: expiryMatch?.[1] || null,
      },
      back: {
        rawText: backText,
        qualification: qualificationMatch?.[0] || null,
      },
    });
  } catch (err) {
    console.error('❌ Vision extract error:', err);
    res.status(500).json({ error: 'Failed to extract text from images' });
  }
};



