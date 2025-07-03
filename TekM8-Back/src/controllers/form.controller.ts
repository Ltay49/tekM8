import { Request, Response } from 'express';
import { fillFormImage } from '../models/form-filler.model';

export const handleFormFill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imagePath, userDetails, checkedItems } = req.body;

    if (!imagePath || typeof imagePath !== 'string') {
      res.status(400).json({ error: 'Missing imagePath' });
      return;
    }

    if (!userDetails || typeof userDetails !== 'object') {
      res.status(400).json({ error: 'Missing userDetails object' });
      return;
    }

    const filledPath = await fillFormImage(imagePath, userDetails, checkedItems);
    res.json({ filledPath });
  } catch (error) {
    console.error('❌ Form fill failed:', error);
    res.status(500).json({ error: 'Failed to fill form' });
  }
};
