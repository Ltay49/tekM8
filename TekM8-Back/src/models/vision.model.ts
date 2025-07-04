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
  
    console.log('📄 OCR TEXT:\n', text);
  
    // Better name extraction (first all-uppercase full name after "CSCS")
    const lines = text.split('\n');
    const nameLine = lines.find(line =>
      /^[A-Z]+\s[A-Z]+$/.test(line.trim()) && line.trim() !== 'CSCS CONSTRUCTION SKILLS CERTIFICATION SCHEME'
    );
  
    // Better REG NO. extraction — find line with digits after "REG. NO."
    const regLineIndex = lines.findIndex(line => /REG(ISTRATION)?\.?\s*NO\.?/i.test(line));
    const regNumber = regLineIndex !== -1 && lines[regLineIndex + 1]
      ? lines[regLineIndex + 1].match(/\d{6,10}/)?.[0] || null
      : null;
  
    // Match expiry date
    const expiryMatch = text.match(/EXPIRES(?: END)?\s*([A-Za-z]+\s\d{4})/i);
  
    return {
      rawText: text,
      name: nameLine?.trim() || null,
      regNumber: regNumber,
      expiry: expiryMatch?.[1] || null,
    };
  }
  