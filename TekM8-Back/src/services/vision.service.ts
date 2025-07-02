import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

export async function analyzeImage(imageBase64: string) {
  const [result] = await client.labelDetection({
    image: {
      content: imageBase64,
    },
  });
  return result.labelAnnotations;
}
