import { Router } from 'express';
import {
  getCompletedModuleResponses,
  getFinalDocument,
  saveFinalDocument,
} from '../db/firestore';
import {
  generateCombinedOverview,
  generateActionPlan,
} from '../services/anthropicService';
import type { ModuleResponse } from '../db/firestore';

const router = Router();

// Generate final documents
router.post('/session/:sessionId/generate', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Get all completed module responses
    const responses = await getCompletedModuleResponses(sessionId);

    if (responses.length < 5) {
      return res
        .status(400)
        .json({ error: 'All 5 modules must be completed before generating final documents' });
    }

    // Prepare data for AI generation
    const moduleAudits = responses.map((r) => ({
      moduleNumber: r.moduleNumber,
      auditReview: r.auditReviewDocument || '',
    }));

    const allModuleData = responses.map((r) => ({
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
    const id = await saveFinalDocument({
      sessionId,
      combinedOverviewDocument: combinedOverview,
      actionPlanDocument: actionPlan,
      generatedAt,
    });

    res.json({
      success: true,
      id,
      combinedOverview,
      actionPlan,
      generatedAt,
    });
  } catch (error: any) {
    console.error('Error generating final documents:', error);
    res.status(500).json({ error: error.message || 'Error generating final documents' });
  }
});

// Get final documents
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const documents = await getFinalDocument(sessionId);

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
