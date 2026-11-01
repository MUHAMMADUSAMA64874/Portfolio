// Portfolio front end. Content comes from data.js; this file only renders and animates.
import { initMouseGuide } from './mouse.js?v=20261102';
import { meta, statusMeta, about, experience, projects, categories, categoryShort, projectStats, education, languages, workflows, stack } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const src = p => encodeURI(p);
const thumbFor = p => p.thumb || (p.image ? 'assets/images/thumbs/' + p.image.split('/').pop().replace(/\.[^.]+$/, '') + '.webp' : '');
const statusBadge = s => `<span class="status s-${esc(statusMeta[s]?.tone || s)}">${esc(statusMeta[s]?.label || s)}</span>`;
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/* ---------- Simple binds ---------- */
$$('[data-bind]').forEach(el => { el.textContent = meta[el.dataset.bind] ?? ''; });
$('#year').textContent = new Date().getFullYear();

/* ---------- Hero ---------- */
$$('.split').forEach(el => {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.style.setProperty('--ci', i + (el.classList.contains('outline') ? 8 : 0));
    s.textContent = ch;
    el.appendChild(s);
  });
});

const stats = [
  [projectStats.clientSites, '', 'Live client sites'],
  [projectStats.total, '', 'Projects shipped'],
  [parseInt(meta.years, 10), '+', 'Years building'],
  [0, '-day', 'Notice period']
];
$('#hero-stats').innerHTML = stats.map(([n, suf, label]) => `<div><dt>${label}</dt><dd><span data-count="${n}">0</span>${suf}</dd></div>`).join('');
function runCounters() {
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count;
    if (reduced || !to) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// Rotating role words (typewriter)
const words = ['WordPress platforms', 'Shopify stores', 'n8n automations', 'custom plugins', 'AI agents', 'data pipelines'];
function rotate() {
  const el = $('#rotator');
  if (reduced) return;
  let w = 0, i = words[0].length, deleting = true;
  const step = () => {
    const word = words[w];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 250; }
    else if (!deleting && i === words[w].length) { deleting = true; delay = 2200; }
    setTimeout(step, delay);
  };
  setTimeout(step, 3200);
}

// Terminal card
function typeTerminal() {
  const lines = [
    ['c', '$ usama --status'],
    ['k', 'role     ', 's', '"WordPress + AI automation"'],
    ['k', 'location ', 's', '"Karachi · remote OK"'],
    ['k', 'notice   ', 's', '"0 days"'],
    ['k', 'stack    ', 's', '[wp, php, n8n, python]'],
    ['k', 'hiring?  ', 's', 'true ✓']
  ];
  const pre = $('#term-text');
  const html = lines.map(l => l.length === 2 ? `<span class="${l[0]}">${esc(l[1])}</span>` : `<span class="${l[0]}">${esc(l[1])}</span><span class="${l[2]}">${esc(l[3])}</span>`);
  if (reduced) { pre.innerHTML = html.join('\n'); return; }
  let n = 0;
  const next = () => { pre.innerHTML = html.slice(0, ++n).join('\n'); if (n < html.length) setTimeout(next, 380); };
  setTimeout(next, 1700);
}

// Deck of featured screenshots
const featured = projects.filter(p => p.featured);
$('#deck').innerHTML = ['skl-watches', 'chef-academy', 'seaholm']
  .map(id => projects.find(p => p.id === id)).filter(Boolean)
  .map(p => `<div class="deck-card"><img src="${src(thumbFor(p))}" alt="" loading="eager"></div>`).join('');

/* ---------- Marquee ---------- */
const marqueeWords = ['WordPress', 'WooCommerce', 'Shopify', 'n8n', 'PHP', 'Python', 'Make.com', 'OpenAI', 'Ollama', 'Playwright', 'ACF Pro', 'Node.js', 'Laravel', 'Supabase', 'Stripe', 'Docker'];
$('#marquee').innerHTML = [...marqueeWords, ...marqueeWords].map(w => `<span>${w}</span>`).join('');

