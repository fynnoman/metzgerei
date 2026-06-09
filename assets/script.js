// Metzgerei Jochem — interactions in Fylu-DNA

// ============ Scroll reveal ============
(() => {
  const els = document.querySelectorAll('.reveal, .reveal-soft');
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
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => io.observe(el));
})();

// ============ Header scroll state ============
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

// ============ Mobile menu ============
(() => {
  const open  = document.querySelector('[data-menu-open]');
  const close = document.querySelector('[data-menu-close]');
  const panel = document.querySelector('.mobile-panel');
  if (!open || !panel) return;
  const o = () => { panel.classList.add('open');  document.body.style.overflow = 'hidden'; };
  const c = () => { panel.classList.remove('open'); document.body.style.overflow = ''; };
  open.addEventListener('click', o);
  close?.addEventListener('click', c);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', c));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') c(); });
})();

// ============ Year ============
(() => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

// ============ Live open state ============
(() => {
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
    el.textContent = open ? 'Heute geöffnet' : 'Geschlossen · Automat 24/7';
  });
  document.querySelectorAll('[data-open-pill]').forEach(el => {
    if (open) el.classList.add('ping-green'); else el.classList.add('ping-red');
  });
})();

// ============ Rotating product stack (hero) ============
(() => {
  const stack = document.querySelector('[data-product-stack]');
  if (!stack) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = stack.querySelectorAll('.product-card');
  if (cards.length < 2) return;

  const slots = [
    { rotate: -7, x: -28, y: 32, scale: 0.93, z: 10, opacity: 0.85 },
    { rotate:  3, x:  14, y: -14, scale: 1.0,  z: 30, opacity: 1.0 },
    { rotate:  9, x:  44, y: 18, scale: 0.88, z: 20, opacity: 0.78 },
  ];

  let featured = 1; // index of card in front slot
  const total = cards.length;

  const applySlots = () => {
    cards.forEach((card, idx) => {
      const offset = ((idx - featured + 1) % total + total) % total;
      const s = slots[offset] || slots[0];
      card.style.transform =
        `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg) scale(${s.scale})`;
      card.style.zIndex = s.z;
      card.style.opacity = s.opacity;
    });
  };

  applySlots();

  setInterval(() => {
    featured = (featured + 1) % total;
    applySlots();
  }, 4200);
})();
