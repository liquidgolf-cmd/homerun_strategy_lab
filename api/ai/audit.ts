/**
 * Vercel Serverless Function: Generate Audit Review
 * POST /api/ai/audit
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { generateAuditReview, getAuditPrompt } from '../lib/anthropic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    await verifyAuth(req);

    const { moduleNumber, aiTranscript, formData } = req.body;

    // Validate module number
    if (typeof moduleNumber !== 'number' || moduleNumber < 0 || moduleNumber > 4) {
      return res.status(400).json({ error: 'Invalid module number. Must be 0-4' });
    }

    if (!aiTranscript && !formData) {
      return res.status(400).json({ error: 'Either aiTranscript or formData is required' });
    }

    // Get the appropriate audit prompt for this module
    const auditPrompt = getAuditPrompt(moduleNumber);

    // Generate audit review using module-specific prompt
    const review = await generateAuditReview(moduleNumber, auditPrompt, {
      aiTranscript,
      formData,
    });

    return res.json({ auditReview: review });
  } catch (error: any) {
    console.error('Error generating audit review:', error);

    if (error.message === 'No authorization token provided' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || 'Error generating audit review' });
  }
}

