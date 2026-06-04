/**
 * הגדרות אודיו – שמות קבצים
 */
const AUDIO_FILES = {
  italian: 'mamma-mia_C2DrtQA.mp3',
  burger: 'hamburger-cheeseburger-bigmac-whopper.mp3',
  asian: '1080p-kaguya-sama-wk-03_trim1-online-audio-converter.mp3'
};

const AUDIO_BASE_PATH = '';
const AUDIO_PLAY_KEY = 'cuisineAudioPlay';

function getCuisineAudio() {
  return document.getElementById('cuisine-audio');
}

function playCuisineAudio(type, startAt) {
  const fileName = AUDIO_FILES[type];
  const audio = getCuisineAudio();
  if (!fileName || !audio) return;

  const offset = typeof startAt === 'number' ? startAt : 0;
  audio.src = AUDIO_BASE_PATH + fileName;
  audio.currentTime = offset;
  audio.play().catch(function () {});
}

/** לחיצה בדף הבית – מעבר מיידי + אודיו בדף הבא */
function goWithAudio(ev, type, url) {
  if (ev && ev.preventDefault) ev.preventDefault();

  sessionStorage.setItem(
    AUDIO_PLAY_KEY,
    JSON.stringify({ type: type, startedAt: Date.now() })
  );

  const audio = getCuisineAudio();
  const fileName = AUDIO_FILES[type];
  if (audio && fileName) {
    audio.src = AUDIO_BASE_PATH + fileName;
    audio.currentTime = 0;
    audio.play().catch(function () {});
  }

  window.location.href = url;
}

/** המשך אודיו בדף המטבח (מובייל + מחשב) */
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
