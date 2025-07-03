import { Request, Response } from 'express';
import { extractFromImageWithVision } from '../models/vision.model';

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
