/**
 * Vercel Serverless Function: Generate Final Documents
 * POST /api/documents/generate - Generate combined overview and action plan
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { getAllModuleResponses } from '../lib/supabase';
import { generateCombinedOverview, generateActionPlan } from '../lib/anthropic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const user = await verifyAuth(req);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get all module responses for the user
    const allModuleResponses = await getAllModuleResponses(user.id);

    // Verify all 5 modules are completed
    if (allModuleResponses.length < 5) {
      return res.status(400).json({
        error: 'All 5 modules must be completed before generating final documents',
        completedModules: allModuleResponses.length,
      });
    }

    // Check that all modules have audit review documents
    const incompleteModules = allModuleResponses.filter(
      (r) => !r.auditReviewDocument || !r.completedAt
    );
    if (incompleteModules.length > 0) {
      return res.status(400).json({
        error: 'All modules must have completed audit reviews',
        incompleteModules: incompleteModules.map((r) => r.moduleNumber),
      });
    }

    // Generate both documents
    const [combinedOverview, actionPlan] = await Promise.all([
      generateCombinedOverview(allModuleResponses),
      generateActionPlan(allModuleResponses),
    ]);

    return res.json({
      success: true,
      combinedOverview,
      actionPlan,
    });
  } catch (error: any) {
    console.error('Error generating final documents:', error);

    if (error.message === 'No authorization token provided' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

