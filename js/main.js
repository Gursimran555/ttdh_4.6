/* =====================================================
   TTDH Web Solutions — Premium Agency Website
   js/main.js
   ===================================================== */

/* ── Lenis Smooth Scroll ───────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

// Use GSAP ticker as the single RAF source for Lenis — do NOT also use a
// separate requestAnimationFrame loop, as that would tick Lenis twice per
// frame and break mouse-wheel scrolling.
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
  currentX += (mouseX - currentX) * 0.08;
  currentY += (mouseY - currentY) * 0.08;
  if (mouseGlow) {
    mouseGlow.style.left = currentX + 'px';
    mouseGlow.style.top = currentY + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ── Sticky Navbar ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
  if (scroll > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── Mobile Menu ────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  // Stop/start Lenis so the page doesn't scroll behind the mobile overlay
  if (isOpen) {
    lenis.stop();
  } else {
    lenis.start();
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    lenis.start();
  });
});

/* ── Particles.js ───────────────────────────────────── */
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-js', {
    particles: {
      number: { value: 55, density: { enable: true, value_area: 900 } },
      color: { value: ['#4f46e5', '#7c3aed', '#6366f1'] },
      shape: { type: 'circle' },
      opacity: { value: 0.45, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false } },
      size: { value: 2.5, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 150, color: '#4f46e5', opacity: 0.18, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
      modes: { grab: { distance: 180, line_linked: { opacity: 0.4 } } }
    },
    retina_detect: true
  });
}

/* ── Nav Entrance Animation ─────────────────────────── */
// Mark hero elements as hidden — JS controls their reveal
document.querySelectorAll('.hero-badge, .hero-headline, .hero-sub, .hero-ctas').forEach(el => {
  el.classList.add('js-hidden');
});

gsap.fromTo('#navbar',
  { y: -80, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
);

/* ── Hero Staggered Word Animation ─────────────────── */
function splitAndAnimate() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;
  const text = headline.innerHTML;
  const words = text.split(' ');
  headline.innerHTML = words.map(w => `<span class="word" style="display:inline-block; overflow:hidden; vertical-align:top;"><span class="word-inner" style="display:inline-block; transform:translateY(110%);">${w}</span></span>`).join(' ');

  // Remove hidden class now that GSAP is controlling it
  headline.classList.remove('js-hidden');
  gsap.set(headline, { opacity: 0 });

  const wordInners = headline.querySelectorAll('.word-inner');
  const tl = gsap.timeline({ delay: 0.4 });
  tl.to(headline, { opacity: 1, duration: 0 })
    .to(wordInners, {
      y: '0%',
      duration: 0.7,
      stagger: 0.07,
      ease: 'power3.out'
    });
}
splitAndAnimate();

/* Hero badge, sub, cta fade ins */
['.hero-badge', '.hero-sub', '.hero-ctas'].forEach(sel => {
  const el = document.querySelector(sel);
  if (el) {
    el.classList.remove('js-hidden');
    gsap.set(el, { opacity: 0, y: 20 });
  }
});
gsap.timeline({ delay: 0.3 })
  .to('.hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
  .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85)
  .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.1);

gsap.from('.float-card', {
  opacity: 0,
  x: 60,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out',
  delay: 1.4
});

/* ── Magnetic Buttons ───────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ── Vanilla Tilt on Service Cards ─────────────────── */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.service-card'), {
    max: 10,
    speed: 400,
    glare: true,
    'max-glare': 0.12,
    scale: 1.02,
  });
}

/* ── GSAP ScrollTrigger Reveal Animations ────────────── */
// Generic reveal
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -50 },
    {
      opacity: 1, x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 50 },
    {
      opacity: 1, x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

/* Section Headers */
gsap.utils.toArray('.section-header').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    }
  );
});

/* Service Cards staggered */
gsap.fromTo('.service-card',
  { opacity: 0, y: 60 },
  {
    opacity: 1, y: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.services-grid', start: 'top 82%', toggleActions: 'play none none none' }
  }
);

/* Stats Cards */
gsap.fromTo('.stat-card',
  { opacity: 0, y: 50, scale: 0.95 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.stats-grid', start: 'top 82%', toggleActions: 'play none none none' }
  }
);

/* Before/After */
gsap.fromTo('.ba-card',
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0,
    duration: 0.75,
    stagger: 0.18,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.before-after', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* Case Study Cards */
gsap.fromTo('.case-card',
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0,
    duration: 0.75,
    stagger: 0.13,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.case-grid', start: 'top 82%', toggleActions: 'play none none none' }
  }
);

/* Why Items */
gsap.fromTo('.why-item',
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.why-grid', start: 'top 82%', toggleActions: 'play none none none' }
  }
);

/* Process Steps */
gsap.fromTo('.process-step',
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0,
    duration: 0.7,
    stagger: 0.18,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.process-steps',
      start: 'top 80%',
      toggleActions: 'play none none none',
      onEnter: () => {
        const fill = document.querySelector('.process-line-fill');
        if (fill) fill.style.width = '100%';
      }
    }
  }
);

/* CTA section */
gsap.fromTo('.cta-content',
  { opacity: 0, y: 60 },
  {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#cta', start: 'top 80%', toggleActions: 'play none none none' }
  }
);

/* Contact grid */
gsap.fromTo('.contact-info',
  { opacity: 0, x: -50 },
  {
    opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', toggleActions: 'play none none none' }
  }
);
gsap.fromTo('.contact-form-wrap',
  { opacity: 0, x: 50 },
  {
    opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', toggleActions: 'play none none none' }
  }
);

/* Footer */
gsap.fromTo('footer',
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: 'footer', start: 'top 95%', toggleActions: 'play none none none' }
  }
);

/* ── Animated Counters ───────────────────────────────── */
const counters = [
  { selector: '#count-businesses', end: 150, suffix: '+', duration: 2.2,
    format: (v) => Math.round(v) + '+' },
  { selector: '#count-leads', end: 50, suffix: 'K+', duration: 2.5,
    format: (v) => Math.round(v) + 'K+' },
  { selector: '#count-conversion', end: 3, suffix: 'x', duration: 1.8,
    format: (v) => Math.round(v) + 'x' },
  { selector: '#count-revenue', end: 25, suffix: 'M+', prefix: '$', duration: 2.0,
    format: (v) => '$' + Math.round(v) + 'M+' },
];

counters.forEach(({ selector, end, duration, format }) => {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = format(0);
  const obj = { value: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        value: end,
        duration,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = format(obj.value); },
        onComplete: () => { el.textContent = format(end); }
      });
    }
  });
});

/* ── Swiper Testimonials ─────────────────────────────── */
if (typeof Swiper !== 'undefined') {
  new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 28,
    loop: true,
    autoplay: { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 700,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    centeredSlides: true,
    effect: 'slide',
    breakpoints: {
      768: { slidesPerView: 1.25, spaceBetween: 28 },
      1024: { slidesPerView: 1.5, spaceBetween: 32 },
    }
  });
}

/* ── Parallax on Glow Orbs ──────────────────────────── */
gsap.to('.glow-orb-1', {
  y: -80,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.glow-orb-2', {
  y: -50,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

/* ── Smooth anchor scrolling with Lenis ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  });
});

/* ── Contact Form ────────────────────────────────────── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
