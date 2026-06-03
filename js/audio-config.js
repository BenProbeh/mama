/**
 * ═══════════════════════════════════════════════════════════════
 *  הגדרות אודיו – רק כאן משנים את שמות הקבצים!
 * ═══════════════════════════════════════════════════════════════
 */

// ▼▼▼ שורות 9–13: שמות קבצי האודיו שלך ▼▼▼
const AUDIO_FILES = {
  italian: 'mamma-mia_C2DrtQA.mp3',
  burger: 'hamburger-cheeseburger-bigmac-whopper.mp3',
  asian: '1080p-kaguya-sama-wk-03_trim1-online-audio-converter.mp3'
};
// ▲▲▲ סוף אזור שמות קבצים ▲▲▲

const AUDIO_BASE_PATH = '';
const AUDIO_PLAY_KEY = 'cuisineAudioPlay';

function getCuisineAudio() {
  return document.getElementById('cuisine-audio');
}

function playCuisineAudio(type, startAt) {
  const fileName = AUDIO_FILES[type];
  if (!fileName) return;

  const audio = getCuisineAudio();
  if (!audio) return;

  const offset = typeof startAt === 'number' ? startAt : 0;
  let started = false;

  function begin() {
    if (started) return;
    started = true;
    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = Math.min(offset, Math.max(0, audio.duration - 0.05));
    } else {
      audio.currentTime = offset;
    }
    audio.play().catch(function () {
      console.log('הדפדפן חסם השמעה – נסי ללחוץ שוב');
    });
  }

  audio.addEventListener('loadedmetadata', begin, { once: true });
  audio.addEventListener('canplay', begin, { once: true });
  audio.src = AUDIO_BASE_PATH + fileName;
  audio.load();
}

/**
 * לחיצה בדף הבית: מעבר מיידי + המשך השיר בדף הבא מהשנייה הנכונה
 */
function goWithAudio(type, url) {
  sessionStorage.setItem(
    AUDIO_PLAY_KEY,
    JSON.stringify({ type: type, startedAt: Date.now() })
  );

  playCuisineAudio(type, 0);

  window.location.href = url;
}

/**
 * בדף המטבח – ממשיך את השיר מהמקום שבו נעצר בדף הבית
 * @param {'italian'|'burger'|'asian'} pageType
 */
function resumeCuisineAudio(pageType) {
  const raw = sessionStorage.getItem(AUDIO_PLAY_KEY);
  if (!raw) return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }

  if (!data || data.type !== pageType) return;

  const elapsed = Math.max(0, (Date.now() - data.startedAt) / 1000);
  playCuisineAudio(pageType, elapsed);
}
