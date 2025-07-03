import express from 'express';
import { handleVisionExtract } from '../controllers/vision.controller';

const router = express.Router();

router.post('/extract', handleVisionExtract);

export default router;
