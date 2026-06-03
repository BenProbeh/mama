/**
 * "פיצוץ" חגיגי בלחיצה – ניצוצות ופרחים שמתפזרים מהכפתור
 */
const BURST_SPARKLES = ['✨', '💖', '🤍', '💮', '✦', '⭐', '💜'];

function spawnBurstRing(x, y) {
  const ring = document.createElement('span');
  ring.className = 'burst-ring';
  ring.style.left = x + 'px';
  ring.style.top = y + 'px';
  document.body.appendChild(ring);
  ring.addEventListener('animationend', function () {
    ring.remove();
  });
}

function spawnBurstParticles(x, y, theme) {
  const count = theme === 'big' ? 18 : 14;
  const emojis = theme === 'italian'
    ? ['✨', '🍕', '💖', '✨']
    : theme === 'burger'
      ? ['✨', '🍔', '💖', '✨']
      : theme === 'asian'
        ? ['✨', '🌸', '💖', '✨']
        : BURST_SPARKLES;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    const isDot = i % 3 === 0;
    particle.className = isDot ? 'burst-particle burst-dot' : 'burst-particle burst-emoji';
    if (!isDot) {
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    }

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
    const distance = 35 + Math.random() * 75;
    const bx = Math.cos(angle) * distance;
    const by = Math.sin(angle) * distance;

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--bx', bx + 'px');
    particle.style.setProperty('--by', by + 'px');
    particle.style.animationDelay = Math.random() * 0.06 + 's';
    particle.style.animationDuration = 0.55 + Math.random() * 0.35 + 's';

    document.body.appendChild(particle);
    particle.addEventListener('animationend', function () {
      particle.remove();
    });
  }
}

function popButton(btn) {
  btn.classList.remove('burst-pop');
  void btn.offsetWidth;
  btn.classList.add('burst-pop');
  btn.addEventListener('animationend', function handler() {
    btn.classList.remove('burst-pop');
    btn.removeEventListener('animationend', handler);
  });
}

/**
 * מפעיל את אפקט הפיצוץ במיקום הלחיצה
 * @param {MouseEvent} event
 * @param {string} [theme] - italian | burger | asian
 */
function clickBurst(event, theme) {
  const x = event.clientX;
  const y = event.clientY;

  spawnBurstRing(x, y);
  spawnBurstParticles(x, y, theme);

  if (event.currentTarget && event.currentTarget.classList) {
    popButton(event.currentTarget);
  }
}

function initClickBurst() {
  document.querySelectorAll('.cuisine-btn, .restaurant-btn, .confirm-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      let theme = '';
      if (btn.classList.contains('btn-italian')) theme = 'italian';
      else if (btn.classList.contains('btn-burger')) theme = 'burger';
      else if (btn.classList.contains('btn-asian')) theme = 'asian';
      clickBurst(e, theme);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClickBurst);
} else {
  initClickBurst();
}
