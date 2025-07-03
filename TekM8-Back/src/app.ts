import express from 'express';
import cors from 'cors';
import path from 'path'; // ✅ make sure this is imported
import visionRoutes from './routes/vision.routes';
import formRoutes from './routes/form.routes';

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Add this line to serve the "uploads" folder as a static path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Your routes
app.use('/form', formRoutes);
app.use('/vision', visionRoutes);

export default app;


