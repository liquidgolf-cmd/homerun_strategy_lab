import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import modulesRoutes from './routes/modules';
import aiRoutes from './routes/ai';
import documentsRoutes from './routes/documents';
import './db/schema'; // Initialize database

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes must come before static file serving
app.use('/api/modules', modulesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));
  
  // Serve React app for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

