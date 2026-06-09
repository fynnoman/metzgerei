// Metzgerei Jochem — Motion-driven scroll animations

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================== INTERSECTION REVEALS ==============================
(() => {
  const els = document.querySelectorAll('.reveal, .reveal-blur');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
})();

// ============================== HEADER SCROLL ==============================
(() => {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const update = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ============================== MOBILE MENU ==============================
(() => {
  const trigger = document.querySelector('[data-menu-open]');
  const closer  = document.querySelector('[data-menu-close]');
  const panel   = document.querySelector('.mobile-panel');
  if (!trigger || !panel) return;
  const open  = () => { panel.classList.add('open');  document.body.style.overflow = 'hidden'; };
  const close = () => { panel.classList.remove('open'); document.body.style.overflow = ''; };
  trigger.addEventListener('click', open);
  closer?.addEventListener('click', close);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ============================== YEAR ==============================
(() => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

// ============================== LIVE OPEN STATE ==============================
(() => {
  // Mo-Do 07:30-12:30; Di+Do also 14:30-18:00; Fr 07:30-18:00; Sa 07:00-13:00
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  const inRange = (a, b) => h >= a && h < b;
  let open = false;
  if (day >= 1 && day <= 4 && inRange(7.5, 12.5)) open = true;
  if ((day === 2 || day === 4) && inRange(14.5, 18)) open = true;
  if (day === 5 && inRange(7.5, 18)) open = true;
  if (day === 6 && inRange(7, 13)) open = true;

  document.querySelectorAll('[data-open-state]').forEach(el => {
    el.textContent = open ? 'Jetzt geöffnet' : 'Außerhalb der Öffnungszeiten';
  });
  document.querySelectorAll('[data-open-dot]').forEach(el => {
    if (!open) el.classList.add('closed');
  });
})();

// ============================== MOTION ONE — Scroll Animations ==============================
(() => {
  if (reduced) return;
  if (typeof Motion === 'undefined') {
    console.warn('Motion One library not loaded — skipping scroll animations');
    return;
  }
  const { scroll, animate, inView } = Motion;

  // --- HERO: dramatic parallax + scale + fade ---
  const heroImage   = document.querySelector('[data-parallax]');
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');

  if (heroImage && heroSection) {
    scroll(
      animate(heroImage, {
        scale: [1.05, 1.25],
        y: [0, 180],
      }),
      { target: heroSection, offset: ['start start', 'end start'] }
    );
  }

  if (heroContent && heroSection) {
    scroll(
      animate(heroContent, {
        opacity: [1, 0.15],
        y: [0, -60],
        scale: [1, 0.95],
      }),
      { target: heroSection, offset: ['start start', 'end start'] }
    );
  }

  // --- FEATURE IMAGES: subtle scale + rotate during sticky pin ---
  document.querySelectorAll('[data-feature-image]').forEach((el) => {
    const row = el.closest('.feature-row');
    if (!row) return;
    scroll(
      animate(el, {
        scale: [0.92, 1.0, 1.0, 0.94],
        rotate: [-1.5, 0, 0, 1.5],
      }),
      { target: row, offset: ['start end', 'center center', 'center center', 'end start'] }
    );
  });

  // --- MEGA STAT 122: scale + glow while sticky ---
  const megaStat = document.querySelector('[data-mega-stat]');
  if (megaStat) {
    const innerStat = megaStat.querySelector('.stat-big');
    if (innerStat) {
      scroll(
        animate(innerStat, {
          scale: [0.85, 1.0, 1.05, 0.95],
          letterSpacing: ['-0.04em', '-0.05em', '-0.05em', '-0.04em'],
        }),
        { target: megaStat, offset: ['start end', 'center center', 'center center', 'end start'] }
      );
    }
  }

  // --- MEDAL DISC: entrance scale + rotate via inView ---
  inView('.medal-disc', (info) => {
    animate(info.target, {
      scale: [0.4, 1],
      rotate: [-180, 0],
      opacity: [0, 1],
    }, { duration: 1.1, easing: [0.16, 1, 0.3, 1] });
    return () => {};
  }, { amount: 0.4 });

  // --- MEDAL RIBBON: enter from below ---
  inView('.medal-ribbon', (info) => {
    animate(info.target, {
      y: [40, 0],
      opacity: [0, 1],
    }, { duration: 0.7, delay: 0.5, easing: [0.16, 1, 0.3, 1] });
    return () => {};
  }, { amount: 0.5 });

  // --- AURA / GLOWS: subtle scroll-linked drift ---
  document.querySelectorAll('.aura-amber, .aura-ember').forEach((el) => {
    const section = el.parentElement;
    if (!section) return;
    scroll(
      animate(el, {
        y: [0, -120],
      }),
      { target: section, offset: ['start end', 'end start'] }
    );
  });

  // --- TRADITION TIMELINE DOTS: stronger glow as they enter ---
  inView('.tline-dot', (info) => {
    animate(info.target, {
      scale: [0, 1],
      opacity: [0, 1],
    }, { duration: 0.6, delay: 0.2, easing: [0.16, 1, 0.3, 1] });
    return () => {};
  }, { amount: 0.6 });

  // --- HOURS ROWS: subtle slide-in on scroll ---
  inView('.hours-row', (info) => {
    animate(info.target, {
      x: [-30, 0],
      opacity: [0, 1],
    }, { duration: 0.55, easing: [0.16, 1, 0.3, 1] });
    return () => {};
  }, { amount: 0.5 });

  // --- CHIPS: cascade enter ---
  const chips = document.querySelectorAll('.chip');
  if (chips.length) {
    inView(chips[0].parentElement, () => {
      chips.forEach((chip, i) => {
        animate(chip, {
          y: [20, 0],
          opacity: [0, 1],
        }, { duration: 0.5, delay: i * 0.035, easing: [0.16, 1, 0.3, 1] });
      });
      return () => {};
    }, { amount: 0.2 });
  }

  // --- MARQUEE: slow when scrolling reverse for "scrub" feel ---
  // (Marquee runs via CSS animation; we leave it alone for performance.)
})();
