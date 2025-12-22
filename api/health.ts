/**
 * Vercel Serverless Function: Health Check
 * GET /api/health
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const envCheck = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
  };

  const missing = Object.entries(envCheck)
    .filter(([_, exists]) => !exists)
    .map(([key]) => key);

  if (missing.length > 0) {
    return res.status(500).json({
      status: 'error',
      message: 'Missing environment variables',
      missing,
      note: 'Please set these in Vercel Dashboard → Settings → Environment Variables',
    });
  }

  return res.json({
    status: 'ok',
    environment: {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    },
  });
}

