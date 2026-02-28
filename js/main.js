/* =====================================================
   TTDH Web Solutions — Premium Agency Website
   js/main.js
   ===================================================== */

/* ── Lenis Smooth Scroll ───────────────────────────── */
// Improved physics: expo.out easing = faster initial response,
// ultra-smooth deceleration — the premium feel for high-ticket sites.
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const lenis = new Lenis({
  duration: 1.1,
  easing: expoOut,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.92,
  touchInertiaMultiplier: 22,
});

// Use GSAP ticker as the single RAF source for Lenis
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
      number: { value: 45, density: { enable: true, value_area: 900 } },
      color: { value: ['#1d4ed8', '#6d28d9', '#60a5fa'] },
      shape: { type: 'circle' },
      opacity: { value: 0.35, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.08, sync: false } },
      size: { value: 2, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 160, color: '#1d4ed8', opacity: 0.12, width: 1 },
      move: { enable: true, speed: 0.9, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
      modes: { grab: { distance: 200, line_linked: { opacity: 0.35 } } }
    },
    retina_detect: true
  });
}

/* ── Nav Entrance Animation ─────────────────────────── */
document.querySelectorAll('.hero-badge, .hero-headline, .hero-sub, .hero-ctas, .hero-trust').forEach(el => {
  el.classList.add('js-hidden');
});

gsap.fromTo('#navbar',
  { y: -80, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', delay: 0.2 }
);

/* ── Hero Staggered Word Animation ─────────────────── */
function splitAndAnimate() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;
  const text = headline.innerHTML;
  const words = text.split(' ');
  headline.innerHTML = words.map(w => `<span class="word" style="display:inline-block; overflow:hidden; vertical-align:top;"><span class="word-inner" style="display:inline-block; transform:translateY(110%);">${w}</span></span>`).join(' ');

  headline.classList.remove('js-hidden');
  gsap.set(headline, { opacity: 0 });

  const wordInners = headline.querySelectorAll('.word-inner');
  const tl = gsap.timeline({ delay: 0.45 });
  tl.to(headline, { opacity: 1, duration: 0 })
    .to(wordInners, {
      y: '0%',
      duration: 0.9,
      stagger: 0.055,
      ease: 'expo.out'
    });
}
splitAndAnimate();

/* Hero badge, sub, cta, trust fade-ins */
[['.hero-badge', 0], ['.hero-sub', 0.9], ['.hero-ctas', 1.15], ['.hero-trust', 1.35]].forEach(([sel, delay]) => {
  const el = document.querySelector(sel);
  if (el) {
    el.classList.remove('js-hidden');
    gsap.set(el, { opacity: 0, y: 22 });
    gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out', delay });
  }
});

gsap.from('.float-card', {
  opacity: 0,
  x: 70,
  duration: 1.0,
  stagger: 0.18,
  ease: 'expo.out',
  delay: 1.5
});

/* ── Magnetic Buttons ───────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.35, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.55)' });
  });
});

/* ── Vanilla Tilt on Service Cards ─────────────────── */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.service-card'), {
    max: 8,
    speed: 500,
    glare: true,
    'max-glare': 0.08,
    scale: 1.015,
  });
}

/* ── GSAP ScrollTrigger Reveal Animations ────────────── */
// Generic reveals — use expo.out for premium, silky deceleration
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 55 },
    {
      opacity: 1, y: 0,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    }
  );
});

gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -55 },
    {
      opacity: 1, x: 0,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    }
  );
});

gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 55 },
    {
      opacity: 1, x: 0,
      duration: 1.0,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    }
  );
});

