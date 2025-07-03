import vision from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';

const keyPath = path.join(__dirname, '../tekmate-vision-key.json');

console.log('🔍 Vision API key path:', keyPath);
console.log('🔍 Key exists?', fs.existsSync(keyPath));

const client = new vision.ImageAnnotatorClient({
  keyFilename: keyPath,
});

export const extractFromImageWithVision = async (imagePath: string): Promise<any> => {
    if (!imagePath) {
      throw new Error('imagePath is required');
    }
  
    try {
      const [result] = await client.textDetection(imagePath);
      const detections = result.textAnnotations || [];
  
      const fullText = detections[0]?.description || '';
      const words = detections.slice(1).map(w => ({
        text: w.description,
        boundingBox: w.boundingPoly,
      }));
  
      // ✅ Define checklist items
      const checklistLabels = [
        'Signed Method Statement',
        'Signed RAMS',
        'Appropriate PPE',
        'Will work safely',
        'Correct Certs',
        'Knows the fire drill',
        'Knows appointed First Aider',
        'Understands Health & Safety',
        'Had the opportunity to ask questions',
        'Read and understood'
      ];
  
      // ✅ Symbols we'll treat as checked
      const checkedSymbols = ['[x]', '[✓]', '(x)', '(✓)', '(✗)', '✗', '✓'];
  
      const checklistStatus = checklistLabels.map(label => {
        const lowerText = fullText.toLowerCase();
        const labelFound = lowerText.includes(label.toLowerCase());
  
        // Look for the label and any checkmark near it
        const labelIndex = lowerText.indexOf(label.toLowerCase());
        const surrounding = lowerText.slice(labelIndex - 20, labelIndex + label.length + 20);
  
        const isChecked = checkedSymbols.some(sym => surrounding.includes(sym.toLowerCase()));
  
        return {
          item: label,
          checked: labelFound && isChecked,
          rawMatch: surrounding,
        };
      });
  
      return {
        fullText,
        checklistStatus,
        checkboxes: words.filter(w =>
          typeof w.text === 'string' && ['[x]', '[X]', '[ ]', '[✓]', '(✓)', '(x)', '(✗)'].includes(w.text)
        ),
      };
    } catch (error) {
      console.error('❌ Vision API call failed:', error);
      throw error;
    }
  };
  

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