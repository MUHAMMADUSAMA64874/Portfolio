// Sprite companion: a hand-keyed mouse that reacts to the page, the mouse
// pointer and section changes. All animation frames live in assets/mouse.

const FRAME_W = 160;
const FRAME_H = 216;

const ACTIONS = {
  idle: { src: './assets/mouse/idle.png', frames: 8, fps: 8, loop: true },
  walk: { src: './assets/mouse/walk.png', frames: 20, fps: 14, loop: true },
  run: { src: './assets/mouse/run.png', frames: 16, fps: 16, loop: true },
  punch: { src: './assets/mouse/punch.png', frames: 14, fps: 16, loop: false, hold: 260 },
  combo: { src: './assets/mouse/combo.png', frames: 15, fps: 18, loop: false, hold: 320 },
  flip: { src: './assets/mouse/flip.png', frames: 15, fps: 16, loop: false, hold: 260 },
  cheer: { src: './assets/mouse/cheer.png', frames: 20, fps: 16, loop: false, hold: 350 },
  sleep: { src: './assets/mouse/sleep.png', frames: 5, fps: 4, loop: true },
};

const SECTION_ACTION = {
  idle: 'idle',
  hero: 'idle',
  about: 'flip',
  skills: 'punch',
  ai: 'combo',
  'ai-lab': 'combo',
  projects: 'flip',
  experience: 'punch',
  contact: 'cheer',
};

const SECTION_PROMPTS = {
  hero: "Hey! I'm your interactive mouse guide. Click me for tricks!",
  about: "5+ years crafting robust web systems & custom code.",
  skills: "Heavyweight tech stack — Node.js, Three.js, APIs & n8n!",
  ai: "81+ production automation workflows deployed.",
  'ai-lab': "Real-time AI workflows and battle-tested integrations.",
  projects: "Over 50+ shipped projects, live portals & interactive 3D builds.",
  experience: "5 years in the ring shipping rock-solid production systems.",
  contact: "Do you recognize me? If not, click me!",
};

const REACTIONS = [
  { anim: 'punch', text: 'Pow! 🥊 Rapid delivery and punchy, high-performance code.' },
  { anim: 'flip', text: 'Acrobatic agility — 🤸 dodging bugs and bloated libraries!' },
  { anim: 'combo', text: 'Full combo! ⚡ 81+ automation workflows and custom full-stack builds.' },
  { anim: 'cheer', text: 'Champion reliability — 🎉 built with Three.js, GSAP & clean architecture.' },
];

const BUBBLE_ID = 'companion-bubble';
const IDLE_SLEEP_MS = 24000;
const REFERENCE_HEIGHT = 116;
const END_VIDEO_URL = 'https://youtu.be/NenlQz-FkLY?t=6142';

let layer;
let button;
let sprite;
let bubble;
let bubbleText = "Hi! I'm your guide. Click me!";
let images = {};
let currentAction = 'idle';
let requestedAction = 'idle';
let currentFrame = 0;
let frameClock = 0;
let lastTick = 0;
let rafId = 0;
let ready = false;
let baseAction = 'idle';
let sectionState = 'hero';
let oneShot = false;
let finishing = false;
let finishTimer = 0;
let sleeping = false;
let lastInteraction = Date.now();
let aboutFactIndex = 0;
let reactionIndex = 0;
let reducedMotion = false;
let bubbleTimer = 0;
let collisionTucked = false;
let lastCollisionAt = 0;
let lastCollisionCheck = 0;
let isAtEnd = false;
let lastBottom = -1;
let lastLeft = -1;

const COLLISION_POLL_MS = 200;
const COLLISION_CLEAR_MS = 550;
const COLLISION_MIN_OVERLAP = 8;

function isCompact() {
  return window.innerWidth < 768;
}

function viewportScale() {
  const width = window.innerWidth;
  if (width >= 1440) return 0.95;
  if (width >= 1024) return 0.85;
  if (width >= 768) return 0.72;
  if (width >= 420) return 0.58;
  return 0.52;
}

function rightInset() {
  const width = window.innerWidth;
  if (width >= 1024) return 20;
  return 12;
}

function bottomInset() {
  const width = window.innerWidth;
  let base = 16;
  if (width >= 1024) base = 38;
  else if (width >= 768) base = 28;

  // Measure distance to site-footer if visible so the mouse docks strictly ABOVE copyright
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const footerOffset = window.innerHeight - rect.top + 16;
      if (footerOffset > base) return Math.round(footerOffset);
    }
  }

  if (sectionState === 'contact' || isAtEnd) {
    return width >= 1024 ? 96 : 76;
  }

  return base;
}

