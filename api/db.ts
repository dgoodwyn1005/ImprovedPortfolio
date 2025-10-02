// api/db.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set');
}

// Server-side client (use Service Role key for full access)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { 
    auth: { 
      persistSession: false,
      autoRefreshToken: false
    },
    db: { 
      schema: 'public' 
    }
  }
);

// Named export for backwards compatibility
export { supabase as db };