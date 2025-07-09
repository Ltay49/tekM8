import { Request, Response } from 'express';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import fs from 'fs';

const client = new ImageAnnotatorClient();

export const extractFixersTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const imagePath = req.file?.path;

    if (!imagePath) {
      res.status(400).json({ error: 'No image uploaded' });
      return;
    }

    const [result] = await client.textDetection(imagePath);
    const text = result.fullTextAnnotation?.text;

    if (!text) {
      fs.unlinkSync(imagePath);
      res.status(400).json({ error: 'No text detected' });
      return;
    }

    // ✅ Log full raw OCR text
    console.log('\n===== RAW OCR TEXT =====');
    console.log(text);
    console.log('========================\n');

    const lines: string[] = text.split('\n');
    const tasks: { level: string; task: string; start: string; end: string }[] = [];

    const isDate = (str: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(str);

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === 'Fixers') {
        const level = lines[i - 2]?.trim() || '';
        const task = lines[i - 1]?.trim() || '';
        const start = lines[i + 2]?.trim() || ''; // ✅ skip 0%
        const end = lines[i + 3]?.trim() || '';

        if (isDate(start) && isDate(end)) {
          tasks.push({ level, task, start, end });
        } else {
          console.log('⚠️ Skipped due to invalid dates:', { level, task, start, end });
        }
      }
    }

    fs.unlinkSync(imagePath);
    res.json({ tasks });
  } catch (error) {
    console.error('Fixers task extraction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
