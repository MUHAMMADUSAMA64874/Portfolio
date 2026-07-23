import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer;
let robot = null;
let mixer = null;
let actions = {};
let activeAction;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let currentGlobalState = 'idle';
let isDancing = false;
let isCleaning = false;
let isMemeRunning = false;
let danceTime = 0;
let moveSpeed = 2; // Base movement speed
let travelMode = 'idle';
let travelUntil = 0;
let travelStartY = -2.5;
let travelToken = 0;
let aboutFactIndex = 0;

// Dynamic positions
let baseX = 4.5;
let baseY = -2.5;
let baseZ = 0;

let targetX = 4.5;
let targetY = -2.5;
let targetZ = 0;
let targetRotY = null; // For forcing rotations

// Speech bubble
const bubble = document.createElement('div');
bubble.id = 'robot-bubble';
document.body.appendChild(bubble);
let bubbleText = "Hi! I'm your guide. Click me!";

export function initCharacter(container, onReady) {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
  camera.position.set(0, 0, 15);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Cap GPU work on high-DPI screens; the transparent full-screen canvas is
  // otherwise one of the largest costs while scrolling.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(5, 10, 10);
  scene.add(dirLight);

  calculateBasePosition();
  targetX = baseX;

  const loader = new GLTFLoader();
  loader.load('./assets/models/RobotExpressive.glb', function(gltf) {
    const model = gltf.scene;
    
    // A section can become active before the GLB finishes loading. Honour that
    // pending state instead of flashing the large default robot over the work.
    model.position.set(targetX, targetY, targetZ);
    const initialScale = currentGlobalState === 'projects' ? 0.46 : 1.2;
    model.scale.set(initialScale, initialScale, initialScale);
    
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    const animations = gltf.animations;

    animations.forEach(clip => {
      actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
    });

    activeAction = actions[getDefaultAnimForState()] || actions['idle'];
    if (activeAction) activeAction.play();

    const headBone = model.getObjectByName('Head');

    robot = {
      model: model,
      head: headBone
    };

    // Force matrix update to fix initial bubble jump glitch
    scene.updateMatrixWorld(true);
    robot.model.updateMatrixWorld(true);
    
    // Smoothly fade in canvas container to avoid shader compilation glitch flashes
    document.getElementById('canvas-container').style.opacity = '1';

    updateBubblePosition();
    setBubbleContent(bubbleText);
    bubble.classList.add('visible');

    if (onReady) onReady();
  }, undefined, function(e) {
    if (onReady) onReady();
  });

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onClick, false);
  
  window.addEventListener('touchstart', (e) => {
    if(e.touches.length > 0) {
      mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      onClick(e);
    }
  }, {passive: true});
}

