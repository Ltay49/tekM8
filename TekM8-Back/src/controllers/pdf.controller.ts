import { Request, Response } from 'express';
import pdf from 'pdf-parse';

export async function analyzePdfController(req: Request, res: Response) :Promise<void> {
  try {
    const { pdfBase64 } = req.body;
    // Decode base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Extract text from PDF buffer
    const data = await pdf(pdfBuffer);

    // data.text contains all the extracted text
    // You can add your label extraction logic here if needed

    res.json({ extractedText: data.text });
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    res.status(500).json({ error: 'Failed to extract text from PDF' });
  }
}