function updatePosition() {
  if (!button || !ready) return;
  const currentBottom = bottomInset();
  const scale = viewportScale();
  const displayWidth = Math.round(FRAME_W * scale);
  const displayHeight = Math.round(FRAME_H * scale);
  const currentLeft = Math.round(window.innerWidth - displayWidth - rightInset());

  if (currentBottom !== lastBottom) {
    lastBottom = currentBottom;
    button.style.bottom = `${currentBottom}px`;
    updateBubblePosition();
  }
  if (currentLeft !== lastLeft) {
    lastLeft = currentLeft;
    button.style.left = `${currentLeft}px`;
    updateBubblePosition();
  }
}

function ensureBubble() {
  if (bubble) return;
  bubble = document.createElement('div');
  bubble.id = BUBBLE_ID;
  bubble.className = 'companion-bubble';
  bubble.dataset.side = 'center';
  bubble.setAttribute('role', 'status');
  bubble.setAttribute('aria-live', 'polite');
  bubble.addEventListener('click', (event) => {
    wake();
    if (isAtEnd || sectionState === 'contact') {
      event.preventDefault();
      event.stopPropagation();
      window.open(END_VIDEO_URL, '_blank', 'noopener,noreferrer');
      if (!reducedMotion) playOneShot('cheer');
    }
  });
  document.body.appendChild(bubble);
}

function spawnPopBadge(action) {
  if (!button) return;
  const badge = document.createElement('span');
  badge.className = 'companion-pop-badge';
  const labels = {
    punch: '🥊 POW!',
    combo: '⚡ COMBO!',
    flip: '🤸 FLIP!',
    cheer: '🎉 NICE!'
  };
  badge.textContent = labels[action] || '✦';
  button.appendChild(badge);
  setTimeout(() => badge.remove(), 750);
}

function ensureLayer() {
  if (layer) return;
  layer = document.createElement('div');
  layer.id = 'companion-layer';
  button = document.createElement('button');
  button.id = 'companion';
  button.className = 'companion-launcher';
  button.type = 'button';
  button.setAttribute('aria-label', "Meet Usama's mouse guide. Click for tricks and combos.");
  sprite = document.createElement('span');
  sprite.className = 'companion-sprite';
  sprite.setAttribute('aria-hidden', 'true');
  button.appendChild(sprite);
  layer.appendChild(button);
  document.body.appendChild(layer);
  button.addEventListener('click', handleCompanionClick);
  button.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
    wake();
    if (isAtEnd || sectionState === 'contact') {
      window.open(END_VIDEO_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    playOneShot('combo');
    spawnPopBadge('combo');
    showBubble("⚡ Super Combo Flurry! You found the double-click trick!", { autoHide: 4500, showChips: true });
  });
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleResize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    lastTick = 0;
  });
}

function handleResize() {
  if (!ready) return;
  applyAction(currentAction, { restart: false });
  applyTuck();
  updateBubblePosition();
}

// The guide is docked to the bottom-right corner, which is exactly where a
// text-dense page keeps its content. Measure the docked box (from layout
// values, so the tuck transform never skews the result) and step aside
// whenever real content would sit underneath it.
function companionBox() {
  const width = button.offsetWidth;
  const height = button.offsetHeight;
  const left = parseFloat(button.style.left || '0') || 0;
  const bottom = parseFloat(button.style.bottom || '0') || 0;
  const top = window.innerHeight - bottom - height;
  return { left, top, right: left + width, bottom: top + height, width, height };
}

function hasContentCollision() {
  if (!ready || !button.style.left) return false;
  const box = companionBox();
  if (box.right <= 0 || box.left >= window.innerWidth) return false;
  const nodes = document.querySelectorAll(
    '#smooth-content h1, #smooth-content h2, #smooth-content h3,' +
    '#smooth-content p, #smooth-content a, #smooth-content button,' +
    '#smooth-content input, #smooth-content textarea'
  );
  for (const node of nodes) {
    if (node === button || node.disabled) continue;
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.05) continue;
    const rect = node.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) continue;
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const overlapX = Math.min(rect.right, box.right) - Math.max(rect.left, box.left);
    const overlapY = Math.min(rect.bottom, box.bottom) - Math.max(rect.top, box.top);
    if (overlapX > COLLISION_MIN_OVERLAP && overlapY > COLLISION_MIN_OVERLAP) return true;
  }
  return false;
}

