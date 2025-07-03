import { Request, Response } from 'express';
import { convertPdfToImage } from '../utils/pdf-to-image';


export async function convertPdfToImageController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.file?.path) {
      res.status(400).json({ error: 'Missing PDF file upload' });
      return;
    }

    const imagePath = await convertPdfToImage(req.file.path);
    res.json({ imagePath });
  } catch (error) {
    console.error('❌ PDF to Image failed:', error);
    res.status(500).json({ error: 'Failed to convert PDF to image' });
  }
}
