/**
 * ═══════════════════════════════════════════════════════════════
 *  הדבק כאן את המפתחות מ-Supabase (פעם אחת)
 *  הוראות: SETUP-SUPABASE.md
 * ═══════════════════════════════════════════════════════════════
 */

// ▼▼▼ Project URL מ-Supabase → Settings → API ▼▼▼
const SUPABASE_URL = '';

// ▼▼▼ anon public key מ-Supabase → Settings → API ▼▼▼
const SUPABASE_ANON_KEY = '';

function isSupabaseConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.indexOf('supabase.co') > -1);
}
