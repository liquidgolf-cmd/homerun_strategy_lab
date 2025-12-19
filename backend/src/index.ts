import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import modulesRoutes from './routes/modules';
import aiRoutes from './routes/ai';
import documentsRoutes from './routes/documents';

const app = express();

// CORS - allow all origins (Firebase Hosting will be on same domain)
app.use(cors({ origin: true }));
app.use(express.json());

// API routes
app.use('/modules', modulesRoutes);
app.use('/ai', aiRoutes);
app.use('/documents', documentsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export as Firebase Cloud Function
export const api = functions.https.onRequest(app);

