// ─── Cursor (delta-time + transform) ───────────────────────────────────
const dot = document.getElementById('cdot');
const ring = document.getElementById('cring');
let mx = 0, my = 0;        // mouse target
let dx = 0, dy = 0;        // dot current
let rx = 0, ry = 0;        // ring current
let lastCursor = performance.now();

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

// animate both dot and ring with rAF and delta time
function animCursor(now) {
  const dt = Math.min((now - lastCursor) / 1000, 0.05); // cap dt to avoid big jumps
  lastCursor = now;

  // dot: follow immediately but smoothed (fast)
  const dotFollowSpeed = 60; // higher = snappier
  const fd = 1 - Math.exp(-dotFollowSpeed * dt);
  dx += (mx - dx) * fd;
  dy += (my - dy) * fd;

  // ring: slower follow for trailing effect
  const ringFollowSpeed = 12; // adjust for more/less lag
  const fr = 1 - Math.exp(-ringFollowSpeed * dt);
  rx += (mx - rx) * fr;
  ry += (my - ry) * fr;

  // center offsets (assumes CSS will center with translate(-50%,-50%) ideally)
  const dotHalfW = (dot.offsetWidth || 16) / 2;
  const dotHalfH = (dot.offsetHeight || 16) / 2;
  const ringHalfW = (ring.offsetWidth || 48) / 2;
  const ringHalfH = (ring.offsetHeight || 48) / 2;

  dot.style.transform = `translate3d(${Math.round(dx - dotHalfW)}px, ${Math.round(dy - dotHalfH)}px, 0)`;
  ring.style.transform = `translate3d(${Math.round(rx - ringHalfW)}px, ${Math.round(ry - ringHalfH)}px, 0)`;

  requestAnimationFrame(animCursor);
}
requestAnimationFrame(animCursor);

// hover states
document.querySelectorAll('a,button,[data-h]').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
});

// ─── Nav ──────────────────────────────────────────────────────
const nav = document.getElementById('nav'), nl = document.getElementById('nl'), ham = document.getElementById('ham');
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 40), { passive: true });
function toggleMenu() { ham.classList.toggle('open'); nl.classList.toggle('open'); }
function closeMenu() { ham.classList.remove('open'); nl.classList.remove('open'); }
function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); closeMenu(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ─── Active nav ───────────────────────────────────────────────
const secs = document.querySelectorAll('section[id]'), links = document.querySelectorAll('.nav-link');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  secs.forEach(s => obs.observe(s));
}

// ─── Scroll reveal ────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .09, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.rv').forEach(el => o.observe(el));
}

// ─── Skill bars ───────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.bar-fg').forEach((b, i) => {
      b.style.transitionDelay = i * 120 + 'ms';
      b.style.width = b.dataset.w + '%';
      b.classList.add('on');
    });
  }), { threshold: .2 }).observe(document.getElementById('skillGrid'));
}

// ─── Typewriter ───────────────────────────────────────────────
(() => {
  const el = document.getElementById('typed'), txt = 'Transformando dados em decisões';
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent = txt.slice(0, ++i);
      if (i >= txt.length) clearInterval(iv);
    }, 44);
  }, 800);
})();


// ─── KPI counter (already uses performance.now) ───────────────
if ('IntersectionObserver' in window) {
  new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.kpi-val[data-target]').forEach(el => {
      const target = +el.dataset.target, suffix = el.dataset.suffix || '', t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / 1400, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }), { threshold: .5 }).observe(document.querySelector('.kpi-strip'));
}

// ─── Magnetic buttons ─────────────────────────────────────────
document.querySelectorAll('.btn-p,.send-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const tx = (e.clientX - r.left - r.width / 2) * .28;
    const ty = (e.clientY - r.top - r.height / 2) * .28;
    btn.style.transform = `translateY(-2px) translate(${tx}px, ${ty}px) scale(1.02)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ─── Canvas particles (delta-time + px/s) ────────────────────
(() => {
  const canvas = document.getElementById('heroCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, last = performance.now();

  const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
  resize();
  new ResizeObserver(resize).observe(canvas);

  // particles with velocities in px/s and angular speed in rad/s
  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * (W || 1200),
    y: Math.random() * (H || 700),
    r: Math.random() * 1.3 + .4,
    vx: (Math.random() - .5) * 30, // px per second
    vy: (Math.random() - .5) * 30, // px per second
    phase: Math.random() * Math.PI * 2,
    spd: Math.random() * 2 + 0.5 // rad per second
  }));

  function draw(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, W, H);

    // update and draw points
    pts.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.phase += p.spd * dt;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const a = (Math.sin(p.phase) * .5 + .5) * .45;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${a})`;
      ctx.fill();
    });

    // lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${(1 - d / 110) * .065})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ─── Optional: small performance guard for background tabs ─────
// Pause heavy animations when page is hidden to save CPU
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // when hidden, reduce pointer updates (no-op here because rAF is capped by browser)
    // leaving this hook for future optimizations if needed
  }
});
