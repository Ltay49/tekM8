import { Request, Response } from 'express';
import { extractFromImageWithVision } from '../models/vision.model';
import vision from '@google-cloud/vision';
import fs from 'fs/promises';
import OpenAI from 'openai';


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


export const extractAndInstruct = async (req: Request, res: Response): Promise<any> => {
  console.log('📸 [extractAndInstruct] Received request');
  try {
    if (!req.file) {
      console.warn('⚠️ No image file received');
      return res.status(400).json({ error: 'Image is required.' });
    }

    console.log('🖼️ Image path:', req.file.path);

    const imagePath = req.file.path;

    const [result] = await client.textDetection(imagePath);
    const rawText = result.fullTextAnnotation?.text || '';

    console.log('🧾 Extracted raw OCR text:', rawText.slice(0, 200), '...');

    if (!rawText) {
      await fs.unlink(imagePath);
      return res.status(400).json({ error: 'No text found in image.' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const prompt = `
    You are an assistant interpreting raw OCR text from images of handwritten construction site meeting notes.
    
    Your job is to:
    - Correct spelling and grammar
    - Structure the notes in a clean, human-readable format
    - Group related items logically (e.g., by floor level or task category)
    - Display dates only from 2025 onwards (discard or infer others)
    - Do not hallucinate information — just clean and clarify
    - Assume rooms are numbered 1–12 per floor
    - Maintain bullet points and section headings for clarity
    - If dates or names are unclear, mark them as [uncertain]
    
    Use the following format:
    
    ---
    
    ## Weekly Progress Meeting
    
    **Date:** [Insert or infer date from context]  
    **Attended by:**  
    - Name  
    ...
    ---
    
    ### Level 01 – Handover Schedule
    - Rooms X–Y: DD/MM/YY  
  
    ...
    
    ### Level 02 – Handover Schedule
    ...
    
    ---
    
    ### Tasks / Actions
    - Task 1  
    - Task 2  
    
    ---
    
    Here is the raw OCR text to interpret:
    \n\n${rawText}
    `;
    
    

    const gptRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for construction site documentation.' },
        { role: 'user', content: prompt },
      ],
    });

    const gptOutput = gptRes.choices[0]?.message?.content;
    console.log('🧠 GPT-4 Summary:', gptOutput?.slice(0, 200), '...');

    res.json({ rawText, gptSummary: gptOutput });
    await fs.unlink(imagePath);
  } catch (error) {
    console.error('❌ Error in extractAndInstruct:', error);
    res.status(500).json({ error: 'Failed to process image.' });
  }
};

