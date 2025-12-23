/**
 * Vercel Serverless Function: Module 3 Endpoints
 * GET /api/modules/module3 - Get Module 3 response
 * POST /api/modules/module3 - Save Module 3 response
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { getModuleResponse, saveModuleResponse, updateUserSession } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const user = await verifyAuth(req);

    if (req.method === 'GET') {
      const response = await getModuleResponse(user.id, 3);
      if (!response) {
        return res.status(404).json({ error: 'Module 3 response not found' });
      }
      return res.json(response);
    }

    if (req.method === 'POST') {
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

      const completedAt = auditReviewDocument ? new Date().toISOString() : undefined;

      await saveModuleResponse({
        userId: user.id,
        moduleNumber: 3,
        inputMethod,
        aiTranscript,
        formData,
        auditReviewDocument,
        completedAt,
      });

      if (auditReviewDocument) {
        await updateUserSession(user.id, {
          currentModule: 4,
          completionStatus: 4,
        });
      }

      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in module3 handler:', error);

    if (error.message === 'No authorization token provided' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}


