/**
 * ═══════════════════════════════════════════════════════════════
 *  בחר אחת מהאפשרויות (הכי מהיר: Formspree – 2 דקות)
 *  הוראות: SETUP-STORAGE.md
 * ═══════════════════════════════════════════════════════════════
 */

// אפשרות 1 – Supabase (מומלץ לאדמין באתר)
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

// אפשרות 2 – Formspree (מהיר: מקבל מייל על כל בחירה)
// https://formspree.io → New Form → העתק את ה-ID מהכתובת f/xxxxxxxx
const FORMSPREE_ID = '';

// אפשרות 3 – Google Apps Script (ראה SETUP-STORAGE.md)
const GOOGLE_SCRIPT_URL = '';

function isSupabaseConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.indexOf('supabase.co') > -1);
}

function isFormspreeConfigured() {
  return !!(FORMSPREE_ID && FORMSPREE_ID.length > 5);
}

function isGoogleScriptConfigured() {
  return !!(GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.indexOf('script.google.com') > -1);
}

function hasAnyStorage() {
  return isSupabaseConfigured() || isFormspreeConfigured() || isGoogleScriptConfigured();
}
