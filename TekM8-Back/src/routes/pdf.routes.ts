import express from 'express';
import { analyzePdfController } from '../controllers/pdf.controller';

const router = express.Router();

router.post('/analyze-pdf', analyzePdfController);

export default router;
