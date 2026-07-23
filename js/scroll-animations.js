import { playState } from './character.js';

export function initScrollAnimations() {
  // Register plugins
  gsap.registerPlugin(ScrollTrigger);

  // Tell GSAP that our scrolling element is #smooth-wrapper (not window)
  ScrollTrigger.defaults({ scroller: '#smooth-wrapper' });

  // --- 1. Hero Animations ---
  const heroTl = gsap.timeline();
  
  // Simple fade up if SplitText is unavailable (it's a premium plugin)
  if (typeof SplitText !== 'undefined') {
    const split = new SplitText('#hero-name', { type: 'chars' });
    heroTl.from(split.chars, {
      opacity: 0,
      y: 40,
      stagger: 0.03,
      duration: 0.6,
      ease: 'power3.out',
    });
  } else {
    heroTl.from('#hero-name', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
  }

  heroTl.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.5 }, "-=0.4")
        .from('.hero-desc', { opacity: 0, y: 20, duration: 0.5 }, "-=0.3");

  // --- 2. Horizontal Scroll for Projects (Native CSS) ---
  // GSAP pin removed to fix vertical scroll snapping. Native CSS handles horizontal scroll now.

  // --- 3. Timeline Progress Line ---
  gsap.to('#timeline-progress', {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#experience',
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    }
  });

  // --- 4. Character State Triggers ---
  const sectionStates = [
    { trigger: '#hero',       state: 'idle', config: { text: "Hi! I'm your guide. Click me!", y: -2.5, pos: 'right' } },
    { trigger: '#about',      state: 'about', config: { text: "Click me — I know more about Usama!", y: -2.5, pos: 'right' } },
    { trigger: '#skills',     state: 'skills', config: { text: "Psst... click me to clean up! 🧹", y: -2.5, pos: 'hide-right' } },
    { trigger: '#ai-lab',     state: 'ai', config: { text: "Analyzing workflows... Approved!", y: -2.5, pos: 'right' } },
    { trigger: '#projects',   state: 'projects', config: { text: "Scroll to explore the filtered gallery.", x: 1, y: 2.25 } },
    { trigger: '#experience', state: 'experience', config: { text: "My journey so far.", y: -2.5, pos: 'right' } },
    { trigger: '#contact',    state: 'contact', config: { text: "You finished the journey. Bye bye! 👋<br><button id='meme-btn' class='bubble-btn'>Click me to finish</button>", y: -2.5, pos: 'right' } },
  ];

  sectionStates.forEach(({ trigger, state, config }) => {
    ScrollTrigger.create({
      trigger,
      start: 'top 50%', // Trigger exactly when the top of the section hits the middle of the screen
      end: 'bottom 50%',
      onEnter: () => playState(state, { ...config, direction: 'down' }),
      onEnterBack: () => playState(state, { ...config, direction: 'up' })
    });
  });

  // Basic fade up for sections
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 30,
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      }
    });
  });

  gsap.utils.toArray('.section').forEach(section => {
    const content = section.querySelectorAll('.text-body, .text-h3, .bento-card, .timeline-item, .contact-form, .projects-header');
    if (!content.length) return;
    gsap.from(content, {
      opacity: 0,
      y: 42,
      rotateX: 4,
      duration: .85,
      stagger: .07,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 68%', toggleActions: 'play none none reverse' }
    });
  });

  gsap.to('.brand-mark span', {
    rotate: 360,
    ease: 'none',
    scrollTrigger: { trigger: '#smooth-content', start: 'top top', end: 'bottom bottom', scrub: .6 }
  });

  // Section snapping is handled natively by CSS scroll-snap-type: y mandatory & scroll-snap-stop: always.
}