function evaluateCollision(now) {
  if (!ready) return;
  if (hasContentCollision()) {
    lastCollisionAt = now;
    if (!collisionTucked) {
      collisionTucked = true;
      applyTuck();
    }
  } else if (collisionTucked && now - lastCollisionAt > COLLISION_CLEAR_MS) {
    collisionTucked = false;
    applyTuck();
  }
  lastCollisionCheck = now;
}

function sectionTucked() {
  // The lab, the archive and the timeline are dense; the guide steps out of
  // the way instead of covering diagrams or text.
  return ['ai-lab', 'projects', 'experience'].includes(sectionState);
}

function applyTuck() {
  if (!layer) return;
  if (sectionState === 'contact' || isAtEnd) {
    layer.classList.remove('is-tucked');
    return;
  }
  layer.classList.toggle('is-tucked', sectionTucked() || collisionTucked);
}

function loadAction(name) {
  if (images[name]) return Promise.resolve(images[name]);
  const action = ACTIONS[name];
  if (!action) return Promise.resolve(null);
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      images[name] = image;
      resolve(image);
    };
    image.onerror = () => resolve(null);
    image.src = action.src;
  });
}

function preloadRest() {
  // Preload all action strips so switching between sections is instantaneous
  Object.keys(ACTIONS).forEach((name) => {
    if (!images[name]) loadAction(name);
  });
}

function applyAction(name, { restart = true } = {}) {
  requestedAction = name;
  const action = ACTIONS[name] || ACTIONS.idle;
  const image = images[name];
  if (!image) {
    loadAction(name).then((loaded) => {
      if (loaded && requestedAction === name) applyAction(name, { restart });
    });
    return;
  }
  if (restart || currentAction !== name) {
    currentAction = name;
    currentFrame = 0;
    frameClock = 0;
    finishing = false;
    window.clearTimeout(finishTimer);
  }
  oneShot = !action.loop;
  const scale = viewportScale();
  const displayWidth = Math.round(FRAME_W * scale);
  const displayHeight = Math.round(FRAME_H * scale);
  button.style.setProperty('--companion-w', `${displayWidth}px`);
  button.style.setProperty('--companion-h', `${displayHeight}px`);
  button.style.left = `${Math.round(window.innerWidth - displayWidth - rightInset())}px`;
  button.style.bottom = `${bottomInset()}px`;
  sprite.style.backgroundImage = `url("${action.src}")`;
  sprite.style.backgroundSize = `${action.frames * displayWidth}px ${displayHeight}px`;
  sprite.style.transform = 'translateZ(0)';
  paintFrame();
  updateBubblePosition();
}

function paintFrame() {
  const action = ACTIONS[currentAction];
  if (!action || !images[currentAction]) return;
  const scale = viewportScale();
  const displayWidth = Math.round(FRAME_W * scale);
  const x = -(currentFrame * displayWidth);
  sprite.style.backgroundPosition = `${x}px 0`;
}

function playOneShot(name) {
  const action = ACTIONS[name];
  if (!action || action.loop) {
    applyAction(name);
    return;
  }
  applyAction(name);
}

function returnToBase() {
  if (finishing) return;
  finishing = true;
  const hold = ACTIONS[currentAction]?.hold ?? 240;
  finishTimer = window.setTimeout(() => {
    finishing = false;
    const next = sleeping ? 'sleep' : baseAction;
    applyAction(next);
  }, hold);
}

