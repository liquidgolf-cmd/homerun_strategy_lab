import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import modulesRoutes from './routes/modules';
import aiRoutes from './routes/ai';
import documentsRoutes from './routes/documents';

const app = express();

// CORS - allow requests from Vercel and Firebase Hosting
const allowedOrigins = [
  'https://homerun-strategy-lab.vercel.app',
  'https://homerun-strategy-lab-*.vercel.app', // Preview deployments
  'https://*.vercel.app', // All Vercel deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        // Simple wildcard matching for Vercel domains
        return origin.includes('vercel.app');
      }
      return origin === allowed;
    })) {
      callback(null, true);
    } else {
      // For development, allow localhost
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        // Allow all origins for now (you can restrict this in production)
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

