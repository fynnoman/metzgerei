// Metzgerei Jochem — interactions

// 1. Scroll reveal
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
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
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
})();

// 2. Mobile menu
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

// 3. Header scroll state
(() => {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 4. Year
(() => {
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();

// 5. Live "open now" indicator
(() => {
  // Schedule: Mo-Do 07:30-12:30, Tue/Thu also 14:30-18:00, Fr 07:30-18:00, Sa 07:00-13:00
  const now = new Date();
  const day = now.getDay(); // 0 Sun, 1 Mon ... 6 Sat
  const h = now.getHours() + now.getMinutes()/60;

  let open = false;
  const inRange = (a, b) => h >= a && h < b;

  if (day >= 1 && day <= 4) {                    // Mon-Thu morning
    if (inRange(7.5, 12.5)) open = true;
  }
  if ((day === 2 || day === 4) && inRange(14.5, 18)) open = true; // Tue/Thu afternoon
  if (day === 5 && inRange(7.5, 18)) open = true;                 // Fri
  if (day === 6 && inRange(7, 13)) open = true;                   // Sat

  document.querySelectorAll('[data-open-state]').forEach(el => {
    el.textContent = open ? 'Jetzt geöffnet' : 'Außerhalb der Öffnungszeiten';
    el.dataset.openNow = open ? 'true' : 'false';
    if (!open) {
      el.previousElementSibling?.classList.remove('live-dot');
      el.previousElementSibling?.classList.add('inline-block', 'h-2', 'w-2', 'rounded-full', 'bg-burgundy', 'opacity-60');
    }
  });
})();
