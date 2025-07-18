import express from 'express';
import multer from 'multer';
import { handleVisionExtract, extractCardData, extractAndInstruct } from '../controllers/vision.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 🔹 Route for raw JSON text-based Vision requests (expects imagePath in body)
router.post('/extract-text', handleVisionExtract);

//notes route
router.post(
  '/extract-and-instruct',
  upload.single('image'),
  extractAndInstruct
);


// 🔹 Route for image file uploads (expects image field 'cardImage')

router.post(
    '/extract',
    upload.fields([
      { name: 'frontImage', maxCount: 1 },
      { name: 'backImage', maxCount: 1 },
    ]),
    extractCardData
  );
  
  export default router;

