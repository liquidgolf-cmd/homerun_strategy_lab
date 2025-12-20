import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import modulesRoutes from './routes/modules';
import aiRoutes from './routes/ai';
import documentsRoutes from './routes/documents';

const app = express();

// CORS - allow all origins (Firebase Hosting will be on same domain)
app.use(cors({ origin: true }));
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