/* ---------- Featured work ---------- */
$('#featured').innerHTML = featured.map((p, i) => `
  <button class="feat" type="button" data-open="${esc(p.id)}" data-tilt data-cursor="View" data-reveal style="--i:${i % 2}">
    <div class="feat-media"><img src="${src(p.image || thumbFor(p))}" alt="${esc(p.title)} preview" loading="lazy"></div>
    <div class="shine"></div>
    <div class="feat-body">
      <div class="feat-top">${statusBadge(p.status)}<span class="mono muted">${esc(categoryShort[p.category] || p.category)}</span></div>
      <div class="feat-top"><h3>${esc(p.title)}</h3><span class="arrow" aria-hidden="true">↗</span></div>
      <p>${esc(p.subtitle || p.summary)}</p>
      <div class="tags">${(p.tech || []).slice(0, 5).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>
  </button>`).join('');

/* ---------- Workflows ---------- */
$('#flows').innerHTML = workflows.map((w, i) => `
  <article class="flow glow" data-reveal style="--i:${i % 3}">
    <h3>${esc(w.title)}</h3>
    <span class="impact">${esc(w.impact)}</span>
    <p>${esc(w.body)}</p>
    <div class="tags">${w.stack.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    <i class="flow-line"></i>
  </article>`).join('');

/* ---------- Bento ---------- */
const icons = {
  cms: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/>',
  ai: '<rect x="5" y="7" width="14" height="12" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"/>',
  code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
  data: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>',
  tools: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'
};
$('#bento').innerHTML = stack.map((g, i) => `
  <article class="bento-cell glow" data-reveal style="--i:${i % 3}">
    <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[g.icon]}</svg>${esc(g.title)}</h3>
    <div class="tags">${g.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
  </article>`).join('');

/* ---------- Archive ---------- */
const statusOrder = ['live', 'staging', 'local', 'archive', 'github', 'down'];
const ordered = [...projects].sort((a, b) =>
  (a.category === 'Credentials') - (b.category === 'Credentials') ||
  statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
const PAGE = () => (innerWidth < 720 ? 10 : 24);
const state = { cat: 'All', status: 'All', q: '', limit: PAGE() };
$('#archive-lede').textContent = `All ${projects.length} projects — ${projectStats.clientSites} live client sites, staging builds, local tools, plugins and sites that have since gone offline. Statuses checked ${fmtDate(meta.lastAudit)}.`;

function pillHTML(group, value, label, n) {
  return `<button class="pill" type="button" data-${group}="${esc(value)}" aria-pressed="${state[group] === value}">${esc(label)}<small>${n}</small></button>`;
}
function renderPills() {
  $('#cat-pills').innerHTML = pillHTML('cat', 'All', 'All work', projects.length) +
    categories.map(c => pillHTML('cat', c, categoryShort[c] || c, projects.filter(p => p.category === c).length)).join('');
  const inCat = projects.filter(p => state.cat === 'All' || p.category === state.cat);
  $('#status-pills').innerHTML = pillHTML('status', 'All', 'Any status', inCat.length) +
    statusOrder.filter(s => inCat.some(p => p.status === s))
      .map(s => pillHTML('status', s, statusMeta[s].label, inCat.filter(p => p.status === s).length)).join('');
}
function matches(p) {
  if (state.cat !== 'All' && p.category !== state.cat) return false;
  if (state.status !== 'All' && p.status !== state.status) return false;
  if (!state.q) return true;
  const hay = [p.title, p.subtitle, p.summary, p.category, p.role, ...(p.tech || [])].join(' ').toLowerCase();
  return state.q.split(/\s+/).every(t => hay.includes(t));
}
function renderArchive() {
  const list = ordered.filter(matches);
  const shown = list.slice(0, state.limit);
  $('#archive-grid').innerHTML = shown.map((p, i) => `
    <button class="card" type="button" data-open="${esc(p.id)}" data-cursor="Open" style="--i:${i};view-transition-name:p-${esc(p.id)}">
      <div class="card-media"><img src="${src(thumbFor(p))}" alt="${esc(p.title)} preview" loading="lazy" decoding="async" width="800" height="520"></div>
      <span class="badge">${statusBadge(p.status)}</span>
      <div class="shine"></div>
      <div class="card-body">
        <h3>${esc(p.title)}</h3>
        <div class="meta"><span>${esc(categoryShort[p.category] || p.category)}${p.tech?.[0] && p.tech[0] !== (categoryShort[p.category] || p.category) ? ' · ' + esc(p.tech[0]) : ''}</span></div>
      </div>
    </button>`).join('');
  $('#count').textContent = `Showing ${shown.length} of ${list.length}${list.length !== projects.length ? ` (filtered from ${projects.length})` : ''}`;
  const more = $('#more');
  more.hidden = shown.length >= list.length;
  more.textContent = `Show more projects (${list.length - shown.length} left)`;
  $('#empty').hidden = list.length > 0;
}
function update(fn) {
  const go = () => { fn(); state.limit = PAGE(); renderPills(); renderArchive(); };
  if (document.startViewTransition && !reduced) document.startViewTransition(go); else go();
}
$('#cat-pills').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) update(() => { state.cat = b.dataset.cat; state.status = 'All'; }); });
$('#status-pills').addEventListener('click', e => { const b = e.target.closest('[data-status]'); if (b) update(() => { state.status = b.dataset.status; }); });
let qTimer;
$('#search').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); state.limit = state.q ? 999 : PAGE(); renderPills(); renderArchive(); }, 120); });
addEventListener('keydown', e => {
  if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#search').focus(); }
});
$('#more').addEventListener('click', () => { state.limit += PAGE() * 2; renderArchive(); });
renderPills(); renderArchive();