function calculateBasePosition() {
  if (camera) {
    const vFov = (camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * camera.position.z;
    const width = height * camera.aspect;
    
    // Map exactly to CSS pixels
    const pixelsPerUnit = window.innerWidth / width;
    
    if (window.innerWidth >= 1024) {
      // Desktop: Place robot exactly in the center of the 450px right padding
      const containerWidth = Math.min(1200, window.innerWidth);
      const paddingCenterPx = (containerWidth / 2) - 300; // leave a clear lane for the face-side bubble
      baseX = paddingCenterPx / pixelsPerUnit;
      baseY = -2.5;
    } else {
      // Mobile: Place robot at bottom center
      baseX = 0;
      baseY = -3.5;
    }
  } else {
    baseX = 4.5;
    baseY = -2.5;
  }
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(event) {
  if (!robot || isDancing || isMemeRunning || isCleaning) return;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(robot.model, true);
  
  if (intersects.length > 0) {
    handleRobotClick();
  } else {
    // Wave if clicked elsewhere, unless we are in a special state
    if (currentGlobalState !== 'skills' && currentGlobalState !== 'contact') {
      switchAnim('wave');
      playSound('wave');
      setBubbleContent("Beep boop!");
      bubble.classList.add('visible');
      
      setTimeout(() => {
        if (!isDancing && !isMemeRunning) switchAnim(getDefaultAnimForState());
        setBubbleContent(bubbleText);
      }, 2000);
    }
  }
}

function handleRobotClick() {
  if (currentGlobalState === 'skills') {
    // 1. Capabilities Section: Realistic Clean Up Sequence
    isCleaning = true;
    targetX = 0; // Walk to center of cards
    targetRotY = null;
    setBubbleContent("Initiating Sweep Routine... 🧹✨");
    switchAnim('walking');

    const checkArrival = setInterval(() => {
      if (Math.abs(robot.model.position.x) < 0.5) {
        clearInterval(checkArrival);
        targetRotY = 0; // Face forward
        
        switchAnim('punch'); 
        if (!actions['punch']) switchAnim('wave');
        playSound('clean');
        setBubbleContent("Dusting & Organizing! ✨");
        
        if (typeof gsap !== 'undefined') {
          // Realistic Dust-wipe Disintegration Effect
          gsap.to('.bento-card', {
            scale: 0.85,
            y: -30,
            opacity: 0,
            filter: 'blur(12px)',
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.inOut',
            onComplete: () => {
              // Show the always-present restore button in the title row
              const restoreCapsBtn = document.getElementById('restore-caps-btn');
              if (restoreCapsBtn) {
                restoreCapsBtn.style.display = 'inline-flex';
                restoreCapsBtn.onclick = () => {
                  restoreCapsBtn.style.display = 'none';
                  gsap.to('.bento-card', { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.05 });
                };
              }
            }
          });
        }
        
        // Celebration move
        setTimeout(() => {
          switchAnim('jump');
          if (!actions['jump']) switchAnim('thumbsup');
          playSound('dance');
          setBubbleContent("All pristine & tidy! 👍");
          
          setTimeout(() => {
            calculateBasePosition();
            targetX = baseX;
            targetRotY = 0;
            switchAnim('walking');
            isCleaning = false;
          }, 1200);
        }, 800);
      }
    }, 100);
  } else if (currentGlobalState === 'about') {
    triggerAboutSpotlight();
  } else if (currentGlobalState === 'contact') {
    memeRun();
  } else {
    startDance();
  }
}

export function triggerAboutSpotlight() {
  const facts = [
    '5+ years turning business problems into working systems.',
    'He connects LLMs, APIs and databases — not just pretty screens.',
    'Custom WordPress work, without fragile page-builder dependency.',
    'Performance, scalability and clean architecture come first.',
    'Currently completing his degree while shipping real projects.'
  ];
  const paragraphs = [...document.querySelectorAll('#about-content p')];
  if (!paragraphs.length) return 0;
  const index = aboutFactIndex % Math.min(facts.length, paragraphs.length);
  paragraphs.forEach((paragraph, paragraphIndex) => paragraph.classList.toggle('about-spotlight', paragraphIndex === index));
  setBubbleContent(facts[index]);
  bubble.classList.add('visible');
  switchAnim(index % 2 ? 'yes' : 'thumbsup');
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(paragraphs[index], { x: -12 }, { x: 0, duration: .55, ease: 'back.out(2)' });
  }
  aboutFactIndex = (index + 1) % paragraphs.length;
  return index;
}

export function memeRun() {
  if (isMemeRunning) return;
  isMemeRunning = true;
  bubble.classList.remove('farewell');
  setBubbleContent("Until we meet again! 🏃💨");
  
  playSound('run'); // Soft whoosh sound
  switchAnim('running');
  
  targetX = 35; // Far off screen
  targetRotY = -Math.PI / 2; // Face right
  moveSpeed = 8; // Sprint!
  
  // Wait for it to run out of screen
  setTimeout(() => {
    // Looney Tunes Wipe!
    const wipe = document.createElement('div');
    wipe.style.cssText = `
      position: fixed; top: 50%; left: 50%;
      width: 250vw; height: 250vw;
      border-radius: 50%;
      box-shadow: 0 0 0 200vw black;
      transform: translate(-50%, -50%);
      z-index: 9999; pointer-events: none;
      transition: width 1.5s cubic-bezier(0.1, 0, 0.2, 1), height 1.5s cubic-bezier(0.1, 0, 0.2, 1);
    `;
    document.body.appendChild(wipe);

    const qText = document.createElement('h1');
    qText.innerHTML = "THAT'S ALL, FOLKS!<br><span style='font-size:.28em;letter-spacing:.12em;font-weight:400'>Opening the complete profile...</span>";
    qText.style.cssText = `
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: white; font-family: var(--font-mono, monospace); font-size: 60px;
      z-index: 10000; opacity: 0; text-align: center;
      transition: opacity 0.5s; pointer-events: none;
    `;
    document.body.appendChild(qText);

    // Trigger shrinking circle animation
    setTimeout(() => {
      wipe.style.width = '0vw';
      wipe.style.height = '0vw';
    }, 50);

    // Fade in text as it closes
    setTimeout(() => {
      qText.style.opacity = '1';
    }, 1200);

    // Reload site after a pause
    setTimeout(() => {
      window.location.href = './profile.html';
    }, 4000); 
  }, 1000); 
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'dance') {
      // Pleasant Major Chord (A4, C#5, E5) instead of harsh sawtooth!
      const freqs = [440.00, 554.37, 659.25];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1 + (i*0.05));
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.6);
      });
    } else if (type === 'run') {
      // Soft sine wave whoosh for meme run
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } else if (type === 'clean') {
      // Cartoony double "Zip!" sweep instead of harsh white noise
      const playZip = (startFreq, endFreq, startTime, duration, vol) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      };

      // Play two rapid ascending sweeps (Zip-Zap!)
      playZip(150, 1200, ctx.currentTime, 0.3, 0.3);
      playZip(300, 2000, ctx.currentTime + 0.1, 0.2, 0.2);

    } else if (type === 'wave') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch(e) { }
}

