/* =====================================================
   TTDH Web Solutions — Premium Agency Website
   js/main.js
   ===================================================== */

/* ── Lenis Smooth Scroll ───────────────────────────── */
// Improved physics: expo.out gives a snappier start and
// ultra-smooth, natural deceleration — much better than the
// default ease curve.
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const lenis = new Lenis({
  // Lower duration = snappier response; higher wheelMultiplier = less lag
  duration: 0.85,
  easing: expoOut,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.1,
  touchMultiplier: 1.5,
});

// GSAP ticker is the single RAF source for Lenis.
// Do NOT add a separate requestAnimationFrame loop — it would
// tick Lenis twice per frame and break wheel scrolling.
lenis.on('scroll', () => ScrollTrigger.update());
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ── Mouse Glow Effect ─────────────────────────────── */
const mouseGlow = document.getElementById('mouse-glow');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  currentX += (mouseX - currentX) * 0.07;
  currentY += (mouseY - currentY) * 0.07;
  if (mouseGlow) {
    mouseGlow.style.left = currentX + 'px';
    mouseGlow.style.top  = currentY + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ── Sticky Navbar ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
  navbar.classList.toggle('scrolled', scroll > 55);
});

/* ── Mobile Menu ────────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  isOpen ? lenis.stop() : lenis.start();
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    lenis.start();
  });
});

/* ── Theme Switcher ─────────────────────────────────── */
const themeSwitcher  = document.getElementById('theme-switcher');
const themeToggle    = document.getElementById('theme-toggle');
const themeOptions   = document.querySelectorAll('.theme-option');
const htmlEl         = document.documentElement;

// Restore saved theme
const savedTheme = localStorage.getItem('ttdh-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = themeSwitcher.classList.toggle('open');
  themeToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!themeSwitcher.contains(e.target)) {
    themeSwitcher.classList.remove('open');
    themeToggle.setAttribute('aria-expanded', 'false');
  }
});

themeOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const theme = opt.dataset.theme;
    applyTheme(theme);
    themeSwitcher.classList.remove('open');
    themeToggle.setAttribute('aria-expanded', 'false');
  });
  // Keyboard support
  opt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      opt.click();
    }
  });
});

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('ttdh-theme', theme);
  themeOptions.forEach(o => {
    const active = o.dataset.theme === theme;
    o.classList.toggle('active', active);
    o.setAttribute('aria-selected', String(active));
  });
  // Update particles color to match theme accent
  updateParticlesColor(theme);
}

const THEME_COLORS = {
  dark:     ['#6366f1','#8b5cf6','#a5b4fc'],
  midnight: ['#22d3ee','#06b6d4','#67e8f9'],
  light:    ['#4f46e5','#7c3aed','#6366f1'],
  ocean:    ['#34d399','#059669','#6ee7b7'],
  dusk:     ['#f472b6','#ec4899','#fbcfe8'],
};

