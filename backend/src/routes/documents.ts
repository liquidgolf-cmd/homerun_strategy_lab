import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/schema';
import {
  generateCombinedOverview,
  generateActionPlan,
} from '../services/anthropicService';
interface ModuleResponse {
  id: string;
  sessionId: string;
  moduleNumber: number;
  inputMethod: 'ai' | 'form';
  aiTranscript?: Array<{ role: string; content: string }>;
  formData?: Record<string, any>;
  auditReviewDocument?: string;
  completedAt?: string;
}

const router = Router();

// Generate final documents
router.post('/session/:sessionId/generate', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Get all completed module responses
    const responses = db
      .prepare(
        'SELECT * FROM module_responses WHERE sessionId = ? AND completedAt IS NOT NULL ORDER BY moduleNumber'
      )
      .all(sessionId) as any[];

    if (responses.length < 5) {
      return res
        .status(400)
        .json({ error: 'All 5 modules must be completed before generating final documents' });
    }

    // Parse responses
    const parsedResponses: ModuleResponse[] = responses.map((r) => ({
      ...r,
      aiTranscript: r.aiTranscript ? JSON.parse(r.aiTranscript) : undefined,
      formData: r.formData ? JSON.parse(r.formData) : undefined,
    }));

    // Prepare data for AI generation
    const moduleAudits = parsedResponses.map((r) => ({
      moduleNumber: r.moduleNumber,
      auditReview: r.auditReviewDocument || '',
    }));

    const allModuleData = parsedResponses.map((r) => ({
      moduleNumber: r.moduleNumber,
      auditReview: r.auditReviewDocument || '',
      responses: {
        inputMethod: r.inputMethod,
        aiTranscript: r.aiTranscript,
        formData: r.formData,
      },
    }));

    // Generate documents
    const [combinedOverview, actionPlan] = await Promise.all([
      generateCombinedOverview(moduleAudits),
      generateActionPlan(allModuleData),
    ]);

    // Save final documents
    const generatedAt = new Date().toISOString();

    // Check if exists
    const existing = db.prepare('SELECT id FROM final_documents WHERE sessionId = ?').get(sessionId);

    if (existing) {
      db.prepare(
        'UPDATE final_documents SET combinedOverviewDocument = ?, actionPlanDocument = ?, generatedAt = ? WHERE sessionId = ?'
      ).run(combinedOverview, actionPlan, generatedAt, sessionId);
      res.json({
        success: true,
        id: (existing as any).id,
        combinedOverview,
        actionPlan,
        generatedAt,
      });
    } else {
      const id = uuidv4();
      db.prepare(
        'INSERT INTO final_documents (id, sessionId, combinedOverviewDocument, actionPlanDocument, generatedAt) VALUES (?, ?, ?, ?, ?)'
      ).run(id, sessionId, combinedOverview, actionPlan, generatedAt);
      res.json({
        success: true,
        id,
        combinedOverview,
        actionPlan,
        generatedAt,
      });
    }
  } catch (error: any) {
    console.error('Error generating final documents:', error);
    res.status(500).json({ error: error.message || 'Error generating final documents' });
  }
});

// Get final documents
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const documents = db
      .prepare('SELECT * FROM final_documents WHERE sessionId = ?')
      .get(sessionId) as any;

    if (!documents) {
      return res.status(404).json({ error: 'Final documents not found' });
    }

    res.json(documents);
  } catch (error: any) {
    console.error('Error getting final documents:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

