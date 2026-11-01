// Mouse guide: the boxing-mouse sprite walks along the bottom of the screen as
// the page scrolls, reacts to sections, does tricks on click and naps when idle.
// Sprite strips live in assets/mouse (160×216 per frame, transparent).

const FRAME_W = 160, FRAME_H = 216;
const ACTIONS = {
  idle:  { frames: 8,  fps: 8,  loop: true },
  walk:  { frames: 20, fps: 16, loop: true },
  run:   { frames: 16, fps: 18, loop: true },
  punch: { frames: 14, fps: 16 },
  combo: { frames: 15, fps: 18 },
  flip:  { frames: 15, fps: 16 },
  cheer: { frames: 20, fps: 18 },
  sleep: { frames: 5,  fps: 4,  loop: true }
};
const TRICKS = ['punch', 'flip', 'combo', 'cheer'];
const TRICK_LABEL = { punch: '🥊 Punch', flip: '🤸 Flip', combo: '⚡ Combo', cheer: '🎉 Cheer' };
// The cartoon this mouse comes from — shown at the end of the page.
const RECOGNIZE_URL = 'https://youtu.be/NenlQz-FkLY?t=6142';

export function initMouseGuide({ stats, years, messages }) {
  try { if (localStorage.getItem('mouse-guide') === 'off') return showRestore(); } catch {}

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SECTION = messages || {
    top:        ['idle',  "Hi! I'm Usama's guide. Click me for a trick 🥊"],
    work:       ['flip',  'Flagship builds — click any card for the full story.'],
    automation: ['combo', `${stats.automations} automations. These five save the most hours.`],
    skills:     ['punch', 'WordPress, n8n, Python… the daily toolkit.'],
    archive:    ['flip',  `All ${stats.total} projects. Press / to search.`],
    experience: ['punch', `${years} years, ${stats.roles} roles — follow the timeline.`],
    about:      ['idle',  "That's Usama — Karachi-based, remote-ready."],
    contact:    ['cheer', 'Do you recognize me? If not, click me to watch ↗']
  };
  const CLICK_LINES = [
    `${stats.clientSites} live client sites and counting!`,
    'Custom plugins, not page-builder bloat. 🥊',
    'Available now — zero-day notice.',
    'Automations that work while you sleep. 😴',
    'Open to remote roles worldwide 🌍'
  ];

  // DOM
  const root = document.createElement('div');
  root.className = 'mg';
  root.innerHTML = `
    <div class="mg-bubble" role="status" aria-live="polite"><span class="mg-text"></span><span class="mg-chips"></span></div>
    <button class="mg-body" type="button" aria-label="Mouse guide — click for a trick" data-cursor="Poke">
      <span class="mg-sprite"></span><span class="mg-shadow"></span>
    </button>
    <button class="mg-close" type="button" aria-label="Hide the mouse guide">✕</button>`;
  document.body.appendChild(root);
  const sprite = root.querySelector('.mg-sprite');
  const body = root.querySelector('.mg-body');
  const bubble = root.querySelector('.mg-bubble');
  const bubbleText = root.querySelector('.mg-text');
  const chips = root.querySelector('.mg-chips');
  chips.innerHTML = TRICKS.map(t => `<button type="button" data-trick="${t}">${TRICK_LABEL[t]}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-trick]'); if (!b) return;
    e.stopPropagation(); wake(); trick(b.dataset.trick);
    say({ punch: 'Pow! 🥊 Quick right jab.', flip: 'Whoa! 🤸 Backflip.', combo: 'Flurry combo! ⚡', cheer: 'Victory! 🎉' }[b.dataset.trick], 3500, true);
  });

  // Preload strips
  for (const a of Object.keys(ACTIONS)) { const i = new Image(); i.src = `./assets/mouse/${a}.webp`; }

  let action = 'idle', frame = 0, acc = 0, last = performance.now();
  let oneShot = null, x = 0, targetX = 0, facing = 1, lastY = scrollY, vel = 0;
  let lastActive = Date.now(), sleeping = false, section = 'top', bubbleTimer, clickIdx = 0;

  const scale = () => (innerWidth < 720 ? 0.42 : 0.6);
  function setAction(name) {
    if (action === name) return;
    action = name; frame = 0; acc = 0;
    const s = scale();
    sprite.style.backgroundImage = `url(./assets/mouse/${name}.webp)`;
    sprite.style.backgroundSize = `${ACTIONS[name].frames * FRAME_W * s}px ${FRAME_H * s}px`;
  }
  function size() {
    const s = scale();
    root.style.setProperty('--mw', FRAME_W * s + 'px');
    root.style.setProperty('--mh', FRAME_H * s + 'px');
    const a = action; action = ''; setAction(a);
  }
  function say(text, ms = 3800, withChips = false) {
    bubbleText.textContent = text;
    root.classList.toggle('chips', withChips);
    root.classList.add('talk');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => root.classList.remove('talk'), ms);
  }
  function trick(name) { oneShot = name; setAction(name); }
  function wake() { lastActive = Date.now(); if (sleeping) { sleeping = false; root.classList.remove('zz'); } }

  // Track range: left edge → before the "Hire me" button
  const range = () => Math.max(0, innerWidth - (innerWidth < 720 ? 210 : 330));
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    targetX = h > 0 ? (scrollY / h) * range() : 0;
    vel = Math.abs(scrollY - lastY);
    if (scrollY !== lastY) facing = scrollY > lastY ? 1 : -1;
    lastY = scrollY;
    wake();
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { size(); onScroll(); });
  ['pointermove', 'keydown', 'touchstart'].forEach(e => addEventListener(e, wake, { passive: true }));

  // Section reactions
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id === 'top' ? 'top' : e.target.id;
      if (id === section || !SECTION[id]) continue;
      section = id;
      const [anim, text] = SECTION[id];
      if (anim !== 'idle' && !reduced) trick(anim);
      say(text, id === 'contact' ? 600000 : 3800);
    }
  }, { threshold: 0.45 });
  document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

  body.addEventListener('click', () => {
    wake();
    if (section === 'contact') { trick('cheer'); window.open(RECOGNIZE_URL, '_blank', 'noopener,noreferrer'); return; }
    trick(TRICKS[Math.floor(Math.random() * TRICKS.length)]);
    say(CLICK_LINES[clickIdx++ % CLICK_LINES.length], 6000, true);
  });
  body.addEventListener('pointerenter', () => { if (section !== 'contact' && !oneShot && !root.classList.contains('talk')) say('Psst… click me!', 1800); });
  root.querySelector('.mg-close').addEventListener('click', () => {
    root.classList.add('bye');
    try { localStorage.setItem('mouse-guide', 'off'); } catch {}
    setTimeout(() => { root.remove(); showRestore(); }, 500);
  });

  // Loop
  size(); onScroll(); x = targetX; setAction('idle');
  setTimeout(() => say(SECTION.top[1], 4500), 1800);
  function tick(t) {
    const dt = Math.min(64, t - last); last = t;
    // movement
    const dx = targetX - x;
    x += dx * (reduced ? 1 : Math.min(1, dt / 260));
    const moving = Math.abs(dx) > 1.5;
    if (!oneShot) {
      if (Date.now() - lastActive > 25000) { if (!sleeping) { sleeping = true; root.classList.add('zz'); say('Zzz… scroll to wake me', 2500); } setAction('sleep'); }
      else if (moving && !reduced) setAction(vel > 40 || Math.abs(dx) > 120 ? 'run' : 'walk');
      else setAction('idle');
    }
    vel *= 0.9;
    root.style.transform = `translateX(${x}px)`;
    // sprite art faces left, so mirror it when walking right
    sprite.style.transform = `scaleX(${-facing})`;
    // frames
    const a = ACTIONS[action];
    if (!reduced || oneShot) {
      acc += dt;
      const step = 1000 / a.fps;
      while (acc >= step) {
        acc -= step; frame++;
        if (frame >= a.frames) {
          if (a.loop) frame = 0;
          else { frame = a.frames - 1; oneShot = null; setAction('idle'); break; }
        }
      }
    }
    sprite.style.backgroundPosition = `${-frame * FRAME_W * scale()}px 0`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Small pill to bring the guide back after it was hidden.
function showRestore() {
  const b = document.createElement('button');
  b.className = 'mg-restore'; b.type = 'button'; b.textContent = '🐭';
  b.setAttribute('aria-label', 'Show the mouse guide');
  b.addEventListener('click', () => { try { localStorage.removeItem('mouse-guide'); } catch {} location.reload(); });
  document.body.appendChild(b);
}
