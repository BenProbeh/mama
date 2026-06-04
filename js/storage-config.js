/**
 * ★ הקובץ היחיד לעריכה – שמירה חינמית (עובד ממובייל + Vercel)
 * בחר אחת מהאפשרויות למטה והדבק מפתחות. ראה setup.html
 */

// ── אופציה 1: Supabase (חינם) – SETUP-SUPABASE.md ──
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

// ── אופציה 2: JSONBin (חינם, הכי מהיר) – SETUP-JSONBIN.md ──
const JSONBIN_BIN_ID = '';
const JSONBIN_API_KEY = '';

// ── אופציה 3: Google Sheet (חינם) – SETUP-GOOGLE.md ──
const GOOGLE_SCRIPT_URL = '';

// ── אופציה 4: Upstash (לא חובה) ──
const UPSTASH_REDIS_REST_URL = '';
const UPSTASH_REDIS_REST_TOKEN = '';

// ── גיבוי: Formspree (מייל בלבד) ──
const FORMSPREE_ID = '';

function isSupabaseConfigured() {
  return !!(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.indexOf('supabase.co') > -1
  );
}

function isJsonBinConfigured() {
  return !!(JSONBIN_BIN_ID && JSONBIN_API_KEY && JSONBIN_BIN_ID.length > 8);
}

function isGoogleScriptConfigured() {
  return !!(GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.indexOf('script.google.com') > -1);
}

function isUpstashConfigured() {
  return !!(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);
}

function isFormspreeConfigured() {
  return !!(FORMSPREE_ID && FORMSPREE_ID.length > 5 && FORMSPREE_ID !== 'myzqabcd');
}

function hasAnyStorage() {
  return (
    isSupabaseConfigured() ||
    isJsonBinConfigured() ||
    isGoogleScriptConfigured() ||
    isUpstashConfigured() ||
    isFormspreeConfigured()
  );
}

function getActiveStorageName() {
  if (isSupabaseConfigured()) return 'Supabase';
  if (isJsonBinConfigured()) return 'JSONBin';
  if (isGoogleScriptConfigured()) return 'Google Sheets';
  if (isUpstashConfigured()) return 'Upstash';
  if (isFormspreeConfigured()) return 'Formspree (מייל)';
  return 'מקומי (npm start)';
}
