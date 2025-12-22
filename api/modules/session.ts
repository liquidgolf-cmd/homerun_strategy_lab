/**
 * Vercel Serverless Function: Get or Create User Session
 * GET /api/modules/session
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../auth/verify';
import { getOrCreateUserSession } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const user = await verifyAuth(req);

    // Get or create user session
    const userSession = await getOrCreateUserSession(user.id, user.email, user.name);

    console.log('Session retrieved/created successfully:', { userId: userSession.userId });

    res.json({
      user: {
        id: userSession.userId,
        email: userSession.email || user.email,
        name: userSession.name,
      },
      session: {
        userId: userSession.userId,
        currentModule: userSession.currentModule,
        completionStatus: userSession.completionStatus,
        createdAt: userSession.createdAt,
        updatedAt: userSession.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error getting/creating session:', error);
    console.error('Error stack:', error.stack);
    
    if (error.message === 'No authorization token provided' || error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }

    // Provide more helpful error messages
    let errorMessage = 'Internal server error';
    if (error.message?.includes('SUPABASE_URL') || error.message?.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      errorMessage = 'Server configuration error: Missing Supabase credentials';
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

