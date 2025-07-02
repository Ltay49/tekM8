// src/routes/vision.routes.ts
import express from 'express';
import { analyzeImageController } from '../controllers/vision.controller';

const router = express.Router();

router.post('/analyze', analyzeImageController);

export default router;
