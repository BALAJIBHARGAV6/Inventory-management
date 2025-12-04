/**
 * Supabase Database Configuration
 * @module config/database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables (required)
const SUPABASE_URL: string = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY: string = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not configured');
}

/**
 * Supabase client instance with service role privileges
 * Used for server-side operations with full database access
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
