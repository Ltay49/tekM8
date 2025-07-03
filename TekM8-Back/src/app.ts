import express from 'express';
import cors from 'cors';
import visionRoutes from './routes/vision.routes';
import formRoutes from './routes/form.routes';

const app = express();
app.use(express.json());

app.use('/form', formRoutes);

app.use(cors());
app.use(express.json());

app.use('/vision', visionRoutes);

export default app;


