/**
 * ═══════════════════════════════════════════════════════════════
 *  ★ הקובץ היחיד לעריכה
 *  הדבק את 2 המפתחות מ-Upstash (חינם, 2 דקות)
 *  הוראות: SETUP-UPSTASH.md
 * ═══════════════════════════════════════════════════════════════
 */

// ▼▼▼ Upstash Redis – מ-Upstash Console → Database → REST API ▼▼▼
const UPSTASH_REDIS_REST_URL = '';
const UPSTASH_REDIS_REST_TOKEN = '';

// גיבוי: Formspree (מייל) – אופציונלי
const FORMSPREE_ID = '';

// גיבוי: Supabase (טבלה ב-admin) – אופציונלי
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

const GOOGLE_SCRIPT_URL = '';

function isUpstashConfigured() {
  return !!(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);
}

function isSupabaseConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.indexOf('supabase.co') > -1);
}

function isFormspreeConfigured() {
  return !!(FORMSPREE_ID && FORMSPREE_ID.length > 5 && FORMSPREE_ID !== 'myzqabcd');
}

function isGoogleScriptConfigured() {
  return !!(GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.indexOf('script.google.com') > -1);
}

function hasAnyStorage() {
  return (
    isUpstashConfigured() ||
    isSupabaseConfigured() ||
    isFormspreeConfigured() ||
    isGoogleScriptConfigured()
  );
}
