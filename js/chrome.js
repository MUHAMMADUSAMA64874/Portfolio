// Shared chrome for sub-pages: floating nav, theme toggle, custom cursor and the mouse guide.
// Usage: <script type="module">import { initChrome } from './js/chrome.js'; initChrome({ current: 'profile', messages: {...} });</script>
import { meta, projectStats, experience } from './data.js';
import { initMouseGuide } from './mouse.js?v=20261102';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const LINKS = [
  ['home', './index.html', 'Home'],
  ['work', './index.html#work', 'Work'],
  ['automation', './n8n-hub.html', 'Automation'],
  ['archive', './index.html#archive', 'Archive'],
  ['profile', './profile.html', 'Profile'],
  ['cv', './cv.html', 'CV']
];

export function initChrome({ current = '', messages, mouse = true, forceTheme } = {}) {
  document.documentElement.classList.add('cx');
  const sun = '<svg class="i-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const links = LINKS.map(([id, href, label]) => `<a href="${href}"${id === current ? ' class="current" aria-current="page"' : ''}>${label}</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="cursor" aria-hidden="true"><div class="cursor-ring"><span class="cursor-label"></span></div><div class="cursor-dot"></div></div>
    <div class="scroll-progress" aria-hidden="true"><i id="cx-progress"></i></div>
    <header class="nav" id="cx-nav">
      <a class="logo" href="./index.html" data-magnetic aria-label="Muhammad Usama — home">MU<b>.</b></a>
      <nav class="nav-links" aria-label="Primary">${links}</nav>
      <div class="nav-actions">
        <button class="icon-btn" id="cx-theme" type="button" aria-label="Toggle light / dark theme" data-magnetic>${sun}${moon}</button>
        <a class="btn btn-accent btn-sm hide-sm" href="./index.html#contact" data-magnetic>Hire me</a>
        <button class="icon-btn menu-btn" id="cx-menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="cx-menu"><span></span><span></span></button>
      </div>
    </header>
    <div class="mobile-menu" id="cx-menu" hidden><nav aria-label="Mobile">${links}<a href="./index.html#contact">Contact</a></nav><p class="mono muted">${meta.email}</p></div>`);

  // Theme (some pages, like the n8n hub, are dark-only)
  const root = document.documentElement;
  if (forceTheme) { root.dataset.theme = forceTheme; document.getElementById('cx-theme').hidden = true; }
  else try { root.dataset.theme = localStorage.getItem('portfolio-theme') || root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch {}
  if (!forceTheme) document.getElementById('cx-theme').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; };
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
    try { localStorage.setItem('portfolio-theme', next); } catch {}
  });

  // Mobile menu
  const btn = document.getElementById('cx-menu-btn'), menu = document.getElementById('cx-menu');
  const setMenu = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
  btn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  // Scroll: progress + hide nav on scroll down
  const nav = document.getElementById('cx-nav'), bar = document.getElementById('cx-progress');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    nav.classList.toggle('hidden', scrollY > 300 && scrollY > lastY && menu.hidden);
    lastY = scrollY;
  }, { passive: true });

  initPointer();
  if (mouse) initMouseGuide({
    years: meta.years,
    stats: { total: projectStats.total, clientSites: projectStats.clientSites, automations: '81+', roles: experience.length },
    messages
  });
}

function initPointer() {
  if (!finePointer || reduced) return;
  const root = document.documentElement;
  root.classList.add('has-cursor');
  const cur = document.querySelector('.cursor'), dot = cur.querySelector('.cursor-dot'), ring = cur.querySelector('.cursor-ring'), label = cur.querySelector('.cursor-label');
  let mx = -100, my = -100, rx = mx, ry = my;
  addEventListener('pointermove', e => {
    cur.style.opacity = 1;
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const m = e.target.closest('[data-magnetic]');
    document.querySelectorAll('[data-magnetic].mag').forEach(el => { if (el !== m) { el.classList.remove('mag'); el.style.transform = ''; } });
    if (m) {
      const r = m.getBoundingClientRect();
      m.classList.add('mag');
      m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    }
  }, { passive: true });
  (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('a, button, [data-cursor], input, textarea, select, label, summary');
    const lab = e.target.closest('[data-cursor]')?.dataset.cursor;
    cur.classList.toggle('hover', !!t && !lab);
    cur.classList.toggle('label', !!lab);
    if (lab) label.textContent = lab;
  });
  addEventListener('pointerdown', () => cur.classList.add('down'));
  addEventListener('pointerup', () => cur.classList.remove('down'));
  document.addEventListener('pointerleave', () => cur.style.opacity = 0);
  // Native <dialog> renders in the top layer, above our cursor: fall back to the system cursor while one is open.
  new MutationObserver(() => root.classList.toggle('has-cursor', !document.querySelector('dialog[open], .modal.open, .contact-modal.open')))
    .observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open', 'class', 'hidden'] });
}
