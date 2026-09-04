const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (btn && nav) {
  const navLinks = [...nav.querySelectorAll('a')];
  const backdrop = document.createElement('button');
  backdrop.className = 'menu-backdrop';
  backdrop.type = 'button';
  backdrop.setAttribute('aria-label', 'Close navigation menu');
  document.body.appendChild(backdrop);

  const closeMenu = ({ restoreFocus = false } = {}) => {
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (restoreFocus) btn.focus({ preventScroll: true });
  };

  const openMenu = () => {
    nav.classList.add('open');
    backdrop.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    const firstLink = navLinks[0];
    if (firstLink) requestAnimationFrame(() => firstLink.focus({ preventScroll: true }));
  };

  btn.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMenu({ restoreFocus: true });
    else openMenu();
  });

  backdrop.addEventListener('click', () => closeMenu({ restoreFocus: true }));
  navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', event => {
    if (!nav.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key === 'Tab') {
      const focusables = [btn, ...navLinks].filter(el => !el.hasAttribute('disabled'));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.querySelectorAll('.nav a[href]').forEach(link => {
  const href = link.getAttribute('href').split('#')[0].toLowerCase();
  if (href === current) link.setAttribute('aria-current', 'page');
});

if (!document.querySelector('.mobile-cta')) {
  const isChinese = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('zh');
  const bar = document.createElement('div');
  bar.className = 'mobile-cta';
  bar.setAttribute('aria-label', isChinese ? '快速联系' : 'Quick contact');
  bar.innerHTML = `<a class="secondary" href="tel:+17038295007" aria-label="${isChinese ? '电话联系' : 'Call Tess'}">☎</a><a class="btn" href="https://tidycal.com/tesszhaolcsw/initialconsult">${isChinese ? '预约初步咨询' : 'Book Consultation'}</a>`;
  document.body.appendChild(bar);
}

// Subtle editorial reveal animation; content remains fully visible without JS.
const revealTargets = document.querySelectorAll('.section-heading, .concern-grid article, .profile-layout > *, .service-card, .approach-grid > *, .logistics-grid article, .final-cta-inner > *, .card, .credential-list > div, .faq details');
revealTargets.forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  if (i % 4) el.setAttribute('data-reveal-delay', String(i % 4));
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}