function switchAnim(animName) {
  if (!actions[animName]) return;
  const nextAction = actions[animName];
  if (nextAction !== activeAction) {
    nextAction.reset().fadeIn(0.3).play();
    if (activeAction) activeAction.fadeOut(0.3);
    activeAction = nextAction;
  }
}

function startDance() {
  isDancing = true;
  danceTime = 0;
  
  const moves = [
    { anim: 'dance', text: "Let me show you a move! 🕺", sound: 'dance' },
    { anim: 'jump', text: "Woohoo! 🚀", sound: 'clean' },
    { anim: 'thumbsup', text: "Awesome! 👍", sound: 'wave' },
    { anim: 'yes', text: "Yes yes yes! 🎉", sound: 'dance' },
    { anim: 'wave', text: "Hi there! 👋", sound: 'wave' }
  ];
  
  const chosen = moves[Math.floor(Math.random() * moves.length)];
  playSound(chosen.sound);
  switchAnim(chosen.anim);
  setBubbleContent(chosen.text);
}

function setBubbleContent(htmlOrText) {
  bubble.innerHTML = htmlOrText;
  const memeBtn = bubble.querySelector('#meme-btn');
  if (memeBtn) {
    memeBtn.onclick = (e) => {
      e.stopPropagation();
      memeRun();
    };
  }
}

