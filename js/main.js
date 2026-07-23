import * as THREE from 'three';
import { about, skills, experience, projects } from './data.js';
import { initCharacter, updateCharacter, renderScene, triggerAboutSpotlight, playState } from './character.js';
import { initScrollAnimations } from './scroll-animations.js';

// --- 1. Data Injection ---

function escapeAttribute(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const warmedProjectImages = new Set();
function projectThumbnailPath(imagePath = '') {
  return String(imagePath)
    .replace(/^\.\//, '')
    .replace(/^assets\/images\//, 'assets/images/thumbs/');
}

function warmProjectImages(items) {
  const queue = items
    .map(item => projectThumbnailPath(item.image))
    .filter(path => !warmedProjectImages.has(path));
  const loadBatch = () => {
    queue.splice(0, 8).forEach(path => {
      const preload = new Image();
      preload.decoding = 'async';
      preload.src = path;
      warmedProjectImages.add(path);
    });
    if (queue.length) window.setTimeout(loadBatch, 140);
  };
  loadBatch();
}

function renderProjects(filter = 'all') {
  const projectsContainer = document.getElementById('projects-track');
  if (projectsContainer && projects) {
    const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    
    projectsContainer.innerHTML = filteredProjects.map((project, index) => `
      <div class="project-card">
        <button class="project-preview-trigger" type="button" data-title="${escapeAttribute(project.title)}" data-category="${escapeAttribute(project.category)}" data-image="${escapeAttribute(project.image)}" data-link="${escapeAttribute(project.link)}">
          <div class="project-img-wrapper">
            <img src="${escapeAttribute(projectThumbnailPath(project.image))}" alt="${escapeAttribute(project.title)}" loading="${index < 16 ? 'eager' : 'lazy'}" fetchpriority="${index < 6 ? 'high' : 'auto'}" decoding="async" width="800" height="520">
          </div>
          <div class="project-info">
            <h3>${escapeAttribute(project.title)}</h3>
            <p class="text-caption">${escapeAttribute(project.category)}</p>
          </div>
        </button>
      </div>
    `).join('');
    const gallery = document.querySelector('.projects-track-container');
    if (gallery) gallery.scrollLeft = 0;
    warmProjectImages(filteredProjects);
    requestAnimationFrame(updateGalleryProgress);
    
    // Refresh ScrollTrigger so pinning distances update based on new width
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }
}

function updateGalleryProgress() {
  const gallery = document.querySelector('.projects-track-container');
  const cards = [...document.querySelectorAll('#projects-track .project-card')];
  const bar = document.getElementById('gallery-progress-bar');
  const count = document.getElementById('gallery-progress-count');
  if (!gallery || !cards.length) return;
  const max = Math.max(1, gallery.scrollWidth - gallery.clientWidth);
  const ratio = Math.min(1, Math.max(0, gallery.scrollLeft / max));
  const nearest = cards.reduce((best, card, index) => {
    const distance = Math.abs(card.offsetLeft - gallery.scrollLeft);
    return distance < best.distance ? { index, distance } : best;
  }, { index: 0, distance: Infinity }).index;
  if (bar) bar.style.transform = `scaleX(${gallery.scrollWidth <= gallery.clientWidth ? 1 : ratio})`;
  if (count) count.textContent = `${String(nearest + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
}

function renderData() {
  // About
  const aboutContainer = document.getElementById('about-content');
  if (aboutContainer && about) {
    aboutContainer.innerHTML = about.map(p => `<p>${p}</p>`).join('');
  }

  // Skills
  const skillsContainer = document.getElementById('skills-grid');
  if (skillsContainer && skills) {
    skillsContainer.innerHTML = skills.map(skill => `
      <div class="bento-card">
        <h3 class="bento-title">${skill.title}</h3>
        <div class="tags">
          ${skill.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Categories for Filter
  const filterSelect = document.getElementById('project-filter');
  if (filterSelect && projects) {
    const categories = [...new Set(projects.map(p => p.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filterSelect.appendChild(option);
    });
    
    filterSelect.addEventListener('change', (e) => {
      renderProjects(e.target.value);
    });
  }

  // Initial render of projects
  renderProjects('all');

  // Skip Button Logic — scroll #smooth-wrapper (our actual scroller)
  const skipBtn = document.getElementById('skip-projects-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      const scroller = document.getElementById('smooth-wrapper');
      const experienceSection = document.getElementById('experience');
      if (scroller && experienceSection) {
        scroller.scrollTo({
          top: experienceSection.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }

  // Experience
  const experienceContainer = document.getElementById('experience-list');
  if (experienceContainer && experience) {
    const icons = [
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="6" width="20" height="14" rx="2"/></svg>`,
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>`,
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    ];
    experienceContainer.innerHTML = experience.map((exp, idx) => `
      <div class="timeline-item">
        <div class="timeline-badge">${icons[idx % icons.length]}</div>
        <p class="timeline-period">${exp.period}</p>
        <h3 class="text-h3">${exp.title}</h3>
        <p class="text-body-sm">${exp.description}</p>
      </div>
    `).join('');
  }
}

function initInterface() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  const themeLabel = themeToggle?.querySelector('.theme-label');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* file privacy mode */ }
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('dark-mode', theme === 'dark');
    const dark = theme === 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    }
    if (themeIcon) themeIcon.textContent = dark ? '☾' : '☀';
    if (themeLabel) themeLabel.textContent = dark ? 'Light' : 'Dark';
  };
  applyTheme(initialTheme);
  const toggleTheme = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', next); } catch (_) { /* still apply in memory */ }
    applyTheme(next);
  };
  if (themeToggle) themeToggle.onclick = toggleTheme;

  const scroller = document.getElementById('smooth-wrapper');
  const sections = [...document.querySelectorAll('main > .section')];
  const dots = document.getElementById('section-dots');
  const counter = document.getElementById('section-counter');
  const progress = document.getElementById('scroll-progress-bar');
  const labels = ['Home', 'About', 'Capabilities', 'AI Lab', 'Work', 'Experience', 'Contact'];
  dots.innerHTML = sections.map((section, index) =>
    `<a href="#${section.id}" aria-label="${labels[index]}" data-index="${index}"><span>${labels[index]}</span></a>`
  ).join('');

  let activeIndex = 0;
  let wheelLocked = false;
  let wheelLockUntil = 0;
  let wheelUnlockTimer;
  let galleryAutoTimer;
  let galleryTarget = 0;
  let cancelGalleryAuto = false;
  let sectionTransitioning = false;
  const projectsIndex = sections.findIndex(section => section.id === 'projects');
  const gallery = document.querySelector('.projects-track-container');
  const galleryHint = document.getElementById('gallery-direction-hint');
  gallery?.addEventListener('scroll', updateGalleryProgress, { passive: true });
  const setActive = (index) => {
    const previousIndex = activeIndex;
    activeIndex = index;
    dots.querySelectorAll('a').forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
    if (progress) progress.style.transform = `scaleX(${sections.length > 1 ? index / (sections.length - 1) : 1})`;
    if (index === projectsIndex && previousIndex !== projectsIndex) {
      galleryHint?.classList.add('visible');
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!sectionTransitioning && entry.isIntersecting && entry.intersectionRatio >= .55) setActive(sections.indexOf(entry.target));
    });
  }, { root: scroller, threshold: [.55, .75] });
  sections.forEach(section => observer.observe(section));
  setActive(0);

  const syncActiveSection = () => {
    if (sectionTransitioning) return;
    const viewportCenter = scroller.scrollTop + scroller.clientHeight * .5;
    let closestIndex = 0;
    let closestDistance = Infinity;
    sections.forEach((section, index) => {
      const distance = Math.abs((section.offsetTop + section.offsetHeight * .5) - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActive(closestIndex);
  };
  scroller.addEventListener('scroll', syncActiveSection, { passive: true });
  window.addEventListener('resize', syncActiveSection, { passive: true });
  requestAnimationFrame(syncActiveSection);
  window.setTimeout(() => {
    const linkedSection = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (linkedSection && sections.includes(linkedSection)) {
      const previousBehavior = scroller.style.scrollBehavior;
      scroller.style.scrollBehavior = 'auto';
      scroller.scrollTop = linkedSection.offsetTop;
      requestAnimationFrame(() => { scroller.style.scrollBehavior = previousBehavior; });
      setActive(sections.indexOf(linkedSection));
      if (linkedSection.id === 'projects') {
        playState('projects', {
          text: 'Scroll to explore the filtered gallery.',
          x: 1,
          y: 2.25,
          direction: 'down'
        });
      }
    }
  }, 250);

  const lockWheel = (minimumMs) => {
    wheelLocked = true;
    wheelLockUntil = Math.max(wheelLockUntil, performance.now() + minimumMs);
    window.clearTimeout(wheelUnlockTimer);
    const release = () => {
      const remaining = wheelLockUntil - performance.now();
      if (remaining > 0) wheelUnlockTimer = window.setTimeout(release, remaining + 20);
      else wheelLocked = false;
    };
    wheelUnlockTimer = window.setTimeout(release, minimumMs + 20);
  };

  const moveToSection = (index) => {
    const destination = sections[Math.max(0, Math.min(sections.length - 1, index))];
    if (!destination) return;
    const previousIndex = activeIndex;
    if (sections.indexOf(destination) === projectsIndex && gallery) {
      const maxScroll = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
      galleryTarget = previousIndex > projectsIndex ? maxScroll : 0;
      gallery.scrollLeft = galleryTarget;
      updateGalleryProgress();
      galleryHint?.classList.add('visible');
      const hintCopy = galleryHint.querySelector('small');
      if (hintCopy) hintCopy.textContent = previousIndex > projectsIndex
        ? 'Scroll up to explore projects in reverse'
        : 'Scroll down or up to move horizontally';
    }
    lockWheel(650);
    sectionTransitioning = true;
    setActive(sections.indexOf(destination));
    if (typeof gsap !== 'undefined') {
      gsap.to(scroller, {
        scrollTop: destination.offsetTop,
        duration: .68,
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: () => {
          sectionTransitioning = false;
          syncActiveSection();
        }
      });
    } else {
      scroller.scrollTo({ top: destination.offsetTop, behavior: 'smooth' });
      window.setTimeout(() => {
        sectionTransitioning = false;
        syncActiveSection();
      }, 700);
    }
  };

  scroller.addEventListener('wheel', (event) => {
    const horizontalGallery = event.target.closest('.projects-track-container');
    if (horizontalGallery && Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (Math.abs(event.deltaY) < 12) return;
    if (wheelLocked) {
      if (activeIndex === projectsIndex) {
        wheelLocked = false;
      } else {
      event.preventDefault();
      lockWheel(160);
      return;
      }
    }
    if (activeIndex === projectsIndex && gallery) {
      scroller.scrollTop = sections[projectsIndex].offsetTop;
      const maxScroll = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
      const direction = event.deltaY > 0 ? 1 : -1;
      const canMoveGallery = direction > 0
        ? galleryTarget < maxScroll - 2 || gallery.scrollLeft < maxScroll - 4
        : galleryTarget > 2 || gallery.scrollLeft > 4;
      if (canMoveGallery) {
        event.preventDefault();
        galleryHint?.classList.remove('visible');
        const wheelDistance = event.deltaMode === 1 ? event.deltaY * 34 : event.deltaY * 1.65;
        if (Math.abs(galleryTarget - gallery.scrollLeft) > gallery.clientWidth) galleryTarget = gallery.scrollLeft;
        galleryTarget = Math.max(0, Math.min(maxScroll, galleryTarget + wheelDistance));
        const target = galleryTarget;
        cancelGalleryAuto = direction < 0;
        window.clearTimeout(galleryAutoTimer);
        const finishGalleryMove = () => {
          updateGalleryProgress();
          if (direction > 0 && target >= maxScroll - 4 && !cancelGalleryAuto) {
            galleryAutoTimer = window.setTimeout(() => {
              if (activeIndex === projectsIndex && gallery.scrollLeft >= maxScroll - 5) moveToSection(projectsIndex + 1);
            }, 950);
          }
        };
        if (typeof gsap !== 'undefined') {
          gsap.to(gallery, {
            scrollLeft: target,
            duration: .32,
            ease: 'power1.out',
            overwrite: true,
            onUpdate: updateGalleryProgress,
            onComplete: finishGalleryMove
          });
        } else {
          gallery.scrollTo({ left: target, behavior: 'smooth' });
          window.setTimeout(finishGalleryMove, 340);
        }
        return;
      }
    }
    const next = Math.max(0, Math.min(sections.length - 1, activeIndex + (event.deltaY > 0 ? 1 : -1)));
    if (next === activeIndex) return;
    event.preventDefault();
    moveToSection(next);
  }, { passive: false });
}

function initProjectPreview() {
  const modal = document.getElementById('project-preview-modal');
  if (!modal) return;
  const image = document.getElementById('preview-image');
  const title = document.getElementById('preview-title');
  const category = document.getElementById('preview-category');
  const description = document.getElementById('preview-description');
  const visit = document.getElementById('preview-visit');
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('.project-preview-trigger');
    if (trigger) {
      const safeImage = /^(?:\.\/)?assets\/images\/[a-z0-9 _.-]+$/i.test(trigger.dataset.image || '')
        ? trigger.dataset.image
        : '';
      image.src = safeImage;
      image.alt = `${trigger.dataset.title} project preview`;
      title.textContent = trigger.dataset.title;
      category.textContent = trigger.dataset.category;
      const rawLink = (trigger.dataset.link || '').trim();
      let safeWebsite = '';
      if (/^https:\/\//i.test(rawLink)) {
        try {
          safeWebsite = new URL(rawLink).href;
        } catch (_) { /* invalid external URL: preview remains local */ }
      }
      const isWebsite = Boolean(safeWebsite);
      visit.href = isWebsite ? safeWebsite : safeImage;
      visit.textContent = isWebsite ? 'Visit live site ↗' : 'View full-size preview ↗';
      if (description) description.textContent = isWebsite
        ? 'Preview of the delivered project. Open the live website to explore the complete experience.'
        : 'Archived visual project. A public live website is not available for this item.';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    if (event.target.closest('[data-close-preview]')) close();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
}

function initStarfield() {
  const field = document.createElement('div');
  field.className = 'falling-stars';
  field.setAttribute('aria-hidden', 'true');
  const starCount = window.innerWidth < 768 ? 22 : 38;
  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement('span');
    const size = 1 + Math.random() * 2.4;
    star.style.setProperty('--star-x', `${Math.random() * 100}vw`);
    star.style.setProperty('--star-size', `${size}px`);
    star.style.setProperty('--star-duration', `${5 + Math.random() * 9}s`);
    star.style.setProperty('--star-delay', `${-Math.random() * 14}s`);
    star.style.setProperty('--star-drift', `${-30 + Math.random() * 60}px`);
    field.appendChild(star);
  }
  document.body.prepend(field);
}

function initAboutActions() {
  const button = document.getElementById('about-focus-btn');
  if (!button) return;
  button.addEventListener('click', () => {
    const index = triggerAboutSpotlight();
    button.innerHTML = index >= 4 ? 'Replay highlights <span aria-hidden="true">↻</span>' : 'Show next highlight <span aria-hidden="true">✦</span>';
  });
}

// --- 2. Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  // Inject HTML content first so DOM is ready for GSAP ScrollTrigger calculations
  renderData();
  initStarfield();
  initAboutActions();
  initInterface();
  initProjectPreview();

  // Initialize Three.js scene
  const canvasContainer = document.getElementById('canvas-container');
  initCharacter(canvasContainer, () => {
    // Character loaded callback
    document.body.classList.add('loaded');
    if (window.location.hash === '#projects') {
      playState('projects', {
        text: 'Scroll to explore the filtered gallery.',
        x: 1,
        y: 2.25,
        direction: 'down'
      });
    }
  });

  // Small delay to ensure images/DOM are laid out before GSAP calculation
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
  
  // Animation loop for Three.js
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateCharacter(delta);
    renderScene();
  }
  
  animate();
});
