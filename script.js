/*!
 * Tirth Mehta Portfolio — script.js (3D Edition 2026)
 */

'use strict';

// ── Always land on About/Hero on page load (no scroll restore) ─
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => {
  if (!window.location.hash) window.scrollTo(0, 0);
});

// ── Custom cursor ─────────────────────────────────────────────
(function () {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .pill, .beyond-card, .stat-chip, .card-3d').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'var(--accent-2)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'var(--accent)';
    });
  });
})();


// ── Hero particle canvas ──────────────────────────────────────
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const hero = document.querySelector('.hero-section');
    canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
    canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = 70;
  const dots = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.3,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.35 + 0.08,
  }));

  let mouseX = -999, mouseY = -999;
  const hero = document.querySelector('.hero-section');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouseX = -999; mouseY = -999; });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;

      const dx = d.x - mouseX, dy = d.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const alpha = dist < 160 ? d.alpha + (1 - dist / 160) * 0.35 : d.alpha;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,92,231,${alpha})`;
      ctx.fill();
    });

    // Connection lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(108,92,231,${(1 - dist / 110) * 0.14})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


// ── 3D card mouse-tracking tilt ───────────────────────────────
(function () {
  const scene = document.getElementById('cards3dScene');
  if (!scene) return;

  const cards = scene.querySelectorAll('.card-3d');
  const baseTransforms = [
    { ry: -22, rx: 9,  tz: 30 },
    { ry: -14, rx: 5,  tz: 70 },
    { ry: -25, rx: 11, tz: 10 },
    { ry: -16, rx: 6,  tz: 55 },
    { ry: -19, rx: 8,  tz: 35 },
  ];
  const depths = [1.0, 1.6, 0.8, 1.4, 1.1];

  scene.addEventListener('mousemove', e => {
    const r = scene.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;

    cards.forEach((c, i) => {
      const b = baseTransforms[i] || baseTransforms[0];
      const d = depths[i] || 1;
      const newRy = b.ry + nx * 14;
      const newRx = b.rx - ny * 10;
      const tx = nx * 10 * d;
      const ty = ny * 6  * d;
      c.style.transform = `rotateY(${newRy}deg) rotateX(${newRx}deg) translateZ(${b.tz}px) translate(${tx}px,${ty}px)`;
    });
  });

  scene.addEventListener('mouseleave', () => {
    cards.forEach((c, i) => {
      const b = baseTransforms[i] || baseTransforms[0];
      c.style.transform = `rotateY(${b.ry}deg) rotateX(${b.rx}deg) translateZ(${b.tz}px)`;
      c.style.animationPlayState = 'running';
    });
  });
})();


// ── Scroll progress bar ───────────────────────────────────────
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollH   = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (scrollTop / scrollH * 100) + '%';
  }, { passive: true });
})();


// ── Nav: active link on scroll + hamburger ────────────────────
(function () {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#navLinks a');
  const hamburger = document.getElementById('navToggle');
  const navLinksEl= document.getElementById('navLinks');

  function updateActive() {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const bot = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bot) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`#navLinks a[href="#${sec.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => navLinksEl.classList.toggle('open'));
    navLinks.forEach(l => l.addEventListener('click', () => navLinksEl.classList.remove('open')));
  }
})();


// ── Smooth scroll ─────────────────────────────────────────────
document.querySelectorAll('.js-scroll-trigger').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});


// ── Reveal animations ─────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal-up, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();


