/**
 * Vercel Serverless Function: Module 0 (Current Reality) Endpoints
 * GET /api/modules/module0 - Get Module 0 response
 * POST /api/modules/module0 - Save Module 0 response
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { getModuleResponse, saveModuleResponse, updateUserSession } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Verify authentication
    const user = await verifyAuth(req);

    if (req.method === 'GET') {
      // Get Module 0 response
      const response = await getModuleResponse(user.id, 0);

      if (!response) {
        return res.status(404).json({ error: 'Module 0 response not found' });
      }

      return res.json(response);
    }

    if (req.method === 'POST') {
      // Save Module 0 response
      const { inputMethod, aiTranscript, formData, auditReviewDocument } = req.body;

      if (!inputMethod || (inputMethod !== 'ai' && inputMethod !== 'form')) {
        return res.status(400).json({ error: 'Invalid input method' });
      }

      if (inputMethod === 'ai' && !aiTranscript) {
        return res.status(400).json({ error: 'AI transcript is required for AI input method' });
      }

      if (inputMethod === 'form' && !formData) {
        return res.status(400).json({ error: 'Form data is required for form input method' });
      }

      // If auditReviewDocument is provided, mark as completed
      const completedAt = auditReviewDocument ? new Date().toISOString() : undefined;

      const id = await saveModuleResponse({
        userId: user.id,
        moduleNumber: 0,
        inputMethod,
        aiTranscript,
        formData,
        auditReviewDocument,
        completedAt,
      });

      // If audit review was saved, update user session completion status
      if (auditReviewDocument) {
        await updateUserSession(user.id, {
          currentModule: 1, // Move to next module
          completionStatus: 1, // One module completed
        });
      }

      return res.json({ success: true, id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in module0 handler:', error);

    if (error.message === 'No authorization token provided' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