/* ---------- Experience ---------- */
$('#timeline').insertAdjacentHTML('beforeend', experience.map((j, i) => `
  <li class="job" data-reveal style="--i:${i % 2}">
    <div><h3>${esc(j.role)}</h3><span class="co">${esc(j.company)}</span> <span class="muted">· ${esc(j.location)}</span></div>
    <span class="when">${esc(j.period)}</span>
    <p>${esc(j.description)}</p>
    <div class="tags">${(j.skills || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
  </li>`).join(''));

/* ---------- About ---------- */
$('#about-text').innerHTML = about.map(p => `<p>${p}</p>`).join('');
const facts = [
  ['Based in', meta.location, meta.workModes],
  ['Availability', meta.availability, meta.timezone],
  ...education.map(e => ['Education', e.degree + ' — ' + e.school, [e.period, e.note].filter(Boolean).join(' · ')]),
  ['Languages', languages.map(l => l.name).join(' · '), languages.map(l => `${l.name}: ${l.level}`).join(' · ')]
];
$('#facts').innerHTML = facts.map(([k, v, s]) => `<dl class="fact"><dt>${esc(k)}</dt><dd>${esc(v)}${s ? `<small>${esc(s)}</small>` : ''}</dd></dl>`).join('');

/* ---------- Socials ---------- */
const sIcons = {
  LinkedIn: '<path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>',
  GitHub: '<path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/>',
  WhatsApp: '<path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/>',
  CV: '<path fill="none" stroke="currentColor" stroke-width="2" d="M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6"/>'
};
const socials = [['LinkedIn', meta.linkedin], ['GitHub', meta.github], ['WhatsApp', meta.whatsapp], ['CV', meta.resume]];
$('#socials').innerHTML = socials.map(([n, url]) =>
  `<a class="social" href="${esc(url)}" ${n === 'CV' ? 'download' : 'target="_blank" rel="noopener"'} data-magnetic><svg viewBox="0 0 24 24" aria-hidden="true">${sIcons[n]}</svg>${n === 'CV' ? 'Download CV' : n}</a>`).join('');

/* ---------- Copy email ---------- */
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); };
$('#copy-email').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(meta.email); toast('Email copied — talk soon!'); }
  catch { location.href = 'mailto:' + meta.email; }
});

