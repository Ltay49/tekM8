// form.routes.ts
import express from 'express';
import multer from 'multer';
import { handleFormFill } from '../controllers/form.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/fill', upload.single('formImage'), handleFormFill);

export default router;
