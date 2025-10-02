// /api/_db.js — Supabase server client (no Drizzle)
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let _hasSupabase = false;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'public' },
  });
  _hasSupabase = true;
} else {
  console.warn('[ReusableAPI/_db] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Exporting stubbed supabase client for development.');
  // Provide a stub that throws helpful errors if used accidentally
  supabase = new Proxy({}, {
    get() {
      return () => { throw new Error('Supabase client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env for full functionality.'); };
    }
  });
}

// Admin settings singleton support (UUID or INT)
const ADMIN_SETTINGS_ID = process.env.ADMIN_SETTINGS_ID || null; // UUID string
const ADMIN_SETTINGS_ID_INT = process.env.ADMIN_SETTINGS_ID_INT ? parseInt(process.env.ADMIN_SETTINGS_ID_INT, 10) : 1;

async function getAdminSettings() {
  // If Supabase is configured, prefer reading admin settings from DB
  if (_hasSupabase) {
    // Try UUID if provided
    if (ADMIN_SETTINGS_ID) {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('id, settings')
        .eq('id', ADMIN_SETTINGS_ID)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      if (data?.settings) return data.settings;
    }
    // Fallback to integer id=1
    const { data: data2, error: err2 } = await supabase
      .from('admin_settings')
      .select('id, settings')
      .eq('id', ADMIN_SETTINGS_ID_INT)
      .maybeSingle();
    if (err2 && err2.code !== 'PGRST116') throw err2;
    return data2?.settings || {};
  }

  // Supabase not configured: attempt to read admin settings from env
  try {
    const envSettings = process.env.ADMIN_SETTINGS_JSON;
    if (envSettings) return JSON.parse(envSettings);
  } catch (e) {
    console.warn('[ReusableAPI/_db] Failed to parse ADMIN_SETTINGS_JSON:', e && e.message ? e.message : e);
  }
  return {};
}

async function setAdminSettings(nextSettings) {
  if (_hasSupabase) {
    const payloadUUID = ADMIN_SETTINGS_ID ? { id: ADMIN_SETTINGS_ID, settings: nextSettings } : null;
    if (payloadUUID) {
      const { error } = await supabase
        .from('admin_settings')
        .upsert(payloadUUID, { onConflict: 'id' });
      if (!error) return true;
      // If type mismatch (e.g. id is integer), fall through to INT path
    }
    const payloadInt = { id: ADMIN_SETTINGS_ID_INT, settings: nextSettings };
    const { error: err2 } = await supabase
      .from('admin_settings')
      .upsert(payloadInt, { onConflict: 'id' });
    if (err2) throw err2;
    return true;
  }

  // If supabase not configured, persist to an environment-backed fallback
  console.warn('[ReusableAPI/_db] Supabase not configured; setAdminSettings will not persist beyond process lifetime.');
  process.IN_MEMORY_ADMIN_SETTINGS = nextSettings;
  return true;
}

module.exports = { supabase, getAdminSettings, setAdminSettings };
