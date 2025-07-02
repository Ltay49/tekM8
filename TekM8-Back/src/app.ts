import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdf.routes';
import visionRoutes from './routes/vision.routes'; // your existing vision routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vision', visionRoutes);
app.use('/pdf', pdfRoutes); // Add PDF routes

// error handler etc...

export default app;


