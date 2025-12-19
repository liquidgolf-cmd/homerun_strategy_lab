import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import modulesRoutes from './routes/modules';
import aiRoutes from './routes/ai';
import documentsRoutes from './routes/documents';
import './db/schema'; // Initialize database

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/modules', modulesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

