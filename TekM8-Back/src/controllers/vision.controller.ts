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
    if (!req.file?.path) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('🛠️ Received file:', req.file.path);

    // 🧠 Perform OCR
    const [result] = await client.textDetection(req.file.path);
    const detections = result.textAnnotations || [];

    const fullText = detections[0]?.description || '';
    console.log('📄 Full OCR Text:\n', fullText);

    // 🔍 Example pattern matching (adjust to real data)
    const nameMatch = fullText.match(/Name[:\s]*([A-Z]+\s[A-Z]+)/i);
    const regMatch = fullText.match(/REG(?:ISTRATION)? NO\.?\s*[:\-]?\s*(\d{5,})/i);
    const expiryMatch = fullText.match(/EXPIRES (?:END )?([A-Za-z]+\s\d{4})/i);

    const data = {
      fullText,
      name: nameMatch?.[1] || null,
      registrationNumber: regMatch?.[1] || null,
      expiryDate: expiryMatch?.[1] || null,
    };

    res.json(data);
  } catch (err) {
    console.error('❌ Vision extract error:', err);
    res.status(500).json({ error: 'Failed to extract text from image' });
  }
};

