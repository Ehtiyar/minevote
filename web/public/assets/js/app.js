// Enable JS state
document.documentElement.classList.remove('no-js');

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Theme switch
const themeSwitch = document.getElementById('theme-switch');
const applyTheme = (theme) => {
  const html = document.documentElement;
  if (theme === 'light') html.classList.add('light'); else html.classList.remove('light');
};
const storedTheme = localStorage.getItem('theme');
if (storedTheme) applyTheme(storedTheme);
if (themeSwitch) {
  themeSwitch.checked = document.documentElement.classList.contains('light');
  themeSwitch.addEventListener('change', () => {
    const next = themeSwitch.checked ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

// Counter animations
const easeOutQuad = (t) => t * (2 - t);
const animateCounter = (el) => {
  const target = parseInt(el.getAttribute('data-count-to') || '0', 10);
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(easeOutQuad(progress) * target);
    el.textContent = value.toLocaleString('tr-TR');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
document.querySelectorAll('.stat-number').forEach(animateCounter);

// Modal logic
const modal = document.getElementById('vote-modal');
const openVoteButtons = document.querySelectorAll('.vote-btn');
openVoteButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
  });
});
if (modal) {
  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.hasAttribute('data-close') || target.classList.contains('modal-close')) {
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

// Copy IP
const toasts = document.querySelector('.toast-container');
const showToast = (message, type = 'info') => {
  if (!toasts) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  toasts.appendChild(el);
  setTimeout(() => { el.remove(); }, 3000);
};
document.querySelectorAll('.copy-ip-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const ip = btn.getAttribute('data-ip') || '';
    try {
      await navigator.clipboard.writeText(ip);
      showToast('IP kopyalandı ✅', 'success');
    } catch {
      showToast('Kopyalama başarısız ❌', 'error');
    }
  });
});

// Simple i18n stub
document.getElementById('lang-toggle')?.addEventListener('click', () => {
  const current = localStorage.getItem('lang') || 'tr';
  const next = current === 'tr' ? 'en' : 'tr';
  localStorage.setItem('lang', next);
  showToast(`Dil değiştirildi: ${next.toUpperCase()}`, 'info');
});

// Lazy-load images with data-src (progressive enhancement)
const lazyImages = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img instanceof HTMLImageElement) {
          img.src = img.dataset.src || img.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      }
    });
  });
  lazyImages.forEach((img) => io.observe(img));
}


