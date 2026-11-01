/**
 * Scroll choreography — GSAP only, scoped to #smooth-wrapper.
 * Every reveal is short (0.6–0.9s) so content is never blank on arrival.
 */

export function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ scroller: '#smooth-wrapper' });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    gsap.set('.hero-eyebrow, #hero-name, .hero-subtitle, .hero-desc, .hero-actions, .hero-stat, .section-head, .bento-card, .featured-card, .archive-card, .timeline-item, .contact-form, .contact-card', {
      clearProps: 'all'
    });
    return;
  }

  /* --- hero intro ------------------------------------------------------ */
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('.hero-eyebrow', { y: 12, opacity: 0, duration: 0.55 })
    .from('#hero-name', { y: 46, opacity: 0, duration: 1.05 }, '-=0.3')
    .from('.hero-subtitle', { y: 18, opacity: 0, duration: 0.6 }, '-=0.65')
    .from('.hero-desc', { y: 18, opacity: 0, duration: 0.6 }, '-=0.45')
    .from('.hero-actions', { y: 16, opacity: 0, duration: 0.55 }, '-=0.4')
    .from('.hero-stat', { y: 18, opacity: 0, duration: 0.55, stagger: 0.07 }, '-=0.35')
    .from('.hero-scroll-cue', { opacity: 0, duration: 0.6 }, '-=0.3');

  // Safety net: if the ticker is throttled (background tab, headless, paused
  // compositor) the intro must not leave the hero permanently invisible.
  window.setTimeout(() => {
    document.querySelectorAll('.hero-eyebrow, #hero-name, .hero-subtitle, .hero-desc, .hero-actions, .hero-stat, .hero-scroll-cue')
      .forEach((el) => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) gsap.set(el, { clearProps: 'all' });
      });
  }, 2400);

  /* --- section heads --------------------------------------------------- */
  document.querySelectorAll('.section-head').forEach((head) => {
    gsap.from(head.children, {
      y: 26,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 86%', once: true }
    });
  });

  /* --- about ----------------------------------------------------------- */
  gsap.from('.about-content p', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.06,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.about-content', start: 'top 82%', once: true }
  });

  gsap.from('.about-aside > *', {
    y: 22,
    opacity: 0,
    duration: 0.75,
    stagger: 0.09,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.about-aside', start: 'top 84%', once: true }
  });

  /* --- skills ---------------------------------------------------------- */
  gsap.from('.bento-card', {
    y: 30,
    opacity: 0,
    duration: 0.75,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#skills-grid', start: 'top 84%', once: true }
  });

  /* --- featured work --------------------------------------------------- */
  gsap.from('.featured-card', {
    y: 34,
    opacity: 0,
    duration: 0.85,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#featured-grid', start: 'top 82%', once: true }
  });

  /* --- archive --------------------------------------------------------- */
  const archiveGrid = document.getElementById('archive-grid');
  if (archiveGrid) {
    ScrollTrigger.batch('.archive-card', {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.from(batch, {
        y: 22,
        opacity: 0,
        duration: 0.6,
        stagger: 0.035,
        ease: 'power2.out',
        overwrite: true
      })
    });
  }

  /* --- experience ------------------------------------------------------ */
  gsap.from('.timeline-item', {
    y: 26,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.timeline-list', start: 'top 84%', once: true }
  });

  gsap.fromTo('.timeline-progress', { height: '0%' }, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline-list',
      start: 'top 78%',
      end: 'bottom 60%',
      scrub: 0.4
    }
  });

  /* --- contact --------------------------------------------------------- */
  gsap.from('.contact-form, .contact-card', {
    y: 26,
    opacity: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-layout', start: 'top 84%', once: true }
  });

  /* --- live-updating archive cards ------------------------------------ */
  window.refreshArchiveReveals = () => {
    gsap.fromTo(
      '#archive-grid .archive-card',
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.02, ease: 'power2.out', overwrite: true }
    );
    ScrollTrigger.refresh();
  };

  // Images can change layout height after decode; keep triggers honest.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  document.querySelectorAll('.featured-media img, .archive-media img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
}
