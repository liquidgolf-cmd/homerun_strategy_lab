import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import modulesRoutes from './routes/modules';
import aiRoutes from './routes/ai';
import documentsRoutes from './routes/documents';

const app = express();

// CORS - allow all origins (Vercel, Firebase Hosting, localhost)
// This handles preflight OPTIONS requests properly
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());

// API routes - these will be accessible at /api/modules, /api/ai, /api/documents
app.use('/modules', modulesRoutes);
app.use('/ai', aiRoutes);
app.use('/documents', documentsRoutes);

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

// Export as Firebase Cloud Function
// This will be accessible at /api/* based on firebase.json rewrites
export const api = functions.https.onRequest(app);

