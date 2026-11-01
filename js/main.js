import { about, skills, experience, projects, categories, categoryShort, statusMeta, meta, projectStats } from './data.js';
import { initCompanion, triggerAboutSpotlight, playState, notifyScroll, setSectionState } from './companion.js?v=20261028-1';
import { initScrollAnimations } from './scroll-animations.js?v=20261027-1';

/* ------------------------------------------------------------------ utils */

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHttpUrl(value = '') {
  const raw = String(value).trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : '';
    } catch (_) {
      return '';
    }
  }
  if (/^assets\/images\/[\w ./%-]+$/i.test(raw)) return raw;
  if (/^\.\/?[\w ./%-]+\.html(?:[?#].*)?$/i.test(raw) || /^\.\/?[\w ./%-]+$/i.test(raw)) return raw;
  return '';
}

function thumbFor(project) {
  if (project.thumb) return project.thumb;
  const clean = String(project.image || '').replace(/^\.\//, '');
  if (!clean) return '';
  const base = clean.split('/').pop().replace(/\.[^.]+$/, '');
  return `assets/images/thumbs/${base}.webp`;
}

function primaryLink(project) {
  const raw = String(project.link || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^\.\/?[\w ./%-]+\.html(?:[?#].*)?$/i.test(raw) || /^\.\/?[\w ./%-]+$/i.test(raw)) return raw;
  return '';
}

const projectById = new Map(projects.map(p => [p.id, p]));

function statusPill(status, compact = false) {
  const info = statusMeta[status] || statusMeta.local;
  return `<span class="status-pill${compact ? ' status-pill-sm' : ''}" data-tone="${info.tone}"><i aria-hidden="true"></i>${escapeHtml(info.label)}</span>`;
}

function techList(project, limit = 4) {
  const items = (project.tech || []).slice(0, limit);
  return items.map(t => `<li>${escapeHtml(t)}</li>`).join('');
}

/* ------------------------------------------------------------------ hero */

function renderHeroStats() {
  const mount = document.getElementById('hero-stats');
  if (!mount) return;
  const stats = [
    { value: String(projectStats.total), label: 'projects archived' },
    { value: String(projectStats.clientSites), label: 'live client sites' },
    { value: '81+', label: 'n8n pipelines' },
    { value: '5+', label: 'years shipping' }
  ];
  mount.innerHTML = stats.map(s => `
    <div class="hero-stat">
      <dt>${escapeHtml(s.value)}</dt>
      <dd>${escapeHtml(s.label)}</dd>
    </div>
  `).join('');
}

/* ------------------------------------------------------------ featured */

function renderFeatured() {
  const mount = document.getElementById('featured-grid');
  if (!mount) return;
  const featured = projects.filter(p => p.featured);
  mount.innerHTML = featured.map((project, index) => {
    const link = primaryLink(project);
    return `
      <article class="featured-card" data-project-id="${escapeHtml(project.id)}">
        <button class="featured-media" type="button" data-open-project="${escapeHtml(project.id)}" aria-label="Open ${escapeHtml(project.title)} case study">
          <img src="${escapeHtml(thumbFor(project))}" alt="${escapeHtml(project.title)}" width="800" height="520" loading="${index < 2 ? 'eager' : 'lazy'}" fetchpriority="${index < 2 ? 'high' : 'auto'}" decoding="async">
          <span class="featured-index">${String(index + 1).padStart(2, '0')}</span>
          ${statusPill(project.status)}
        </button>
        <div class="featured-body">
          <p class="card-kicker">${escapeHtml(categoryShort[project.category] || project.category)}</p>
          <h3>${escapeHtml(project.title)}</h3>
          ${project.subtitle ? `<p class="featured-subtitle">${escapeHtml(project.subtitle)}</p>` : ''}
          <p class="featured-summary">${escapeHtml(project.summary)}</p>
          <ul class="card-tech">${techList(project, 4)}</ul>
          <div class="featured-actions">
            <button class="text-link" type="button" data-open-project="${escapeHtml(project.id)}">Case study <span aria-hidden="true">&#8594;</span></button>
            ${link ? `<a class="text-link text-link-muted" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.linkLabel || 'Open site')} <span aria-hidden="true">&#8599;</span></a>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ------------------------------------------------------------- archive */

const archiveState = { category: 'all', status: 'all', query: '' };

function renderFilterPills() {
  const catMount = document.getElementById('category-filter-pills');
  const statusMount = document.getElementById('status-filter-pills');
  if (catMount) {
    catMount.innerHTML = ['all', ...categories].map(cat => `
      <button class="filter-pill${archiveState.category === cat ? ' active' : ''}" type="button" data-category="${escapeHtml(cat)}" aria-pressed="${archiveState.category === cat}">
        ${escapeHtml(cat === 'all' ? 'All work' : (categoryShort[cat] || cat))}
      </button>
    `).join('');
  }
  if (statusMount) {
    const counts = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    const order = ['live', 'staging', 'local', 'archive', 'down'];
    statusMount.innerHTML = [
      `<button class="filter-pill${archiveState.status === 'all' ? ' active' : ''}" type="button" data-status="all" aria-pressed="${archiveState.status === 'all'}">Everything</button>`,
      ...order.filter(s => counts[s]).map(status => `
        <button class="filter-pill${archiveState.status === status ? ' active' : ''}" type="button" data-status="${status}" aria-pressed="${archiveState.status === status}">
          ${escapeHtml(statusMeta[status].label)} <span class="pill-count">${counts[status]}</span>
        </button>
      `)
    ].join('');
  }
}

function matchesArchive(project) {
  if (archiveState.category !== 'all' && project.category !== archiveState.category) return false;
  if (archiveState.status !== 'all' && project.status !== archiveState.status) return false;
  if (!archiveState.query) return true;
  const haystack = [
    project.title,
    project.subtitle,
    project.summary,
    project.category,
    ...(project.tech || [])
  ].join(' ').toLowerCase();
  return haystack.includes(archiveState.query);
}

function renderArchive() {
  const grid = document.getElementById('archive-grid');
  const count = document.getElementById('archive-count');
  const empty = document.getElementById('archive-empty');
  const reset = document.getElementById('archive-reset');
  if (!grid) return;

  const visible = projects.filter(matchesArchive);

  grid.innerHTML = visible.map(project => `
    <article class="archive-card" data-tone="${statusMeta[project.status]?.tone || 'local'}">
      <button class="archive-media" type="button" data-open-project="${escapeHtml(project.id)}" aria-label="Open ${escapeHtml(project.title)}">
        <img src="${escapeHtml(thumbFor(project))}" alt="" width="800" height="520" loading="lazy" decoding="async">
        ${statusPill(project.status, true)}
      </button>
      <div class="archive-body">
        <h4>${escapeHtml(project.title)}</h4>
        <p>${escapeHtml(project.subtitle || categoryShort[project.category] || project.category)}</p>
      </div>
    </article>
  `).join('');

  if (count) {
    const filtered = archiveState.category !== 'all' || archiveState.status !== 'all' || archiveState.query;
    count.textContent = filtered
      ? `Showing ${visible.length} of ${projects.length} projects`
      : `${projects.length} projects`;
  }
  if (empty) empty.hidden = visible.length > 0;
  if (reset) reset.hidden = !(archiveState.category !== 'all' || archiveState.status !== 'all' || archiveState.query);

  window.refreshArchiveReveals?.();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initArchive() {
  renderFilterPills();
  renderArchive();

  document.getElementById('category-filter-pills')?.addEventListener('click', (event) => {
    const pill = event.target.closest('[data-category]');
    if (!pill) return;
    archiveState.category = pill.dataset.category;
    renderFilterPills();
    renderArchive();
  });

  document.getElementById('status-filter-pills')?.addEventListener('click', (event) => {
    const pill = event.target.closest('[data-status]');
    if (!pill) return;
    archiveState.status = pill.dataset.status;
    renderFilterPills();
    renderArchive();
  });

  const search = document.getElementById('archive-search');
  if (search) {
    let timer = 0;
    search.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        archiveState.query = search.value.trim().toLowerCase();
        renderArchive();
      }, 120);
    });
  }

  document.getElementById('archive-reset')?.addEventListener('click', () => {
    archiveState.category = 'all';
    archiveState.status = 'all';
    archiveState.query = '';
    const search = document.getElementById('archive-search');
    if (search) search.value = '';
    renderFilterPills();
    renderArchive();
  });
}

/* ----------------------------------------------------------- static data */

function renderStatic() {
  const aboutContainer = document.getElementById('about-content');
  if (aboutContainer) {
    aboutContainer.innerHTML = about.map(p => `<p>${p}</p>`).join('');
  }

  const skillsContainer = document.getElementById('skills-grid');
  if (skillsContainer) {
    skillsContainer.innerHTML = skills.map((skill, index) => `
      <div class="bento-card" data-index="${index}">
        <span class="bento-number">${String(index + 1).padStart(2, '0')}</span>
        <h3 class="bento-title">${escapeHtml(skill.title)}</h3>
        <div class="tags">
          ${skill.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  const experienceContainer = document.getElementById('experience-list');
  if (experienceContainer) {
    experienceContainer.innerHTML = experience.map((exp, idx) => `
      <div class="timeline-item${idx === 0 ? ' is-current' : ''}">
        <div class="timeline-badge" aria-hidden="true"><span></span></div>
        <div class="timeline-meta">
          <p class="timeline-period">${escapeHtml(exp.period)}</p>
          ${idx === 0 ? '<span class="timeline-current-tag">Present Role</span>' : ''}
        </div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="timeline-role">${escapeHtml(exp.role || exp.title)}</h3>
            <span class="timeline-company">${escapeHtml(exp.company || '')}</span>
          </div>
          <p class="timeline-desc">${escapeHtml(exp.description)}</p>
          ${exp.skills ? `
            <div class="timeline-skills">
              ${exp.skills.map(s => `<span class="timeline-skill-pill">${escapeHtml(s)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  const year = document.getElementById('footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
}

/* --------------------------------------------------------------- modal */

function initProjectModal() {
  const modal = document.getElementById('project-preview-modal');
  if (!modal) return;
  const image = document.getElementById('preview-image');
  const title = document.getElementById('preview-title');
  const category = document.getElementById('preview-category');
  const description = document.getElementById('preview-description');
  const highlights = document.getElementById('preview-highlights');
  const tech = document.getElementById('preview-tech');
  const gallery = document.getElementById('preview-gallery');
  const visit = document.getElementById('preview-visit');
  const verified = document.getElementById('preview-verified');
  const dialog = modal.querySelector('.project-preview-dialog');
  let lastTrigger = null;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    document.getElementById('smooth-wrapper')?.classList.remove('modal-open');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  };

  const open = (project, trigger) => {
    if (!project) return;
    lastTrigger = trigger || null;
    image.src = project.image || thumbFor(project);
    image.alt = `${project.title} preview`;
    title.textContent = project.title;
    const status = statusMeta[project.status];
    category.innerHTML = `${escapeHtml(categoryShort[project.category] || project.category)} <span class="preview-sep">/</span> ${statusPill(project.status, true)}`;
    description.textContent = project.summary || '';

    highlights.innerHTML = (project.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join('');
    highlights.hidden = !(project.highlights && project.highlights.length);

    tech.innerHTML = (project.tech || []).map(t => `<span>${escapeHtml(t)}</span>`).join('');

    const shots = (project.gallery || []).map(shot => `
      <figure>
        <img src="${escapeHtml(shot.src)}" alt="${escapeHtml(shot.caption || project.title)}" loading="lazy" decoding="async">
        <figcaption>${escapeHtml(shot.caption || '')}</figcaption>
      </figure>
    `).join('');
    gallery.innerHTML = shots;
    gallery.hidden = !shots;

    const link = primaryLink(project);
    const isExternal = /^https?:/i.test(link);

    // Every claim of "live" carries the date it was actually checked.
    const checked = project.verified || meta.lastAudit;
    const checkedLabel = new Date(`${checked}T12:00:00`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (verified) {
      const note = {
        live: 'Live site',
        staging: 'Staging preview',
        archive: isExternal ? 'Restored archive · source on GitHub' : 'Restored archive · preserved build',
        local: isExternal ? 'Local build · source on GitHub' : 'Local build · offline standalone project',
        down: 'Offline'
      }[project.status] || 'Offline';
      verified.textContent = note;
      verified.dataset.tone = statusMeta[project.status]?.tone || 'local';
    }

    visit.href = link || '#';
    visit.textContent = link
      ? `${project.linkLabel || (isExternal ? 'Visit live site' : 'Open project')} ↗`
      : 'Preview image ↗';
    visit.hidden = !link;
    visit.target = '_blank';
    visit.rel = 'noopener noreferrer';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modal.inert = false;
    modal.querySelector('.preview-close')?.focus({ preventScroll: true });
    if (dialog) dialog.scrollTop = 0;
    document.getElementById('smooth-wrapper')?.classList.add('modal-open');
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-project]');
    if (trigger) {
      event.preventDefault();
      open(projectById.get(trigger.dataset.openProject), trigger);
      return;
    }
    if (event.target.closest('[data-close-preview]')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ------------------------------------------------------------- interface */

function initInterface() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  const themeLabel = themeToggle?.querySelector('.theme-label');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* privacy mode */ }
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
  if (themeToggle) {
    themeToggle.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', next); } catch (_) { /* in-memory only */ }
      applyTheme(next);
    };
  }

  const scroller = document.getElementById('smooth-wrapper');
  const sections = [...document.querySelectorAll('main > .section')];
  const dots = document.getElementById('section-dots');
  const counter = document.getElementById('section-counter');
  const progress = document.getElementById('scroll-progress-bar');
  const labels = ['Home', 'About', 'Capabilities', 'Work', 'Experience', 'Contact'];
  if (dots) {
    dots.innerHTML = sections.map((section, index) =>
      `<a href="#${section.id}" aria-label="${labels[index]}" data-index="${index}"><span>${labels[index]}</span></a>`
    ).join('');
  }

  let activeIndex = 0;
  let sectionTransitioning = false;

  const setActive = (index) => {
    const previousIndex = activeIndex;
    activeIndex = index;
    dots?.querySelectorAll('a').forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
    if (progress) progress.style.transform = `scaleX(${sections.length > 1 ? index / (sections.length - 1) : 1})`;
    if (index !== previousIndex && window.__heroScene) {
      window.__heroScene.setSection(index);
    }
    const sectionId = sections[index]?.id;
    if (sectionId) setSectionState(sectionId);
  };

  const syncActiveSection = () => {
    if (sectionTransitioning || !scroller) return;
    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 30) {
      setActive(sections.length - 1);
      return;
    }
    const viewportCenter = scroller.scrollTop + scroller.clientHeight * 0.5;
    let foundIndex = -1;
    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      if (viewportCenter >= section.offsetTop && viewportCenter < section.offsetTop + section.offsetHeight) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex === -1) foundIndex = viewportCenter < (sections[0]?.offsetTop || 0) ? 0 : sections.length - 1;
    setActive(foundIndex);
  };

  let lastScrollTop = scroller?.scrollTop || 0;
  let lastScrollTime = performance.now();

  scroller?.addEventListener('scroll', () => {
    const now = performance.now();
    const currentTop = scroller.scrollTop;
    const deltaY = Math.abs(currentTop - lastScrollTop);
    const speed = (deltaY / Math.max(1, now - lastScrollTime)) * 16;
    lastScrollTop = currentTop;
    lastScrollTime = now;
    if (deltaY > 2) notifyScroll(speed);
    syncActiveSection();
  }, { passive: true });

  window.addEventListener('resize', syncActiveSection, { passive: true });
  requestAnimationFrame(syncActiveSection);

  window.setTimeout(() => {
    const linkedSection = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (linkedSection && sections.includes(linkedSection) && scroller) {
      const previousBehavior = scroller.style.scrollBehavior;
      scroller.style.scrollBehavior = 'auto';
      scroller.scrollTop = linkedSection.offsetTop;
      requestAnimationFrame(() => { scroller.style.scrollBehavior = previousBehavior; });
      setActive(sections.indexOf(linkedSection));
    }
  }, 250);

  const moveToSection = (index) => {
    const destination = sections[Math.max(0, Math.min(sections.length - 1, index))];
    if (!destination || !scroller) return;
    const destIndex = sections.indexOf(destination);
    sectionTransitioning = true;
    setActive(destIndex);
    notifyScroll(14);
    if (typeof gsap !== 'undefined') {
      gsap.to(scroller, {
        scrollTop: destination.offsetTop,
        duration: 0.7,
        ease: 'power2.inOut',
        overwrite: true,
        onUpdate: () => notifyScroll(20),
        onComplete: () => {
          sectionTransitioning = false;
          setActive(destIndex);
        }
      });
    } else {
      scroller.scrollTo({ top: destination.offsetTop, behavior: 'auto' });
      sectionTransitioning = false;
      setActive(destIndex);
    }
  };

  dots?.addEventListener('click', (event) => {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    event.preventDefault();
    const index = parseInt(anchor.dataset.index, 10);
    if (!Number.isNaN(index)) moveToSection(index);
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.closest('#section-dots')) return;
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const targetSection = document.querySelector(href);
      if (targetSection && sections.includes(targetSection)) {
        event.preventDefault();
        moveToSection(sections.indexOf(targetSection));
      }
    });
  });
}

/* ---------------------------------------------------------------- boot */

document.addEventListener('DOMContentLoaded', () => {
  renderHeroStats();
  renderStatic();
  renderFeatured();
  initArchive();
  initInterface();
  initProjectModal();

  initCompanion(() => {
    document.body.classList.add('loaded');
    if (window.location.hash === '#projects') {
      playState('projects', { text: 'Filter by category or status — every project is here.', direction: 'down' });
    }
  });

  window.setTimeout(() => {
    initScrollAnimations();
  }, 100);
});
