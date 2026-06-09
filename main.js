// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Sticky header shadow on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 20px rgba(0,0,0,.15)'
    : '0 2px 12px rgba(0,0,0,.08)';
});

// Contact form – simple local feedback (no backend needed for static site)
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = '✅ Thank you! We will contact you shortly.';
  this.reset();
  setTimeout(() => { note.textContent = ''; }, 5000);
});

// Smooth active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.background = a.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
    a.style.color = a.getAttribute('href') === '#' + current ? 'white' : '';
  });
});

/* ===== 3D TILT – OWNER CARD ===== */
(function ownerCard3D() {
  const card   = document.getElementById('ownerCard3d');
  const shadow = document.getElementById('ownerShadow');
  if (!card) return;

  const MAX_TILT = 18;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * MAX_TILT;
    const rotY =  dx * MAX_TILT;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    if (shadow) {
      shadow.style.transform = `scaleX(${1 - Math.abs(dx) * 0.3}) translateX(${dx * 18}px)`;
      shadow.style.opacity = String(0.6 + Math.abs(dy) * 0.3);
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform .5s cubic-bezier(.03,.98,.52,.99)';
    if (shadow) { shadow.style.transform = 'scaleX(1) translateX(0)'; shadow.style.opacity = '1'; }
    setTimeout(() => { card.style.transition = 'transform .12s ease'; }, 500);
  });

  // Subtle idle float when not hovered
  let idle = null;
  card.addEventListener('mouseenter', () => clearInterval(idle));
  card.addEventListener('mouseleave', () => {
    let t = 0;
    idle = setInterval(() => {
      t += 0.04;
      const ry = Math.sin(t) * 3;
      const rx = Math.cos(t * .7) * 2;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }, 40);
  });
  // Start idle immediately
  let t = 0;
  idle = setInterval(() => {
    t += 0.04;
    card.style.transform = `rotateX(${Math.cos(t*.7)*2}deg) rotateY(${Math.sin(t)*3}deg)`;
  }, 40);
})();

/* ===== TYPEWRITER: banner-tagline ===== */
(function typewriterTagline() {
  const el = document.querySelector('.banner-tagline');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  el.style.borderRight = '2px solid #ff9900';
  el.style.whiteSpace = 'nowrap';
  el.style.overflow = 'hidden';
  let i = 0;
  // Start after the fade-in animation (600ms)
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(iv);
        // Blink cursor then remove
        let blink = 0;
        const biv = setInterval(() => {
          el.style.borderRight = (blink++ % 2 === 0) ? 'none' : '2px solid #ff9900';
          if (blink > 6) { clearInterval(biv); el.style.borderRight = 'none'; }
        }, 400);
      }
    }, 40);
  }, 1400);
})();

/* ===== WORD-BY-WORD: Jan Seva Kendra ===== */
(function wordRevealHeading() {
  const el = document.querySelector('.banner-heading');
  if (!el) return;
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words.map((w, i) =>
    `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:opacity .4s ${.15 + i * .2}s ease,transform .4s ${.15 + i * .2}s ease">${w}</span>`
  ).join(' ');
  setTimeout(() => {
    el.querySelectorAll('span').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    });
  }, 200);
})();

