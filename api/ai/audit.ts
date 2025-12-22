/**
 * Vercel Serverless Function: Generate Audit Review
 * POST /api/ai/audit
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { generateAuditReview, module0AuditPrompt } from '../lib/anthropic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    await verifyAuth(req);

    const { moduleNumber, aiTranscript, formData } = req.body;

    // MVP: Only support Module 0
    if (moduleNumber !== 0) {
      return res.status(400).json({ error: 'Only Module 0 is supported in MVP' });
    }

    if (!aiTranscript && !formData) {
      return res.status(400).json({ error: 'Either aiTranscript or formData is required' });
    }

    // Generate audit review using Module 0 prompt
    const review = await generateAuditReview(moduleNumber, module0AuditPrompt, {
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

