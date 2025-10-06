// api/db.ts
import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are set
const hasSupabaseConfig = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!hasSupabaseConfig) {
  console.warn('⚠️  Supabase environment variables are not set. Running in development mode with mock data.');
}

// Create Supabase client only if environment variables are available
export const supabase = hasSupabaseConfig 
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { 
        auth: { 
          persistSession: false,
          autoRefreshToken: false
        },
        db: { 
          schema: 'public' 
        }
      }
    )
  : null; // Mock client for development

// Named export for backwards compatibility
export { supabase as db };