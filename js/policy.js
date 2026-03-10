// TOC highlight + mobile toggle + toast + cookie toggles

document.addEventListener('DOMContentLoaded', () => {
  const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
  const sections = tocLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  // Scroll spy
  function onScroll() {
    let activeId = null;
    const offset = 120;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top - offset <= 0) {
        activeId = sec.id;
      }
    });

    if (activeId) {
      tocLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
      });
    }
  }

  document.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll
  tocLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      window.scrollTo({
        top: target.offsetTop - 90,
        behavior: 'smooth'
      });
    });
  });

  // Mobile TOC toggle
  const tocToggle = document.getElementById('tocToggle');
  const tocNav = document.getElementById('tocNav');

  if (tocToggle && tocNav) {
    tocToggle.addEventListener('click', () => {
      tocNav.classList.toggle('open');
    });
  }

  // Toast helpers
  const toast = document.getElementById('toast');
  const toastClose = document.getElementById('toastClose');

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => toast.classList.remove('show'));
  }

  // CTA buttons (show toast)
  ['feedbackBtn', 'dpBtn', 'usageBtn', 'saveCookiesBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        // For cookies, also persist preferences
        if (id === 'saveCookiesBtn') {
          persistCookiePrefs();
        }
        showToast();
      });
    }
  });

  // Cookie toggles
  const cookieToggles = Array.from(document.querySelectorAll('.toggle[data-key]'));

  function loadCookiePrefs() {
    try {
      const stored = JSON.parse(localStorage.getItem('sdgrs-cookie-prefs') || '{}');
      cookieToggles.forEach(btn => {
        const key = btn.dataset.key;
        const state = stored[key] || 'off';
        setToggleState(btn, state);
      });
    } catch {
      // ignore
    }
  }

  function setToggleState(btn, state) {
    btn.dataset.state = state;
    btn.textContent = state === 'on' ? 'On' : 'Off';
  }

  function persistCookiePrefs() {
    const prefs = {};
    cookieToggles.forEach(btn => {
      prefs[btn.dataset.key] = btn.dataset.state || 'off';
    });
    localStorage.setItem('sdgrs-cookie-prefs', JSON.stringify(prefs));
  }

  cookieToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.state === 'on' ? 'off' : 'on';
      setToggleState(btn, next);
    });
  });

  loadCookiePrefs();
});
