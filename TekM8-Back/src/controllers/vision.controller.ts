import { Request, Response, NextFunction } from 'express';
import { analyzeImage } from '../services/vision.service';

// export const analyzeImageController = async (req: Request, res: Response, next: NextFunction) => {
//   const { imageBase64 } = req.body;

//   if (!imageBase64) {
//     return res.status(400).json({ error: 'Missing image data' });
//   }

//   try {
//     const labels = await analyzeImage(imageBase64);
//     res.status(200).json({ labels });
//   } catch (error) {
//     next(error);
//   }
// };

export const analyzeImageController = async (
    req: Request,
    res: Response,
    next: NextFunction
) : Promise<void> =>{

    const { imageBase64 } = req.body;
      
    try {
      const labels = await analyzeImage(imageBase64);
      res.status(200).json({ labels });
    } catch (error) {
      next(error);
    }
}