function updateParticlesColor(theme) {
  if (typeof window.pJSDom === 'undefined' || !window.pJSDom.length) return;
  try {
    const pJS = window.pJSDom[0].pJS;
    const colors = THEME_COLORS[theme] || THEME_COLORS.dark;
    pJS.particles.array.forEach((p, i) => {
      p.color.value = colors[i % colors.length];
      p.color.rgb   = hexToRgb(colors[i % colors.length]);
    });
    pJS.fn.particlesRefresh();
  } catch (_) { /* silently ignore if pJS not ready */ }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

/* ── Particles.js ───────────────────────────────────── */
if (typeof particlesJS !== 'undefined') {
  const colors = THEME_COLORS[htmlEl.getAttribute('data-theme')] || THEME_COLORS.dark;
  particlesJS('particles-js', {
    particles: {
      number:    { value: 48, density: { enable: true, value_area: 900 } },
      color:     { value: colors },
      shape:     { type: 'circle' },
      opacity:   { value: 0.40, random: true, anim: { enable: true, speed: 0.7, opacity_min: 0.08, sync: false } },
      size:      { value: 2.2, random: true, anim: { enable: false } },
      line_linked:{ enable: true, distance: 155, color: colors[0], opacity: 0.14, width: 1 },
      move:      { enable: true, speed: 0.85, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
      modes:  { grab: { distance: 190, line_linked: { opacity: 0.35 } } }
    },
    retina_detect: true
  });
}

/* ── Nav Entrance Animation ─────────────────────────── */
document.querySelectorAll('.hero-badge, .hero-headline, .hero-sub, .hero-ctas').forEach(el => {
  el.classList.add('js-hidden');
});

gsap.fromTo('#navbar',
  { y: -72, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', delay: 0.15 }
);

/* ── Hero Staggered Word Animation ─────────────────── */
function splitAndAnimate() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;
  const words = headline.innerHTML.split(' ');
  headline.innerHTML = words.map(w =>
    `<span class="word" style="display:inline-block;overflow:hidden;vertical-align:top;">` +
    `<span class="word-inner" style="display:inline-block;transform:translateY(110%);">${w}</span></span>`
  ).join(' ');
  headline.classList.remove('js-hidden');
  gsap.set(headline, { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.38 });
  tl.to(headline, { opacity: 1, duration: 0 })
    .to(headline.querySelectorAll('.word-inner'), {
      y: '0%',
      duration: 0.88,
      stagger: 0.052,
      ease: 'expo.out',
    });
}
splitAndAnimate();

// Hero badge / sub / CTAs
['.hero-badge', '.hero-sub', '.hero-ctas'].forEach(sel => {
  const el = document.querySelector(sel);
  if (el) { el.classList.remove('js-hidden'); gsap.set(el, { opacity: 0, y: 22 }); }
});
gsap.timeline({ delay: 0.28 })
  .to('.hero-badge', { opacity:1, y:0, duration:0.7, ease:'expo.out' }, 0)
  .to('.hero-sub',   { opacity:1, y:0, duration:0.8, ease:'expo.out' }, 0.82)
  .to('.hero-ctas',  { opacity:1, y:0, duration:0.7, ease:'expo.out' }, 1.05);

/* ── Magnetic Buttons ───────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    gsap.to(btn, { x: x * 0.26, y: y * 0.26, duration: 0.32, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.52)' });
  });
});

/* ── Vanilla Tilt on Service Cards ─────────────────── */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.service-card'), {
    max: 9, speed: 420, glare: true, 'max-glare': 0.10, scale: 1.015,
  });
}

/* ── GSAP ScrollTrigger Reveals ─────────────────────── */
const revealCfg = { ease: 'expo.out', scrollTrigger: { toggleActions: 'play none none none' } };

gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity:0, y:50 },
    { opacity:1, y:0, duration:0.95, ...revealCfg,
      scrollTrigger: { trigger:el, start:'top 90%', toggleActions:'play none none none' }
    }
  );
});
gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity:0, x:-50 },
    { opacity:1, x:0, duration:0.95, ease:'expo.out',
      scrollTrigger: { trigger:el, start:'top 90%', toggleActions:'play none none none' }
    }
  );
});
gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity:0, x:50 },
    { opacity:1, x:0, duration:0.95, ease:'expo.out',
      scrollTrigger: { trigger:el, start:'top 90%', toggleActions:'play none none none' }
    }
  );
});

// Section headers
gsap.utils.toArray('.section-header').forEach(el => {
  gsap.fromTo(el,
    { opacity:0, y:42 },
    { opacity:1, y:0, duration:1.0, ease:'expo.out',
      scrollTrigger: { trigger:el, start:'top 88%', toggleActions:'play none none none' }
    }
  );
});

// Service cards
gsap.fromTo('.service-card',
  { opacity:0, y:60 },
  { opacity:1, y:0, duration:0.82, stagger:{ amount:0.65, ease:'power2.out' }, ease:'expo.out',
    scrollTrigger: { trigger:'.services-grid', start:'top 84%', toggleActions:'play none none none' }
  }
);