/* ---------- Modal ---------- */
const modal = $('#modal');
let current = -1, modalList = ordered;
function openProject(id, list = ordered) {
  modalList = list;
  current = list.findIndex(p => p.id === id);
  const p = list[current];
  if (!p) return;
  const shots = [{ src: p.image || thumbFor(p), caption: p.title }, ...(p.gallery || [])];
  const img = $('#m-img');
  img.src = src(shots[0].src); img.alt = p.title + ' screenshot';
  $('#m-thumbs').innerHTML = shots.length > 1 ? shots.map((s, i) => `<button type="button" data-shot="${esc(s.src)}" aria-label="${esc(s.caption || 'Screenshot ' + (i + 1))}" aria-current="${i === 0}"><img src="${src(s.src)}" alt=""></button>`).join('') : '';
  $('#m-cat').textContent = `${p.category}${p.role ? ' · ' + p.role : ''}`;
  $('#m-title').textContent = p.title;
  $('#m-status').innerHTML = `${statusBadge(p.status)} <span class="muted">· ${esc(statusMeta[p.status]?.description || '')} Checked ${fmtDate(p.verified || meta.lastAudit)}</span>`;
  $('#m-summary').textContent = p.summary || '';
  $('#m-high').innerHTML = (p.highlights || []).map(h => `<li>${esc(h)}</li>`).join('');
  $('#m-tech').innerHTML = (p.tech || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  const link = $('#m-link');
  if (p.link) {
    link.hidden = false;
    link.href = p.link.startsWith('http') || p.link.startsWith('./') ? p.link : src(p.link);
    link.textContent = (p.linkLabel || (p.link.startsWith('assets/') ? 'View full image' : 'Open project')) + ' ↗';
  } else link.hidden = true;
  if (!modal.open) {
    modal.showModal(); lenis?.stop();
    // the custom cursor can't sit above the dialog's top layer, so use the native one
    document.documentElement.classList.remove('has-cursor');
  }
  $('.m-body', modal).scrollTop = 0;
}
function closeModal() { modal.close(); }
modal.addEventListener('close', () => {
  lenis?.start();
  if (finePointer && !reduced) document.documentElement.classList.add('has-cursor');
});
modal.addEventListener('click', e => {
  if (e.target === modal || e.target.closest('[data-close]')) closeModal();
  const shot = e.target.closest('[data-shot]');
  if (shot) {
    $('#m-img').src = src(shot.dataset.shot);
    $$('#m-thumbs button').forEach(b => b.setAttribute('aria-current', b === shot));
  }
});
const step = d => openProject(modalList[(current + d + modalList.length) % modalList.length].id, modalList);
$('#m-prev').addEventListener('click', () => step(-1));
$('#m-next').addEventListener('click', () => step(1));
modal.addEventListener('keydown', e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
document.addEventListener('click', e => {
  const b = e.target.closest('[data-open]');
  if (!b) return;
  const list = b.closest('#featured') ? featured : ordered.filter(matches);
  openProject(b.dataset.open, list);
});

/* ---------- Theme ---------- */
$('#theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => { root.dataset.theme = next; $('meta[name="theme-color"]').content = next === 'dark' ? '#08090c' : '#f4f3ee'; };
  if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  try { localStorage.setItem('portfolio-theme', next); } catch {}
});

/* ---------- Mobile menu ---------- */
const menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
const setMenu = open => {
  menu.hidden = !open; menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
  open ? lenis?.stop() : lenis?.start();
};
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

/* ---------- Smooth scroll (Lenis) ---------- */
let lenis = null;
function initLenis() {
  if (reduced || !window.Lenis) return;
  lenis = new window.Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = a.getAttribute('href') === '#top' ? 0 : $(a.getAttribute('href'));
  if (target === null) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { offset: -80 });
  else (target === 0 ? scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) : target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
});

