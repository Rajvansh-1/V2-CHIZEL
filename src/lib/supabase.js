// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';
import { fetchWithRetry } from './fetchWithRetry';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseKey);

if (!SUPABASE_CONFIGURED) {
  // eslint-disable-next-line no-console
  console.error(
    '[Chizel] ERROR: Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Cloudflare Pages project settings (Production).'
  );
}

const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalKey = supabaseKey || 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: fetchWithRetry,
  },
});

export function getSupabaseConfigErrorMessage() {
  return 'Auth is temporarily unavailable (server misconfiguration). Please try again later.';
}
