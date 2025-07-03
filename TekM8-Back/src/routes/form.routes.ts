import express from 'express';
import { handleFormFill } from '../controllers/form.controller';

const router = express.Router();

router.post('/fill', handleFormFill);

export default router;
