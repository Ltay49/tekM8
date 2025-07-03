import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export const convertPdfToImage = async (pdfPath: string): Promise<string> => {
  const outputDir = path.dirname(pdfPath);
  const outputFilePrefix = 'converted-page';
  const outputFile = path.join(outputDir, `${outputFilePrefix}-1.png`);

  const cmd = `pdftocairo -png -f 1 -l 1 -scale-to 1024 "${pdfPath}" "${path.join(outputDir, outputFilePrefix)}"`;

  await new Promise<void>((resolve, reject) => {
    exec(cmd, (error: Error | null) => {
      if (error) {
        console.error('❌ PDF conversion failed:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });

  if (!fs.existsSync(outputFile)) {
    throw new Error('❌ PDF to image conversion failed — output file not found');
  }

  return outputFile;
};