// ── Live clock — Boise MST ────────────────────────────────────
(function () {
  const timeEl = document.getElementById('live-time');
  const dateEl = document.getElementById('live-date');
  if (!timeEl || !dateEl) return;

  function updateClock() {
    const now = new Date();
    const opts     = { timeZone: 'America/Boise', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOpts = { timeZone: 'America/Boise', weekday: 'short', month: 'short', day: 'numeric' };
    timeEl.textContent = now.toLocaleTimeString('en-US', opts);
    dateEl.textContent = now.toLocaleDateString('en-US', dateOpts);
  }
  updateClock();
  setInterval(updateClock, 1000);
})();


// ── Terminal typewriter ───────────────────────────────────────
(function () {
  const cmdEl = document.getElementById('terminal-cmd');
  const outEl = document.getElementById('terminal-output');
  if (!cmdEl || !outEl) return;

  const sequences = [
    {
      cmd: 'node sync_engine.js --redis',
      output: '✓ Fetched 85,247 SKUs from Lightspeed\n✓ Redis cache warm (12ms)\n✓ Enqueued 1,204 delta updates\n✓ Claude SEO enrichment: done'
    },
    {
      cmd: 'git log --oneline -4',
      output: 'a3f9c2e feat: LeMans CDN image pipeline\n7b1d04a fix: GraphQL pagination edge\n2c8e71a perf: Redis TTL optimization\n94fa30c feat: Claude batch enrichment'
    },
    {
      cmd: 'npm run fulfill:wps',
      output: '▶ Orders pulled: 14\n▶ Submitted to WPS API: 14\n▶ Tracking pushed to Shopify: 14\n✓ Zero manual touchpoints'
    },
    {
      cmd: 'cat stack.txt',
      output: 'Node.js · Shopify GraphQL · Redis\nAnthropic Claude API · Java · Python\nLightspeed · WPS · Parts Unlimited · BRP\nBuilt @ DDRV.COM · Boise, Idaho'
    }
  ];

  let seqIdx = 0;

  function typeCmd(text, cb) {
    cmdEl.textContent = ''; outEl.textContent = '';
    let i = 0;
    function step() {
      if (i < text.length) { cmdEl.textContent += text[i++]; setTimeout(step, 55 + Math.random() * 25); }
      else cb();
    }
    step();
  }

  function typeOutput(text, cb) {
    const lines = text.split('\n');
    let lineIdx = 0;
    function nextLine() {
      if (lineIdx < lines.length) {
        outEl.textContent += (lineIdx > 0 ? '\n' : '') + lines[lineIdx++];
        setTimeout(nextLine, 110);
      } else {
        setTimeout(cb, 2600);
      }
    }
    setTimeout(nextLine, 350);
  }

  function runSequence() {
    const seq = sequences[seqIdx % sequences.length];
    seqIdx++;
    typeCmd(seq.cmd, () => typeOutput(seq.output, runSequence));
  }
  setTimeout(runSequence, 600);
})();


// ── Hero typing effect ────────────────────────────────────────
(function () {
  const el = document.getElementById('hero-typing');
  if (!el) return;

  const phrases = [
    'Software Developer',
    'Shopify Automation Engineer',
    'AI Integration Specialist',
    'Full Stack Developer',
    'Node.js Architect',
    'Data Pipeline Engineer',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 35 : 65);
  }
  type();
})();


// ── Footer year ───────────────────────────────────────────────
(function () {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


// ── Stat counters ─────────────────────────────────────────────
(function () {
  const chips = document.querySelectorAll('.stat-chip');
  if (!chips.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target.querySelector('.stat-n');
      if (!el) return;
      const target = parseInt(el.dataset.target, 10);
      const start  = performance.now();
      function step(now) {
        const t = Math.min((now - start) / 1400, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(step); else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  chips.forEach(c => obs.observe(c));
})();


// ── Skill bars ────────────────────────────────────────────────
(function () {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.dataset.pct || 0;
        const idx = Array.from(bars).indexOf(entry.target);
        setTimeout(() => { entry.target.style.width = pct + '%'; }, idx * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();


// ── Pill hover lift ───────────────────────────────────────────
document.querySelectorAll('.pill, .tag, .sp3').forEach(pill => {
  pill.addEventListener('mouseenter', function () {
    this.style.transform  = 'translateY(-2px) scale(1.04)';
    this.style.transition = 'transform 0.18s ease';
  });
  pill.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});


// ── Subsystem tabs ────────────────────────────────────────────
(function () {
  const tabs   = document.querySelectorAll('.sys-tab');
  const panels = document.querySelectorAll('.sys-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById('tab-' + this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
})();
