/**
 * Hero centrepiece — one Three.js scene, nothing else.
 *
 * A slow wireframe sphere with a particle shell that leans toward the pointer.
 * Deliberately constrained: single canvas, capped pixel ratio, paused whenever
 * the hero leaves the viewport, and fully static under reduced-motion.
 * If WebGL is unavailable the canvas is removed and CSS washes take over.
 */

import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
const hero = document.getElementById('hero');

if (canvas && hero) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const boot = () => {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'low-power'
      });
    } catch (_) {
      hero.classList.add('no-webgl');
      canvas.remove();
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const group = new THREE.Group();
    scene.add(group);

    // Wireframe shell
    const shellGeometry = new THREE.IcosahedronGeometry(1.85, 2);
    const shellEdges = new THREE.EdgesGeometry(shellGeometry, 12);
    const shell = new THREE.LineSegments(
      shellEdges,
      new THREE.LineBasicMaterial({
        color: 0x2f4bff,
        transparent: true,
        opacity: 0.34
      })
    );
    group.add(shell);

    // Inner core
    const core = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1), 8),
      new THREE.LineBasicMaterial({ color: 0x2f4bff, transparent: true, opacity: 0.22 })
    );
    group.add(core);

    // Particle shell
    const count = window.innerWidth < 768 ? 420 : 900;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.05 + Math.random() * 1.25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      seeds[i] = Math.random();
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x2f4bff,
        size: 0.026,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        depthWrite: false
      })
    );
    group.add(particles);

    // Fine ring for depth
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 128 }, (_, i) => {
          const angle = (i / 128) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(angle) * 2.9, Math.sin(angle) * 0.28, Math.sin(angle) * 2.9);
        })
      ),
      new THREE.LineBasicMaterial({ color: 0x2f4bff, transparent: true, opacity: 0.16 })
    );
    group.add(ring);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let sectionShift = 0;
    let sectionTarget = 0;
    let baseY = 0;

    const resize = () => {
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();

      // Desktop: sit the sphere in the right half, clear of the copy.
      // Tablet: centre it behind the text, slightly low.
      // Phone: shrink it and drop it behind the stats so body copy stays clean.
      const isDesktop = width > 980;
      const isPhone = width <= 640;
      group.position.x = isDesktop ? 1.0 : 0;
      baseY = isDesktop ? 0 : isPhone ? -1.7 : -1.1;
      group.position.y = baseY;
      group.scale.setScalar(isDesktop ? 0.74 : isPhone ? 0.52 : 0.66);
      shell.material.opacity = isPhone ? 0.2 : 0.34;
      core.material.opacity = isPhone ? 0.13 : 0.22;
      particles.material.opacity = isPhone ? 0.38 : 0.6;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.6;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.6;
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      target.x = 0;
      target.y = 0;
    }, { passive: true });

    let visible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { visible = entry.isIntersecting; });
    }, { threshold: 0.02 });
    observer.observe(hero);

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;

    const renderFrame = (now) => {
      raf = requestAnimationFrame(renderFrame);
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      if (reduceMotion.matches) return;

      elapsed += delta;
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      sectionShift += (sectionTarget - sectionShift) * 0.06;

      group.rotation.y = elapsed * 0.09 + pointer.x * 0.55;
      group.rotation.x = -0.18 + pointer.y * 0.35;
      core.rotation.y = -elapsed * 0.16;
      core.rotation.z = elapsed * 0.08;
      ring.rotation.y = -elapsed * 0.05;
      particles.rotation.y = elapsed * 0.045;
      ring.rotation.x = 0.32 + Math.sin(elapsed * 0.25) * 0.06;

      const scatter = Math.min(1, Math.max(0, sectionShift));
      group.position.z = -scatter * 3.2;
      group.position.y += (baseY - group.position.y) * 0.02;
      shell.scale.setScalar(1 + scatter * 0.28);
      particles.scale.setScalar(1 + scatter * 0.55);

      renderer.render(scene, camera);
    };

    if (reduceMotion.matches) {
      group.rotation.set(-0.15, 0.4, 0);
      renderer.render(scene, camera);
      reduceMotion.addEventListener('change', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(renderFrame);
      }, { once: true });
    } else {
      raf = requestAnimationFrame(renderFrame);
    }

    const onVisibility = () => {
      last = performance.now();
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      shellGeometry.dispose();
      shellEdges.dispose();
      shell.material.dispose();
      ring.geometry.dispose();
      ring.material.dispose();
      particleGeometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    }, { once: true });

    // Exposed so the section tracker can push the scene back as you scroll.
    window.__heroScene = {
      setSection(index) {
        sectionTarget = index === 0 ? 0 : Math.min(1, (index + 1) * 0.16);
      }
    };
  };

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
}
