/**
 * יוצר גשם אימוג'ים ברקע הדף
 * @param {string} containerId - id של אלמנט העוטף
 * @param {string[]} emojis - מערך אימוג'ים
 * @param {number} count - כמות טיפות
 */
const WHITE_FLOWERS = ['💮', '🤍', '🌸', '🏵️', '🤍', '💮', '🌼'];

function startEmojiRain(containerId, emojis, count) {
  const container = document.getElementById(containerId);
  if (!container || !emojis.length) return;

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('span');
    drop.className = 'emoji-drop';
    drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = 4 + Math.random() * 6 + 's';
    drop.style.animationDelay = Math.random() * 5 + 's';
    drop.style.fontSize = 1 + Math.random() * 1.2 + 'rem';
    container.appendChild(drop);
  }
}

/** גשם פרחים לבנים – לכל הדפים */
function startFlowerRain(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('span');
    drop.className = 'emoji-drop flower-drop';
    drop.textContent = WHITE_FLOWERS[Math.floor(Math.random() * WHITE_FLOWERS.length)];
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = 5 + Math.random() * 7 + 's';
    drop.style.animationDelay = Math.random() * 6 + 's';
    drop.style.fontSize = 0.9 + Math.random() * 1.1 + 'rem';
    container.appendChild(drop);
  }
}
