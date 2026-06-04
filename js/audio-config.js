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

/** iPhone / מובייל – Safari לא ממשיך אודיו אחרי מעבר דף */
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/** פותח השמעה באייפון – במגע ראשון בדף הבית */
function initAudioUnlock() {
  const audio = getCuisineAudio();
  if (!audio || window.__audioUnlocked) return;

  function unlock() {
    if (window.__audioUnlocked) return;
    window.__audioUnlocked = true;
    document.removeEventListener('touchstart', unlock, true);

    const fileName = AUDIO_FILES.italian;
    if (!fileName) return;

    audio.src = AUDIO_BASE_PATH + fileName;
    audio.currentTime = 0;
    audio.play()
      .then(function () {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(function () {});
  }

  document.addEventListener('touchstart', unlock, { once: true, capture: true, passive: true });
}

/**
 * הפעלה מיידית בתוך לחיצה – חובה לאייפון
 */
function playInUserGesture(type, startAt) {
  const fileName = AUDIO_FILES[type];
  const audio = getCuisineAudio();
  if (!fileName || !audio) return Promise.reject();

  const offset = typeof startAt === 'number' ? startAt : 0;
  audio.src = AUDIO_BASE_PATH + fileName;
  audio.currentTime = offset;
  return audio.play();
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
      console.log('הדפדפן חסם השמעה');
    });
  }

  audio.addEventListener('loadedmetadata', begin, { once: true });
  audio.addEventListener('canplay', begin, { once: true });
  audio.src = AUDIO_BASE_PATH + fileName;
  audio.load();
}

/**
 * לחיצה על כפתור בדף הבית
 * מובייל: השמעה מלאה בדף הבית (בתוך הלחיצה) ואז מעבר
 * מחשב: מעבר מיידי + המשך בדף המטבח
 */
function goWithAudio(ev, type, url) {
  if (ev && ev.preventDefault) ev.preventDefault();

  if (isTouchDevice()) {
    sessionStorage.removeItem(AUDIO_PLAY_KEY);

    const audio = getCuisineAudio();
    if (!audio) {
      window.location.href = url;
      return;
    }

    let left = false;
    function goNext() {
      if (left) return;
      left = true;
      window.location.href = url;
    }

    audio.addEventListener('ended', goNext, { once: true });
    audio.addEventListener('error', goNext, { once: true });

    playInUserGesture(type, 0)
      .catch(function () {
        playCuisineAudio(type, 0);
        setTimeout(goNext, 800);
      });

    return;
  }

  sessionStorage.setItem(
    AUDIO_PLAY_KEY,
    JSON.stringify({ type: type, startedAt: Date.now() })
  );

  playCuisineAudio(type, 0);
  window.location.href = url;
}

/**
 * מחשב בלבד – המשך אודיו בדף המטבח
 */
function resumeCuisineAudio(pageType) {
  if (isTouchDevice()) return;

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

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioUnlock);
  } else {
    initAudioUnlock();
  }
}
