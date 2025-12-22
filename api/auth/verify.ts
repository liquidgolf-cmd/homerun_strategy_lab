/**
 * JWT Verification Helper for Vercel Serverless Functions
 * Verifies Supabase JWT tokens and extracts user info
 */

import { createClient } from '@supabase/supabase-js';
import { VercelRequest } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

// Create Supabase admin client for JWT verification
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

/**
 * Verify JWT token from request and return user info
 */
export async function verifyAuth(req: VercelRequest): Promise<AuthenticatedUser> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Verify the JWT token and get user
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid or expired token');
  }

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
  };
}