// Why items
gsap.fromTo('.why-item',
  { opacity:0, y:50 },
  { opacity:1, y:0, duration:0.82, stagger:{ amount:0.55, ease:'power2.out' }, ease:'expo.out',
    scrollTrigger: { trigger:'.why-grid', start:'top 84%', toggleActions:'play none none none' }
  }
);

// Process steps
gsap.fromTo('.process-step',
  { opacity:0, y:50 },
  { opacity:1, y:0, duration:0.82, stagger:0.15, ease:'expo.out',
    scrollTrigger: {
      trigger: '.process-steps', start: 'top 82%', toggleActions: 'play none none none',
      onEnter: () => {
        const fill = document.querySelector('.process-line-fill');
        if (fill) fill.style.width = '100%';
      }
    }
  }
);

// FAQ items
gsap.fromTo('.faq-item',
  { opacity:0, x:-32 },
  { opacity:1, x:0, duration:0.72, stagger:0.07, ease:'expo.out',
    scrollTrigger: { trigger:'.faq-list', start:'top 86%', toggleActions:'play none none none' }
  }
);

// CTA
gsap.fromTo('.cta-content',
  { opacity:0, y:56 },
  { opacity:1, y:0, duration:1.0, ease:'expo.out',
    scrollTrigger: { trigger:'#cta', start:'top 82%', toggleActions:'play none none none' }
  }
);

// Contact grid
gsap.fromTo('.contact-info',
  { opacity:0, x:-48 },
  { opacity:1, x:0, duration:0.95, ease:'expo.out',
    scrollTrigger: { trigger:'.contact-grid', start:'top 84%', toggleActions:'play none none none' }
  }
);
gsap.fromTo('.contact-form-wrap',
  { opacity:0, x:48 },
  { opacity:1, x:0, duration:0.95, ease:'expo.out',
    scrollTrigger: { trigger:'.contact-grid', start:'top 84%', toggleActions:'play none none none' }
  }
);

// Footer
gsap.fromTo('footer',
  { opacity:0, y:36 },
  { opacity:1, y:0, duration:0.85, ease:'expo.out',
    scrollTrigger: { trigger:'footer', start:'top 96%', toggleActions:'play none none none' }
  }
);

/* ── Swiper Testimonials ─────────────────────────────── */
if (typeof Swiper !== 'undefined') {
  new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 26,
    loop: true,
    autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 650,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    centeredSlides: true,
    grabCursor: true,
    breakpoints: {
      768:  { slidesPerView: 1.2,  spaceBetween: 26 },
      1024: { slidesPerView: 1.45, spaceBetween: 30 },
    }
  });
}

/* ── Parallax on Glow Orbs ──────────────────────────── */
gsap.to('.glow-orb-1', {
  y: -85,
  scrollTrigger: { trigger:'#hero', start:'top top', end:'bottom top', scrub: 1.4 }
});
gsap.to('.glow-orb-2', {
  y: -50,
  scrollTrigger: { trigger:'#hero', start:'top top', end:'bottom top', scrub: 1.8 }
});

/* ── FAQ Accordion ───────────────────────────────────── */
// Visibility is handled entirely by CSS max-height transition.
// JS only toggles the 'open' class and aria-expanded attribute.
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked item (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Smooth anchor scrolling ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id     = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.45, easing: expoOut });
    }
  });
});

/* ── Contact Form → Formspree ────────────────────────── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = contactForm.querySelector('.form-submit');
    const orig = btn.textContent;

    // Validate required fields
    const name    = contactForm.querySelector('[name="name"]').value.trim();
    const email   = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();
    if (!name || !email || !message) {
      btn.textContent = '⚠ Please fill all fields';
      setTimeout(() => { btn.textContent = orig; }, 2500);
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xeelwaoq', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm),
      });

      if (res.ok) {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        const data = await res.json().catch(() => ({}));
        btn.textContent = data.error || '✗ Failed — Try Again';
        btn.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      }
    } catch (err) {
      console.warn('Contact form submission error:', err);
      btn.textContent = '✗ Network Error — Try Again';
      btn.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }
  });
}
