import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null as any;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
} else {
  console.warn('[api/supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set; supabase helper will be a stub.');
  supabase = {
    auth: {
      getUser: async () => ({ error: new Error('Supabase not configured') }),
    },
    from: () => ({ select: async () => ({ error: new Error('Supabase not configured') }) })
  } as any;
}

export function getSupabaseServerClient() {
  return supabase;
}

export async function verifySupabaseToken(token: string) {
  if (!supabase || !supabase.auth) return null;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return data?.user || null;
  } catch (e) {
    return null;
  }
}
