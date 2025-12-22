/**
 * JWT Verification Helper for Vercel Serverless Functions
 * Verifies Supabase JWT tokens and extracts user info
 */

import { createClient } from '@supabase/supabase-js';
import { VercelRequest } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check environment variables at module load time
if (!supabaseUrl || !supabaseServiceRoleKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  // Don't throw at module load - throw when function is called so we can return a proper error
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
  // Check environment variables
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    throw new Error(`Missing environment variables: ${missing.join(', ')}. Please set them in Vercel dashboard.`);
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify the JWT token and get user
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error('Supabase auth error:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
    };
  } catch (error: any) {
    console.error('Error in verifyAuth:', error);
    throw error;
  }
}

