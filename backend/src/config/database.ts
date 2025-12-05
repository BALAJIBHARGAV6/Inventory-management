/**
 * Supabase Database Configuration
 * @module config/database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Reload environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Environment variables (required)
const SUPABASE_URL: string = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY: string = process.env.SUPABASE_SERVICE_KEY || '';

console.log('Database config environment check:');
console.log('SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set');
console.log('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'Set' : 'Not set');
console.log('Full SUPABASE_URL:', SUPABASE_URL.substring(0, 30) + '...');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not configured');
  console.warn('Database operations will be disabled. Please configure environment variables.');
}

/**
 * Supabase client instance with service role privileges
 * Used for server-side operations with full database access
 */
export const supabase: SupabaseClient | null = SUPABASE_URL && SUPABASE_SERVICE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export default supabase;