export function playState(stateName, config = {}) {
  const token = ++travelToken;
  currentGlobalState = stateName;
  if (config.text) bubbleText = config.text;

  if (isCleaning || isMemeRunning) return; // Lock position updates during sequences
  
  if (config.y !== undefined) targetY = config.y;
  
  calculateBasePosition();
  targetRotY = 0; // Default face forward

  // Restore robot to full size if leaving the projects section
  if (stateName !== 'projects' && robot && typeof gsap !== 'undefined') {
    gsap.to(robot.model.scale, {
      x: 1.2, y: 1.2, z: 1.2,
      duration: 0.5,
      ease: 'back.out(1.5)'
    });
  }
  
  if (config.pos === 'right') {
    targetX = baseX;
  } else if (config.pos === 'left') {
    targetX = -baseX;
    targetRotY = 0.5; // slightly face center
  } else if (config.pos === 'hide-right') {
    targetX = baseX + 2.5; // push off screen to peek
    targetRotY = -0.3; // peek angle
  } else if (config.x !== undefined) {
    targetX = config.x; // fallback
  }

  // Custom Content overrides
  if (stateName === 'contact') {
     bubble.style.pointerEvents = 'auto'; // allow click on button
     bubble.classList.add('farewell');
  } else {
     bubble.style.pointerEvents = 'none';
     bubble.classList.remove('farewell');
  }
  
  setBubbleContent(bubbleText);
  bubble.classList.add('visible');

  // Keep the requested section/position as pending state while the GLB loads.
  // initCharacter will apply it and the ready callback will start its animation.
  if (!robot) return;

  if (isDancing || isMemeRunning) return;

  moveSpeed = 2;
  if (config.direction === 'up') {
    travelMode = 'flying';
    travelUntil = performance.now() + 2600;
    travelStartY = targetY;
    switchAnim(actions['jump'] ? 'jump' : 'walking');
    robot.model.rotation.x = -0.34;
    robot.model.position.y = targetY - 1;
    setBubbleContent(`Up, up and away! <span class="bubble-symbol">↑</span>`);
    setTimeout(() => {
      if (token !== travelToken || travelMode !== 'flying') return;
      travelMode = 'idle';
      setBubbleContent(bubbleText);
      switchAnim(getDefaultAnimForState());
    }, 2600);
  } else if (stateName === 'contact') {
    travelMode = 'idle';
    targetX = baseX;
    targetY = config.y ?? baseY;
    targetRotY = 0;
    switchAnim('wave');
    setBubbleContent(bubbleText);
  } else {
    travelMode = 'walking';
    travelUntil = performance.now() + 1100;
    switchAnim('walking');
    robot.model.rotation.x = 0.08;
  }

  // Keep upward travel visible long enough; section-specific poses resume afterwards.
  if (config.direction === 'up') return;
  
  // Custom Enter Animations
  if (stateName === 'ai') {
    // 2. AI Section Inspector
    setTimeout(() => {
      if (currentGlobalState === 'ai') switchAnim('yes');
    }, 1000);
  } else if (stateName === 'projects') {
    // Transformer-style: robot compacts/transforms to a small size to fit section
    setTimeout(() => {
      if (currentGlobalState !== 'projects' || !robot) return;
      setBubbleContent("Transforming... 🤖⚡");
      switchAnim('yes'); // head bob while transforming

      // Step 1: Robot crouches / scale down rapidly (Transformer fold)
      if (typeof gsap !== 'undefined') {
        gsap.to(robot.model.scale, {
          x: 0.4, y: 0.4, z: 0.4,
          duration: 0.35,
          ease: 'back.in(3)',
          onComplete: () => {
            if (currentGlobalState !== 'projects') return;

            // 🌟 Doraemon Small Light Effect at robot screen position
            const vec = new THREE.Vector3();
            vec.setFromMatrixPosition(robot.model.matrixWorld);
            vec.project(camera);
            const sx = (vec.x * 0.5 + 0.5) * window.innerWidth;
            const sy = (vec.y * -0.5 + 0.5) * window.innerHeight;
            doraemonLightEffect(sx, sy);

            // Step 2: Spring back to compact size with bounce
            gsap.to(robot.model.scale, {
              x: 0.46, y: 0.46, z: 0.46,
              duration: 0.5,
              ease: 'elastic.out(1, 0.4)',
              onComplete: () => {
                if (currentGlobalState !== 'projects') return;
                setBubbleContent("Scroll to explore the filtered gallery.");
                switchAnim('thumbsup');
              }
            });
          }
        });
      }
    }, 500);
  } else if (stateName === 'experience') {
    // Experience needs to walk smoothly
    switchAnim('walking');
  }
}

