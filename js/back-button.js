/**
 * כפתור חזרה – מותאם למובייל (iPhone 16 ומעלה)
 */
const CUISINE_PAGE = {
  'איטלקי': 'italian.html',
  'המבורגר': 'burger.html',
  'אסייתי': 'asian.html'
};

function getBackDestination() {
  const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  switch (page) {
    case 'italian.html':
    case 'burger.html':
    case 'asian.html':
      return 'index.html';
    case 'time.html': {
      const booking = typeof getBooking === 'function' ? getBooking() : {};
      return CUISINE_PAGE[booking.cuisine] || 'index.html';
    }
    case 'final.html':
      return 'time.html';
    case 'admin.html':
      return 'index.html';
    default:
      return null;
  }
}

function goBack() {
  const dest = getBackDestination();
  if (dest) {
    window.location.href = dest;
  } else if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}

function createBackButton() {
  if (getBackDestination() === null && !window.location.pathname.includes('index')) {
    return;
  }

  const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
  if (page === 'index.html' || page === '' || page === 'index') {
    return;
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-btn';
  btn.setAttribute('aria-label', 'חזרה לדף הקודם');
  btn.innerHTML = '<span class="back-btn-icon" aria-hidden="true">→</span><span class="back-btn-text">חזרה</span>';

  btn.addEventListener('click', function (e) {
    if (typeof clickBurst === 'function') {
      clickBurst(e, '');
    }
    goBack();
  });

  document.body.appendChild(btn);
  document.body.classList.add('has-back-nav');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBackButton);
} else {
  createBackButton();
}
