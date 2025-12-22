/**
 * JWT Verification Helper for Vercel Serverless Functions
 * Verifies Supabase JWT tokens and extracts user info
 */

import { createClient } from '@supabase/supabase-js';
import { VercelRequest } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase admin client lazily (will be created when needed)
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      const missing = [];
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      throw new Error(`Missing environment variables: ${missing.join(', ')}. Please set them in Vercel dashboard.`);
    }
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdmin;
}

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

  try {
    // Get Supabase admin client (will throw if env vars missing)
    const admin = getSupabaseAdmin();

    // Verify the JWT token and get user
    const {
      data: { user },
      error,
    } = await admin.auth.getUser(token);

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

