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

  const initLanguageSwitcher = () => {
    if (document.querySelector('.language-float')) return;

    const pagePath = location.pathname.replace(/\/index\.html$/i, '/').toLowerCase();
    const isChinese = document.documentElement.lang?.toLowerCase().startsWith('zh') ||
      /(?:^|\/)zh(?:\/|$)/.test(pagePath) ||
      /-cn\.html$/.test(pagePath);

    const stylesheet = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
      .find(link => /assets\/css\/styles\.css(?:[?#].*)?$/i.test(link.href));
    const siteRoot = stylesheet
      ? new URL(stylesheet.href.replace(/assets\/css\/styles\.css(?:[?#].*)?$/i, ''))
      : new URL('./', location.href);

    let counterpart;
    if (pagePath.includes('/zh/privacy-policy.html')) counterpart = new URL('privacy-policy.html', siteRoot);
    else if (pagePath.endsWith('/privacy-policy.html')) counterpart = new URL('zh/privacy-policy.html', siteRoot);
    else if (pagePath.includes('/zh/hippa.html')) counterpart = new URL('hippa.html', siteRoot);
    else if (pagePath.endsWith('/hippa.html')) counterpart = new URL('zh/hippa.html', siteRoot);
    else if (pagePath.includes('/zh/resources/')) counterpart = new URL('resources/', siteRoot);
    else if (/\/resources\/?$/.test(pagePath)) counterpart = new URL('zh/resources/', siteRoot);
    else if (/-cn\.html$/.test(pagePath)) counterpart = new URL('psychotherapy.html', siteRoot);
    else counterpart = new URL('psychotherapy-cn.html', siteRoot);

    const switcher = document.createElement('a');
    switcher.className = 'language-float';
    switcher.href = counterpart.href;
    switcher.lang = isChinese ? 'en' : 'zh-CN';
    switcher.hreflang = isChinese ? 'en' : 'zh-CN';
    switcher.setAttribute('aria-label', isChinese ? 'View this site in English' : '查看中文网站');
    switcher.title = isChinese ? 'English' : '中文';
    switcher.innerHTML = isChinese
      ? '<span aria-hidden="true">EN</span>'
      : '<span aria-hidden="true">中</span>';

    document.querySelectorAll('.nav a').forEach(link => {
      const label = link.textContent.trim().toLowerCase();
      if (label === '中文' || label === 'english') link.remove();
    });
    document.body.appendChild(switcher);
  };

  const iconSvg = name => {
    const icons = {
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.5 9.4 8 7.9 9.5a14.6 14.6 0 0 0 6.6 6.6l1.5-1.5 4.5 2.2v2.5c0 .7-.5 1.2-1.2 1.2A16.8 16.8 0 0 1 3.5 4.7c0-.7.5-1.2 1.2-1.2h2.5Z"/></svg>',
      email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8 6 8-6"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v15H4z"/><path d="M8 3v5M16 3v5M4 10h16"/></svg>',
      wechat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 14.3c-1.1.6-2.4.9-3.8.9-4 0-7.1-2.5-7.1-5.7s3.1-5.8 7.1-5.8 7.1 2.6 7.1 5.8c0 .4 0 .8-.1 1.1"/><path d="M12 15.1c0-2.6 2.5-4.7 5.5-4.7s5.5 2.1 5.5 4.7-2.5 4.7-5.5 4.7c-.9 0-1.8-.2-2.6-.5l-2.5 1 .7-2c-.7-.9-1.1-2-1.1-3.2Z"/><circle cx="7" cy="8.5" r=".6"/><circle cx="12" cy="8.5" r=".6"/></svg>'
    };
    return icons[name] || '';
  };

  const initContactIcons = () => {
    document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]').forEach(link => {
      if (link.querySelector('.contact-glyph')) return;
      const type = link.href.startsWith('tel:') ? 'phone' : 'email';
      link.classList.add('contact-link');
      link.insertAdjacentHTML('afterbegin', `<span class="contact-glyph">${iconSvg(type)}</span>`);
    });
    document.querySelectorAll('.nav-cta').forEach(link => {
      if (!link.querySelector('.contact-glyph')) {
        link.insertAdjacentHTML('afterbegin', `<span class="contact-glyph contact-glyph-calendar">${iconSvg('calendar')}</span>`);
      }
    });
    document.querySelectorAll('.site-footer p').forEach(paragraph => {
      if (!/微信/.test(paragraph.textContent) || paragraph.querySelector('.wechat-line')) return;
      paragraph.innerHTML = paragraph.innerHTML.replace(/(<br\s*\/?>(?:\s*))(微信(?:联系)?\s*[:：]\s*[^<]+)/i,
        `$1<span class="wechat-line"><span class="contact-glyph">${iconSvg('wechat')}</span>$2</span>`);
    });
  };

  const initPageImagery = () => {
    if (document.querySelector('.page-atmosphere')) return;
    const filename = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isZh = document.documentElement.lang?.toLowerCase().startsWith('zh');
    const images = {
      'about.html': ['https://images.pexels.com/photos/33703636/pexels-photo-33703636.jpeg?auto=compress&cs=tinysrgb&w=1800', 'A warm, quiet interior with wooden chairs and a green plant', '安静温暖的室内角落，摆有木椅和绿植'],
      'psychotherapy.html': ['https://images.pexels.com/photos/93802/pexels-photo-93802.jpeg?auto=compress&cs=tinysrgb&w=1800', 'A misty mountain lake surrounded by green forest', '薄雾笼罩的山间湖泊与绿色森林'],
      'psychotherapy-cn.html': ['https://images.pexels.com/photos/93802/pexels-photo-93802.jpeg?auto=compress&cs=tinysrgb&w=1800', 'A misty mountain lake surrounded by green forest', '薄雾笼罩的山间湖泊与绿色森林'],
      'insurance-and-fees.html': ['https://images.pexels.com/photos/8502649/pexels-photo-8502649.jpeg?auto=compress&cs=tinysrgb&w=1800', 'Eucalyptus leaves casting soft shadows on a green wall', '桉树叶在浅绿色墙面投下柔和光影'],
      'privacy-policy.html': ['https://images.pexels.com/photos/23499462/pexels-photo-23499462.jpeg?auto=compress&cs=tinysrgb&w=1800', 'Delicate leaf shadows on a sunlit neutral wall', '阳光下墙面上的柔和树叶光影'],
      'hippa.html': ['https://images.pexels.com/photos/23499462/pexels-photo-23499462.jpeg?auto=compress&cs=tinysrgb&w=1800', 'Delicate leaf shadows on a sunlit neutral wall', '阳光下墙面上的柔和树叶光影']
    };
    const data = images[filename];
    const hero = document.querySelector('.page-hero');
    if (!data || !hero) return;
    const figure = document.createElement('figure');
    figure.className = 'page-atmosphere';
    figure.setAttribute('data-reveal', '');
    figure.innerHTML = `<img src="${data[0]}" alt="${isZh ? data[2] : data[1]}" loading="lazy" decoding="async"><span aria-hidden="true"></span>`;
    hero.insertAdjacentElement('afterend', figure);
    requestAnimationFrame(() => figure.classList.add('is-visible'));
  };

  const initPage = () => {
    initNavigation();
    initLanguageSwitcher();
    initContactIcons();
    initPageImagery();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('.site-header');
    if (!reduceMotion) {
      const progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
      let ticking = false;
      const updateScrollEffects = () => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        progress.style.transform = `scaleX(${Math.min(window.scrollY / max, 1)})`;
        header?.classList.toggle('is-scrolled', window.scrollY > 18);
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollEffects);
          ticking = true;
        }
      }, { passive: true });
      updateScrollEffects();
    }

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

    const revealTargets = document.querySelectorAll('.section-heading, .concern-grid article, .profile-layout > *, .service-card, .approach-grid > *, .logistics-grid article, .final-cta-inner > *, .card, .credential-list > div, .faq details, .post-card, .empty-state, .article > *, .legal.spaced > *, .tools-heading, .tools-embed, .visual-story-heading, .visual-card');
    revealTargets.forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      if (i % 4) el.setAttribute('data-reveal-delay', String(i % 4));
    });
    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealTargets.forEach(el => io.observe(el));
    } else revealTargets.forEach(el => el.classList.add('is-visible'));

    const parallaxMedia = [...document.querySelectorAll('[data-parallax-media]')];
    if (parallaxMedia.length && !reduceMotion) {
      let mediaTicking = false;
      const updateMediaMotion = () => {
        const viewportCenter = window.innerHeight / 2;
        parallaxMedia.forEach(card => {
          const rect = card.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const cardCenter = rect.top + rect.height / 2;
          const shift = Math.max(-14, Math.min(14, (viewportCenter - cardCenter) * 0.025));
          card.style.setProperty('--media-shift', `${shift.toFixed(2)}px`);
        });
        mediaTicking = false;
      };
      window.addEventListener('scroll', () => {
        if (!mediaTicking) {
          window.requestAnimationFrame(updateMediaMotion);
          mediaTicking = true;
        }
      }, { passive: true });
      updateMediaMotion();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPage, { once: true });
  else initPage();
})();