function getDefaultAnimForState() {
  if (currentGlobalState === 'hero') return 'wave';
  if (currentGlobalState === 'about') return 'thumbsup';
  if (currentGlobalState === 'ai') return 'yes';
  if (currentGlobalState === 'projects') return 'jump';
  if (currentGlobalState === 'experience') return 'walking';
  if (currentGlobalState === 'contact') return 'wave';
  return 'idle';
}

// --- Doraemon "Small Light" particle effect ---
function doraemonLightEffect(x, y) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);

  // Central glowing orb
  const orb = document.createElement('div');
  orb.style.cssText = `
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #FFFFFF 0%, #FFD700 40%, #FF6B35 70%, transparent 100%);
    transform: translate(-50%, -50%) scale(0);
    box-shadow: 0 0 30px 10px rgba(255,215,0,0.8), 0 0 60px 20px rgba(255,107,53,0.4);
    animation: doraemonOrb 0.8s ease-out forwards;
  `;
  container.appendChild(orb);

  // Sparkle particles
  const colors = ['#FFD700', '#FF6B35', '#FFF', '#FFB347', '#FFFACD'];
  for (let i = 0; i < 14; i++) {
    const spark = document.createElement('div');
    const angle = (i / 14) * 360;
    const dist = 40 + Math.random() * 60;
    const size = 3 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 0.15;
    spark.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      transform: translate(-50%, -50%) translate(0px, 0px) scale(1);
      box-shadow: 0 0 6px 2px ${color};
      animation: spark${i} 0.7s ${delay}s ease-out forwards;
    `;
    // Create individual keyframe via stylesheet
    if (!document.getElementById(`spark-style-${i}`)) {
      const style = document.createElement('style');
      style.id = `spark-style-${i}`;
      const rad = angle * Math.PI / 180;
      const tx = Math.cos(rad) * dist;
      const ty = Math.sin(rad) * dist;
      style.textContent = `
        @keyframes spark${i} {
          0%   { transform: translate(-50%,-50%) translate(0,0) scale(1); opacity:1; }
          100% { transform: translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }
    container.appendChild(spark);
  }

  // Inject keyframe for orb once
  if (!document.getElementById('doraemon-orb-style')) {
    const s = document.createElement('style');
    s.id = 'doraemon-orb-style';
    s.textContent = `
      @keyframes doraemonOrb {
        0%   { transform: translate(-50%,-50%) scale(0); opacity:1; }
        50%  { transform: translate(-50%,-50%) scale(1.8); opacity:1; }
        100% { transform: translate(-50%,-50%) scale(0); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }

  setTimeout(() => container.remove(), 900);
}

function updateBubblePosition() {
  if (!robot || !camera) return;
  const vector = new THREE.Vector3();
  
  // Get the head bone position if available, otherwise use model root + offset
  if (robot.head) {
    vector.setFromMatrixPosition(robot.head.matrixWorld);
    vector.y += 0.2; // Align with center of face
  } else {
    vector.setFromMatrixPosition(robot.model.matrixWorld);
    vector.y += 1.2; // ~face height offset above root
  }
  
  vector.project(camera);

  // Convert NDC coords to screen pixels (viewport coordinates)
  const anchorX = (vector.x *  0.5 + 0.5) * window.innerWidth;
  const anchorY = (vector.y * -0.5 + 0.5) * window.innerHeight;
  const bubbleWidth = Math.min(bubble.offsetWidth || 230, window.innerWidth - 24);
  const bubbleHeight = bubble.offsetHeight || 54;
  // In Work, bring the compact robot under the comic tail while keeping the
  // bubble itself in the same visual lane.
  const faceClearance = window.innerWidth < 769
    ? 62
    : (currentGlobalState === 'projects' ? 36 : 108);
  let x = anchorX + faceClearance;
  let side = 'right';
  if (x + bubbleWidth > window.innerWidth - 14) {
    x = anchorX - faceClearance - bubbleWidth;
    side = 'left';
  }
  x = Math.min(window.innerWidth - bubbleWidth - 12, Math.max(12, x));
  const y = Math.min(window.innerHeight - bubbleHeight - 16, Math.max(16, anchorY - bubbleHeight - 58));

  bubble.style.left = `${x}px`;
  bubble.style.top  = `${y}px`;
  bubble.dataset.side = side;
}

export function updateCharacter(delta) {
  if (mixer) mixer.update(delta);
  
  if (robot) {
    const now = performance.now();
    if (travelMode === 'flying' && now < travelUntil) {
      const phase = (travelUntil - now) / 1000;
      targetY = travelStartY + Math.sin(phase * 8) * .2;
      robot.model.rotation.z = Math.sin(phase * 7) * .07;
    } else if (travelMode === 'running' && now < travelUntil) {
      robot.model.position.y = travelStartY + Math.abs(Math.sin(now * .016)) * .08;
      robot.model.rotation.z = Math.sin(now * .02) * .025;
    } else {
      robot.model.rotation.z += (0 - robot.model.rotation.z) * 6 * delta;
    }
    if (isDancing) {
      danceTime += delta;
      const danceDuration = 3.0;
      if (danceTime >= danceDuration) {
        isDancing = false;
        if (actions['walking']) actions['walking'].timeScale = 1; // Restore speed
        switchAnim(getDefaultAnimForState());
        setBubbleContent(bubbleText);
      }
      
      if (bubble.innerText.includes("Moonwalk")) {
        // Slide backward across screen
        robot.model.position.x -= 3 * delta;
        targetRotY = 0; // Face forward while sliding left
      } else {
        // Bob up and down to the music
        robot.model.position.y = targetY + Math.abs(Math.sin(danceTime * 5)) * 0.5;
      }
      updateBubblePosition();
    } else {
      // Smoothly interpolate position to target
      const distSq = (targetX - robot.model.position.x)**2 + (targetY - robot.model.position.y)**2;
      
      if (distSq > 0.01) {
        robot.model.position.x += (targetX - robot.model.position.x) * moveSpeed * delta;
        robot.model.position.y += (targetY - robot.model.position.y) * moveSpeed * delta;
      } else {
        // Reached destination
        robot.model.position.x = targetX;
        robot.model.position.y = targetY;
        
        // Switch to correct standing/sitting state if just walking and not forced
        if (!isMemeRunning && !isCleaning && travelMode !== 'running' && travelMode !== 'flying' && (activeAction === actions['walking'] || activeAction === actions['running'])) {
           if (currentGlobalState === 'experience') {
              // Stay walking in experience
           } else {
              switchAnim(getDefaultAnimForState());
           }
        }
      }
      
      // Smooth, tightly clamped head mouse tracking (no glitches)
      if (robot.head && !isMemeRunning && !isDancing && !isCleaning) {
        const targetRotX = Math.max(-0.25, Math.min(0.25, mouse.y * 0.3));
        const targetRotYMouse = Math.max(-0.4, Math.min(0.4, -mouse.x * 0.4));
        robot.head.rotation.x += (targetRotX - robot.head.rotation.x) * 0.05;
        robot.head.rotation.y += (targetRotYMouse - robot.head.rotation.y) * 0.05;
      }
      
      // Smooth body rotation to targetRotY
      if (robot.model && targetRotY !== undefined) {
         robot.model.rotation.y += (targetRotY - robot.model.rotation.y) * 5 * delta;
         robot.model.rotation.x += (0 - robot.model.rotation.x) * 5 * delta;
      }

      // Add float effect if idle
      if (!isMemeRunning) {
         if (currentGlobalState === 'idle') {
            robot.model.position.y = targetY + Math.sin(Date.now() * 0.002) * 0.1;
         }
      }
      
      updateBubblePosition();
    }
  }
}

export function renderScene() {
  if (renderer && scene && camera) {
    if (robot && !isDancing && !isMemeRunning) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(robot.model, true);
      if (intersects.length > 0) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    }
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    calculateBasePosition();
    
    // Default fallback update
    if (!isDancing && !isMemeRunning && !isCleaning && currentGlobalState !== 'skills' && currentGlobalState !== 'ai' && currentGlobalState !== 'projects') {
       targetX = baseX;
       targetRotY = 0;
    }
  }
}