function setBubbleContent(html, { farewell = false, showChips = true } = {}) {
  ensureBubble();
  const atEnd = farewell || isAtEnd || sectionState === 'contact';
  bubble.classList.toggle('farewell', atEnd);
  bubble.classList.toggle('is-end-bubble', atEnd);

  if (atEnd) {
    bubble.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 2px;">Do you recognize me?</div>
      <div style="font-size: 11px; opacity: 0.9;">If not, click me to watch! ↗</div>
    `;
    return;
  }

  const chipsHtml = (showChips && !isCompact()) ? `
    <div class="companion-chips">
      <button type="button" class="comp-chip-btn" data-act="punch" title="Boxing Jabs">🥊 Punch</button>
      <button type="button" class="comp-chip-btn" data-act="flip" title="Backflip">🤸 Flip</button>
      <button type="button" class="comp-chip-btn" data-act="combo" title="Spin Combo">⚡ Combo</button>
      <button type="button" class="comp-chip-btn" data-act="cheer" title="Victory Cheer">🎉 Cheer</button>
    </div>
  ` : '';

  bubble.innerHTML = `<div class="bubble-msg">${html}</div>${chipsHtml}`;

  bubble.querySelectorAll('.comp-chip-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      wake();
      const act = btn.dataset.act;
      if (act && ACTIONS[act]) {
        playOneShot(act);
        spawnPopBadge(act);
        const msgs = {
          punch: 'Pow! 🥊 Quick right jab.',
          flip: 'Whoa! 🤸 Agile backflip.',
          combo: 'Flurry combo! ⚡ Unstoppable.',
          cheer: 'Victory cheer! 🎉 High five.'
        };
        const msgEl = bubble.querySelector('.bubble-msg');
        if (msgEl) msgEl.textContent = msgs[act] || act;
      }
    });
  });

  const memeButton = bubble.querySelector('#meme-btn');
  if (memeButton) memeButton.addEventListener('click', finishJourney);
}

function hideBubble() {
  window.clearTimeout(bubbleTimer);
  bubble?.classList.remove('visible');
}

function showBubble(html, { farewell = false, autoHide = 0, showChips = true } = {}) {
  setBubbleContent(html, { farewell, showChips });
  bubble.classList.add('visible');
  updateBubblePosition();
  window.clearTimeout(bubbleTimer);
  const delay = autoHide || 5200;
  if (delay) bubbleTimer = window.setTimeout(hideBubble, delay);
}

function updateBubblePosition() {
  if (!bubble || !button || !ready) return;
  const rect = companionBox();
  if (!rect.width || !rect.height) return;
  const bubbleWidth = bubble.offsetWidth || 230;
  const bubbleHeight = bubble.offsetHeight || 50;
  const vw = window.innerWidth;
  // Center bubble directly above the companion sprite
  let left = rect.left + (rect.width / 2) - (bubbleWidth / 2);
  left = Math.min(vw - bubbleWidth - 12, Math.max(12, left));
  const top = Math.max(76, rect.top - bubbleHeight - 14);
  bubble.dataset.side = 'center';
  bubble.style.left = `${Math.round(left)}px`;
  bubble.style.top = `${Math.round(top)}px`;
}

function wake() {
  lastInteraction = Date.now();
  if (!sleeping) return;
  sleeping = false;
  if (!reducedMotion) {
    playOneShot('flip');
    spawnPopBadge('flip');
    showBubble("Back on my feet! What's next? 🥊", { autoHide: 3500, showChips: true });
  } else {
    applyAction(baseAction);
  }
}

function handleCompanionClick(event) {
  event.preventDefault();
  wake();
  if (isAtEnd || sectionState === 'contact') {
    window.open(END_VIDEO_URL, '_blank', 'noopener,noreferrer');
    if (!reducedMotion) playOneShot('cheer');
    return;
  }
  if (reducedMotion) {
    showBubble('Motion is reduced on this device, but hello anyway!');
    return;
  }
  const reaction = REACTIONS[reactionIndex % REACTIONS.length];
  reactionIndex += 1;
  showBubble(reaction.text, { showChips: true });
  playOneShot(reaction.anim);
  spawnPopBadge(reaction.anim);
}

function chooseSectionAction() {
  const actionName = SECTION_ACTION[sectionState] || 'idle';
  const action = ACTIONS[actionName];
  if (!action) return { base: 'idle', one: null };
  return action.loop
    ? { base: actionName, one: null }
    : { base: 'idle', one: actionName };
}

export function initCompanion(onReady) {
  ensureLayer();
  ensureBubble();
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  lastInteraction = Date.now();
  loadAction('idle').then(() => {
    ready = true;
    baseAction = 'idle';
    applyAction('idle');
    showBubble(bubbleText);
    button.classList.add('visible');
    if (typeof onReady === 'function') onReady();
    preloadRest();
  });
  lastTick = 0;
  rafId = requestAnimationFrame(tick);
  window.setInterval(() => {
    if (sleeping || oneShot || reducedMotion || document.hidden) return;
    if (Date.now() - lastInteraction < IDLE_SLEEP_MS) return;
    sleeping = true;
    applyAction('sleep');
    if (!isCompact()) showBubble('Zzz&hellip; click me when you need a hand.');
  }, 4000);
}

export function updateCompanion() {
  // Frame timing lives in tick(); exported for parity with the old module.
}

function tick(now) {
  rafId = requestAnimationFrame(tick);
  if (!ready || document.hidden) {
    lastTick = 0;
    return;
  }
  if (!lastTick) {
    lastTick = now;
    return;
  }
  if (now - lastCollisionCheck > COLLISION_POLL_MS) evaluateCollision(now);
  updatePosition();
  const delta = Math.min(0.05, (now - lastTick) / 1000);
  lastTick = now;
  const action = ACTIONS[currentAction];
  if (!action) return;
  if (reducedMotion && action.loop) return;
  frameClock += delta;
  const frameDuration = 1 / action.fps;
  if (frameClock < frameDuration) return;
  const steps = Math.floor(frameClock / frameDuration);
  frameClock -= steps * frameDuration;
  const nextFrame = currentFrame + steps;
  if (action.loop) {
    currentFrame = nextFrame % action.frames;
  } else if (nextFrame >= action.frames - 1) {
    currentFrame = action.frames - 1;
    paintFrame();
    returnToBase();
    return;
  } else {
    currentFrame = nextFrame;
  }
  paintFrame();
}

let scrollSettleTimer = 0;

export function notifyScroll(speed = 0) {
  wake();
  updatePosition();

  const scroller = document.getElementById('smooth-wrapper') || document.documentElement;
  const isNearEnd = (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 60);
  if (isNearEnd && !isAtEnd) {
    isAtEnd = true;
    showBubble('Do you recognize me? If not, click me!', { farewell: true, autoHide: 0 });
    if (!reducedMotion) playOneShot('cheer');
  } else if (!isNearEnd && isAtEnd && sectionState !== 'contact') {
    isAtEnd = false;
    hideBubble();
  }

  if (oneShot || reducedMotion || !ready) return;
  const targetMotion = speed > 22 ? 'run' : 'walk';
  if (currentAction !== targetMotion) {
    applyAction(targetMotion);
  }
  window.clearTimeout(scrollSettleTimer);
  scrollSettleTimer = window.setTimeout(() => {
    if (!oneShot && !sleeping && ready) {
      applyAction('idle');
    }
  }, 180);
}

export function setSectionState(stateName) {
  if (sectionState === stateName) return;
  sectionState = stateName;
  if (!ready) return;

  if (stateName === 'contact') {
    isAtEnd = true;
    showBubble('Do you recognize me? If not, click me!', { farewell: true, autoHide: 0 });
    if (!reducedMotion) playOneShot('cheer');
  } else {
    isAtEnd = false;
    const action = SECTION_ACTION[stateName];
    const prompt = SECTION_PROMPTS[stateName];
    if (action && action !== 'idle' && !reducedMotion && !oneShot) {
      playOneShot(action);
      spawnPopBadge(action);
    }
    if (prompt && !isCompact() && !sectionTucked()) {
      showBubble(prompt, { autoHide: 4500, showChips: true });
    } else {
      hideBubble();
    }
  }

  applyTuck();
  updatePosition();
}

export function playState(stateName, config = {}) {
  sectionState = stateName;
  const farewell = stateName === 'contact';
  if (farewell) {
    isAtEnd = true;
    bubbleText = 'Do you recognize me? If not, click me!';
  } else if (config.text) {
    isAtEnd = false;
    bubbleText = config.text;
  }
  baseAction = 'idle';
  sleeping = false;
  lastInteraction = Date.now();
  window.clearTimeout(scrollSettleTimer);
  if (!ready) return;
  setBubbleContent(bubbleText, { farewell });
  applyTuck();
  updatePosition();
  if ((sectionTucked() || collisionTucked || isCompact()) && !farewell) {
    hideBubble();
  } else {
    bubble.classList.add('visible');
    updateBubblePosition();
  }
  if (!oneShot) applyAction('idle');
}

export function triggerAboutSpotlight() {
  const facts = [
    '5+ years turning business problems into working systems.',
    'He connects LLMs, APIs and databases — not just pretty screens.',
    'Custom WordPress work, without fragile page-builder dependency.',
    'Performance, scalability and clean architecture come first.',
    'Currently completing his degree while shipping real projects.',
  ];
  const paragraphs = [...document.querySelectorAll('#about-content p')];
  if (!paragraphs.length) return 0;
  const index = aboutFactIndex % Math.min(facts.length, paragraphs.length);
  paragraphs.forEach((paragraph, paragraphIndex) => paragraph.classList.toggle('about-spotlight', paragraphIndex === index));
  showBubble(facts[index]);
  wake();
  if (!reducedMotion) playOneShot('cheer');
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(paragraphs[index], { x: -12 }, { x: 0, duration: 0.55, ease: 'back.out(2)' });
  }
  aboutFactIndex = (index + 1) % paragraphs.length;
  return index;
}

function finishJourney() {
  showBubble('Thanks for taking the full tour! <span class="bubble-symbol">&#9733;</span>');
  wake();
  if (!reducedMotion) playOneShot('cheer');
  window.setTimeout(() => {
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = './profile.html'; }, 380);
  }, 700);
}
