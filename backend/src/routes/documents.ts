import { Router } from 'express';
import { verifyAuth } from '../middleware/auth';
import {
  getCompletedModuleResponses,
  getFinalDocument,
  saveFinalDocument,
} from '../db/supabase';
import {
  generateCombinedOverview,
  generateActionPlan,
} from '../services/anthropicService';
import type { ModuleResponse } from '../db/supabase';

const router = Router();

// Generate final documents (requires authentication)
router.post('/session/:sessionId/generate', verifyAuth, async (req, res) => {
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

// Get final documents (requires authentication)
router.get('/session/:sessionId', verifyAuth, async (req, res) => {
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
