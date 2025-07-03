import vision from '@google-cloud/vision';
import fs from 'fs';

const client = new vision.ImageAnnotatorClient({
  keyFilename: './src/tekmate-vision-key.json',
});

export async function extractCscsCardData(imagePath: string) {
  const [result] = await client.textDetection(imagePath);
  const text = result.fullTextAnnotation?.text || '';

  // Basic patterns — you can improve these later
  const nameMatch = text.match(/([A-Z]+\s[A-Z]+)/);
  const regMatch = text.match(/Reg(?:\.| No\.|istration)?[:\s]*([0-9]{6,})/i);
  const expiryMatch = text.match(/Expires(?: End)?[:\s]*([A-Za-z]+\s[0-9]{4})/i);
  const qualMatch = text.match(/BTEC.*|NVQ.*|Level.*/i);

  return {
    rawText: text,
    name: nameMatch?.[1] || null,
    regNumber: regMatch?.[1] || null,
    expiry: expiryMatch?.[1] || null,
    qualification: qualMatch?.[0] || null,
  };
}
