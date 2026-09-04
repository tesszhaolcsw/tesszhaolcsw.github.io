(() => {
  'use strict';

  const initNavigation = () => {
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');
    if (!btn || !nav) return;

    // Keep the fixed drawer outside the blurred sticky header for Safari/iOS.
    document.body.appendChild(nav);
    const navLinks = [...nav.querySelectorAll('a[href]')];
    const backdrop = document.createElement('button');
    backdrop.className = 'menu-backdrop';
    backdrop.type = 'button';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Close navigation menu');
    document.body.insertBefore(backdrop, nav);

    const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
    const closeMenu = ({ restoreFocus = false } = {}) => {
      if (!isOpen()) return;
      nav.classList.remove('open');
      backdrop.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('menu-open');
      nav.setAttribute('aria-hidden', 'true');
      if (restoreFocus) btn.focus({ preventScroll: true });
    };

    const openMenu = () => {
      if (isOpen()) return;
      nav.classList.add('open');
      backdrop.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close navigation menu');
      document.body.classList.add('menu-open');
      nav.removeAttribute('aria-hidden');
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && navLinks[0]) {
        requestAnimationFrame(() => navLinks[0].focus({ preventScroll: true }));
      }
    };

    btn.setAttribute('aria-label', 'Open navigation menu');
    nav.setAttribute('aria-hidden', 'true');
    btn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      isOpen() ? closeMenu({ restoreFocus: true }) : openMenu();
    });
    backdrop.addEventListener('click', () => closeMenu({ restoreFocus: true }));
    // Preserve the browser's native link activation. Closing synchronously can
    // cancel touch-generated navigation in Safari and embedded webviews.
    navLinks.forEach(link => link.addEventListener('click', () => {
      window.setTimeout(() => closeMenu(), 0);
    }));

    document.addEventListener('keydown', event => {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = [...navLinks, btn].filter(el => !el.hasAttribute('disabled'));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    window.addEventListener('pageshow', () => closeMenu());
    window.addEventListener('orientationchange', () => closeMenu());
  };

  const initPage = () => {
    initNavigation();
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a[href]').forEach(link => {
      const href = link.getAttribute('href').split('#')[0].toLowerCase();
      if (href === current) link.setAttribute('aria-current', 'page');
    });

    if (!document.querySelector('.mobile-cta')) {
      const isChinese = document.documentElement.lang?.toLowerCase().startsWith('zh');
      const bar = document.createElement('div');
      bar.className = 'mobile-cta';
      bar.setAttribute('aria-label', isChinese ? '快速联系' : 'Quick contact');
      bar.innerHTML = `<a class="secondary" href="tel:+17038295007" aria-label="${isChinese ? '电话联系' : 'Call Tess'}">☎</a><a class="btn" href="https://tidycal.com/tesszhaolcsw/initialconsult">${isChinese ? '预约初步咨询' : 'Book Consultation'}</a>`;
      document.body.appendChild(bar);
    }

    const revealTargets = document.querySelectorAll('.section-heading, .concern-grid article, .profile-layout > *, .service-card, .approach-grid > *, .logistics-grid article, .final-cta-inner > *, .card, .credential-list > div, .faq details');
    revealTargets.forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      if (i % 4) el.setAttribute('data-reveal-delay', String(i % 4));
    });
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealTargets.forEach(el => io.observe(el));
    } else revealTargets.forEach(el => el.classList.add('is-visible'));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPage, { once: true });
  else initPage();
})();