/* Section Headers */
gsap.utils.toArray('.section-header').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 45 },
    {
      opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

/* Service Cards staggered */
gsap.fromTo('.service-card',
  { opacity: 0, y: 65 },
  {
    opacity: 1, y: 0,
    duration: 0.85,
    stagger: { amount: 0.7, ease: 'power2.out' },
    ease: 'expo.out',
    scrollTrigger: { trigger: '.services-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* Stats Cards */
gsap.fromTo('.stat-card',
  { opacity: 0, y: 50, scale: 0.94 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 0.85,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.stats-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* Before/After */
gsap.fromTo('.ba-card',
  { opacity: 0, y: 45 },
  {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: 0.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.before-after', start: 'top 86%', toggleActions: 'play none none none' }
  }
);

/* Ideal Client Cards */
gsap.fromTo('.ideal-card',
  { opacity: 0, y: 55 },
  {
    opacity: 1, y: 0,
    duration: 0.95,
    stagger: 0.18,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.ideal-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* Why Items */
gsap.fromTo('.why-item',
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0,
    duration: 0.85,
    stagger: { amount: 0.55, ease: 'power2.out' },
    ease: 'expo.out',
    scrollTrigger: { trigger: '.why-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* Process Steps */
gsap.fromTo('.process-step',
  { opacity: 0, y: 55 },
  {
    opacity: 1, y: 0,
    duration: 0.85,
    stagger: 0.16,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.process-steps',
      start: 'top 82%',
      toggleActions: 'play none none none',
      onEnter: () => {
        const fill = document.querySelector('.process-line-fill');
        if (fill) fill.style.width = '100%';
      }
    }
  }
);

/* Pricing Cards */
gsap.fromTo('.pricing-card',
  { opacity: 0, y: 60, scale: 0.96 },
  {
    opacity: 1, y: (i, el) => el.classList.contains('featured') ? -10 : 0,
    scale: 1,
    duration: 0.9,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* FAQ items */
gsap.fromTo('.faq-item',
  { opacity: 0, x: -30 },
  {
    opacity: 1, x: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.faq-list', start: 'top 86%', toggleActions: 'play none none none' }
  }
);

/* Guarantee Card */
gsap.fromTo('.guarantee-card',
  { opacity: 0, y: 50, scale: 0.97 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '#guarantee', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* CTA section */
gsap.fromTo('.cta-content',
  { opacity: 0, y: 65 },
  {
    opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
    scrollTrigger: { trigger: '#cta', start: 'top 82%', toggleActions: 'play none none none' }
  }
);

/* Contact grid */
gsap.fromTo('.contact-info',
  { opacity: 0, x: -55 },
  {
    opacity: 1, x: 0, duration: 1.0, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);
gsap.fromTo('.contact-form-wrap',
  { opacity: 0, x: 55 },
  {
    opacity: 1, x: 0, duration: 1.0, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 84%', toggleActions: 'play none none none' }
  }
);

/* Footer */
gsap.fromTo('footer',
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
    scrollTrigger: { trigger: 'footer', start: 'top 96%', toggleActions: 'play none none none' }
  }
);

/* ── Animated Counters ───────────────────────────────── */
const counters = [
  { selector: '#count-businesses', end: 150, duration: 2.2,
    format: (v) => Math.round(v) + '+' },
  { selector: '#count-leads', end: 50, duration: 2.5,
    format: (v) => Math.round(v) + 'K+' },
  { selector: '#count-conversion', end: 3, duration: 1.8,
    format: (v) => Math.round(v) + 'x' },
  { selector: '#count-revenue', end: 25, duration: 2.0,
    format: (v) => '$' + Math.round(v) + 'M+' },
];

counters.forEach(({ selector, end, duration, format }) => {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = format(0);
  const obj = { value: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 87%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        value: end,
        duration,
        ease: 'expo.out',
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
    autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
    speed: 800,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    centeredSlides: true,
    effect: 'slide',
    breakpoints: {
      768: { slidesPerView: 1.2, spaceBetween: 28 },
      1024: { slidesPerView: 1.45, spaceBetween: 32 },
    }
  });
}

/* ── Parallax on Glow Orbs ──────────────────────────── */
gsap.to('.glow-orb-1', {
  y: -90,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});
gsap.to('.glow-orb-2', {
  y: -55,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
});

/* ── FAQ Accordion ───────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all open items with smooth animation
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      openItem.classList.remove('active');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle the clicked item
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Smooth anchor scrolling with Lenis ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: expoOut
      });
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