/* ===== 3D CANVAS PARTICLE NETWORK ===== */
(function hero3DCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 85;
  const DEPTH = 360;
  const FOV   = 290;
  const LINK  = 115;

  const pts = Array.from({ length: COUNT }, () => ({
    x:  (Math.random() - .5) * W * 1.5,
    y:  (Math.random() - .5) * H * 1.5,
    z:  (Math.random() - .5) * DEPTH,
    vx: (Math.random() - .5) * .45,
    vy: (Math.random() - .5) * .45,
    vz: (Math.random() - .5) * .22,
    r:  Math.random() * 1.6 + .7,
    // white / light-blue / saffron mix
    h:  [0, 210, 38, 210, 0][Math.floor(Math.random() * 5)],
    s:  [0, 80, 100, 60, 0][Math.floor(Math.random() * 5)],
    l:  [100, 82, 72, 90, 95][Math.floor(Math.random() * 5)],
  }));

  let angX = 0, angY = 0;

  function project(x, y, z) {
    const sc = FOV / (FOV + z + DEPTH / 2);
    return { px: W / 2 + x * sc, py: H / 2 + y * sc, sc };
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    angY += .0013;
    angX += .0008;

    const cy = Math.cos(angY), sy = Math.sin(angY);
    const cx2 = Math.cos(angX), sx2 = Math.sin(angX);

    const proj = pts.map(p => {
      // float
      p.x += p.vx; p.y += p.vy; p.z += p.vz;
      if (Math.abs(p.x) > W * .7)  p.vx *= -1;
      if (Math.abs(p.y) > H * .7)  p.vy *= -1;
      if (Math.abs(p.z) > DEPTH/2) p.vz *= -1;
      // rotate Y then X
      const rx  =  p.x * cy - p.z * sy;
      const rz1 =  p.x * sy + p.z * cy;
      const ry  =  p.y * cx2 - rz1 * sx2;
      const rz  =  p.y * sx2 + rz1 * cx2;
      return { ...project(rx, ry, rz), p, rz };
    });

    // back-to-front
    proj.sort((a, b) => a.rz - b.rz);

    // lines
    for (let i = 0; i < proj.length; i++) {
      for (let j = i + 1; j < proj.length; j++) {
        const a = proj[i], b = proj[j];
        const dx = a.px - b.px, dy = a.py - b.py;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > LINK) continue;
        const alpha = (1 - d / LINK) * .28;
        ctx.strokeStyle = d < LINK * .45
          ? `rgba(255,175,70,${alpha})`    // saffron / orange
          : `rgba(110,185,255,${alpha})`;  // sky-blue
        ctx.lineWidth = .75;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
      }
    }

    // dots + glow
    proj.forEach(({ px, py, sc, p }) => {
      const r = p.r * sc * 2.4;
      const a = Math.min(sc * 1.3, 1) * .88;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(r, .3), 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.h},${p.s}%,${p.l}%)`;
      ctx.fill();

      if (sc > .82) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, r * 3.2);
        g.addColorStop(0, `hsla(${p.h},${p.s}%,${p.l}%,.28)`);
        g.addColorStop(1, `hsla(${p.h},${p.s}%,${p.l}%,0)`);
        ctx.beginPath();
        ctx.arc(px, py, r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.globalAlpha = a * .55;
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  tick();
})();

/* ===== BICON STAGGERED FLOAT DELAY ===== */
document.querySelectorAll('.bicon').forEach((el, i) => {
  el.style.animationDelay = (i * 0.18) + 's';
});

/* ===== SCROLL REVEAL (Intersection Observer) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

// Add reveal classes and observe
document.querySelectorAll('.service-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i * 0.08) + 's';
  revealObserver.observe(el);
});

document.querySelectorAll('.stat').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i * 0.1) + 's';
  revealObserver.observe(el);
});

document.querySelectorAll('.section-title').forEach(el => {
  revealObserver.observe(el);
});

const aboutImg = document.querySelector('.about-img-wrap');
const aboutTxt = document.querySelector('.about-text');
if (aboutImg) { aboutImg.classList.add('reveal-left'); revealObserver.observe(aboutImg); }
if (aboutTxt) { aboutTxt.classList.add('reveal-right'); revealObserver.observe(aboutTxt); }

const aboutList = document.querySelector('.about-list');
if (aboutList) revealObserver.observe(aboutList);

document.querySelectorAll('.info-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i * 0.1) + 's';
  revealObserver.observe(el);
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) { contactForm.classList.add('reveal-right'); revealObserver.observe(contactForm); }

/* ===== STAT COUNTER ANIMATION ===== */
function animateCount(el, target, suffix) {
  const start = Date.now();
  const dur = 1800;
  const isNum = !isNaN(parseInt(target));
  if (!isNum) { el.textContent = target + suffix; return; }
  const end = parseInt(target);
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / dur, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * end) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      const numEl = entry.target.querySelector('.stat-num');
      if (!numEl) return;
      const raw = numEl.textContent.trim();
      const match = raw.match(/^(\d+)(.*)$/);
      if (match) animateCount(numEl, match[1], match[2]);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));
