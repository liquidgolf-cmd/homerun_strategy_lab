/**
 * Vercel Serverless Function: AI Chat Endpoint
 * POST /api/ai/chat
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { chatWithCoach } from '../lib/anthropic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    await verifyAuth(req);

    const { messages, moduleContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!moduleContext) {
      return res.status(400).json({ error: 'Module context is required' });
    }

    const response = await chatWithCoach(messages, moduleContext);
    return res.json({ message: response });
  } catch (error: any) {
    console.error('Error in chat:', error);

    if (error.message === 'No authorization token provided' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || 'Error generating chat response' });
  }
}

