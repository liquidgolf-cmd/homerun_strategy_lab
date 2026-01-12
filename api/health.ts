/**
 * Vercel Serverless Function: Health Check
 * GET /api/health
 * This endpoint keeps Supabase active by performing a lightweight query
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Perform a lightweight Supabase query to keep it active
    // This queries the user_sessions table with a limit of 1
    const { data, error } = await supabase
      .from('user_sessions')
      .select('count')
      .limit(1);

    // Even if there's an error or no data, the connection attempt keeps Supabase active
    const supabaseStatus = error ? 'connected (error expected if no data)' : 'connected';

    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: supabaseStatus,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });
  } catch (error: any) {
    // Even if there's an error, return success - the connection attempt is what matters
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: 'connection attempted',
      error: error.message,
      note: 'Keep-alive ping executed',
    });
  }
}