/* ---------- Scroll-driven UI ---------- */
const nav = $('#nav'), fab = $('#fab'), bar = $('#progress'), tlFill = $('#tl-fill'), timeline = $('#timeline');
const sections = $$('main section[id]');
const links = $$('.nav-links a');
let lastY = scrollY, ticking = false;
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  nav.classList.toggle('hidden', y > 300 && y > lastY && menu.hidden);
  lastY = y;
  fab.classList.toggle('show', y > innerHeight * .8 && y < h - 600);
  const r = timeline.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height));
  tlFill.style.setProperty('--p', p);
  let active = '';
  for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * .4) active = s.id;
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
$$('[data-reveal]').forEach(el => io.observe(el));

/* ---------- Pointer effects (desktop only) ---------- */
function initPointer() {
  if (!finePointer || reduced) return;
  document.documentElement.classList.add('has-cursor');
  const cur = $('.cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring'), label = $('.cursor-label');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  const hero = $('.hero'), visual = $('#hero-visual'), deck = $('#deck');

  addEventListener('pointermove', e => {
    cur.style.opacity = 1;
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0) {
      hero.style.setProperty('--mx', mx - hr.left + 'px');
      hero.style.setProperty('--my', my - hr.top + 'px');
      const nx = (mx / innerWidth - .5), ny = (my / innerHeight - .5);
      deck.style.setProperty('--ry', `${-14 + nx * 18}deg`);
      deck.style.setProperty('--rx', `${8 - ny * 14}deg`);
      $$('.float-chip', visual).forEach((c, i) => { c.style.translate = `${nx * (14 + i * 8)}px ${ny * (14 + i * 6)}px`; });
    }
  }, { passive: true });
  (function loop() {
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener('pointerover', e => {
    const t = e.target.closest('a, button, [data-cursor], input, textarea, label');
    const lab = e.target.closest('[data-cursor]')?.dataset.cursor;
    cur.classList.toggle('hover', !!t && !lab);
    cur.classList.toggle('label', !!lab);
    if (lab) label.textContent = lab;
  });
  addEventListener('pointerdown', () => cur.classList.add('down'));
  addEventListener('pointerup', () => cur.classList.remove('down'));
  document.addEventListener('pointerleave', () => cur.style.opacity = 0);
  document.addEventListener('pointerenter', () => cur.style.opacity = 1);

  // Magnetic buttons
  document.addEventListener('pointermove', e => {
    const m = e.target.closest('[data-magnetic]');
    $$('[data-magnetic].mag').forEach(el => { if (el !== m) { el.classList.remove('mag'); el.style.transform = ''; } });
    if (!m) return;
    const r = m.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    m.classList.add('mag');
    m.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
  }, { passive: true });

  // Tilt + shine + glow borders
  document.addEventListener('pointermove', e => {
    const g = e.target.closest('.glow, .card, .feat');
    if (g) {
      const r = g.getBoundingClientRect();
      g.style.setProperty('--px', e.clientX - r.left + 'px');
      g.style.setProperty('--py', e.clientY - r.top + 'px');
    }
    const t = e.target.closest('[data-tilt]');
    $$('[data-tilt].tilting').forEach(el => { if (el !== t) { el.classList.remove('tilting'); el.style.transform = ''; } });
    if (!t) return;
    const r = t.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
    t.classList.add('tilting');
    t.style.transform = `perspective(1000px) rotateX(${-ny * 6}deg) rotateY(${nx * 8}deg) translateY(-4px)`;
  }, { passive: true });
}

/* ---------- Boot ---------- */
function boot() {
  initLenis();
  initPointer();
  document.documentElement.classList.add('is-loaded');
  document.body.classList.add('is-loaded');
  runCounters(); rotate(); typeTerminal(); onScroll();
  initMouseGuide({ years: meta.years, stats: { total: projectStats.total, clientSites: projectStats.clientSites, automations: '81+', roles: experience.length } });
}
// Short intro: wait for fonts (max 1.2 s) so the title split doesn't jump.
const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1000))]) : Promise.resolve();
const minIntro = new Promise(r => setTimeout(r, reduced ? 0 : 650));
Promise.all([fontsReady, minIntro]).then(boot, boot);
