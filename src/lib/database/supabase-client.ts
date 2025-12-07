import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for client-side operations (uses anon key)
export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Admin client for server-side operations (uses service role key)
export function createSupabaseAdmin() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Verify database connection
export async function verifyConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('parts').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected initially)
      return { connected: false, error: error.message };
    }
    return { connected: true };
  } catch (error: any) {
    return { connected: false, error: error.message };
  }
}

