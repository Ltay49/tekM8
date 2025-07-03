import express from 'express';
import multer from 'multer';
import { convertPdfToImageController } from '../controllers/pdf.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/pdf-to-image', upload.single('pdfFile'), convertPdfToImageController);

export default router;

