/* Small, dependency-free motion director. Every temporary effect is disposable. */
window.KatzenMotion = (() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const scenes = new Set();
  const effects = new Set();
  const timers = new Set();
  const colors = ['#c6b6df', '#d97343', '#a9ba8e', '#e9bc69', '#e3b5af'];
  function sparkleSvg(flower = false) {
    return `<svg xmlns="http://www.w3.org/2000/svg" ${flower ? 'data-flower="true"' : ''} viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${flower ? '<path d="M16 3v26M3 16h26M7 7l18 18M7 25 25 7"/>' : '<path d="m16 2 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/>'}</svg>`;
  }
  const layer = document.querySelector('#effects');
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  layer.append(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  let frame = 0;
  let lastTime = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let pointerFrame = 0;
  let catArtwork;
  let flightSequence = 0;
  let airborne = [];
  let catFrame = 0;
  let lastCatTime = 0;

  function later(callback, delay) {
    const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
    timers.add(timer);
    return timer;
  }

  function play(element, keyframes, options = {}, transient = false) {
    if (!element || reduced.matches) return null;
    const animation = element.animate(keyframes, { duration: 800, easing: ease, fill: 'both', ...options });
    const collection = transient ? effects : scenes;
    collection.add(animation);
    animation.finished.then(() => {
      collection.delete(animation);
      if (transient) element.remove();
      animation.cancel();
    }, () => {
      collection.delete(animation);
      if (transient) element.remove();
    });
    return animation;
  }

  function origin(element = document.querySelector('#cake')) {
    const bounds = element.getBoundingClientRect();
    return {
      x: Math.max(40, Math.min(innerWidth - 40, bounds.left + bounds.width / 2)),
      y: Math.max(120, Math.min(innerHeight * .76, bounds.top + bounds.height * .45))
    };
  }

  function splitHeading(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).filter(Boolean).forEach(word => {
        if (/^\s+$/.test(word)) fragment.append(document.createTextNode(word));
        else {
          const span = document.createElement('span');
          span.className = 'headline-word';
          span.textContent = word;
          fragment.append(span);
        }
      });
      node.replaceWith(fragment);
    });
  }

  function reveal(element, delay = 0, distance = 20, duration = 800) {
    return play(element, [
      { opacity: 0, transform: `translate3d(0,${distance}px,0)` },
      { opacity: 1, transform: 'translate3d(0,0,0)' }
    ], { delay, duration });
  }

  function revealCover() {
    document.querySelectorAll('#cover .headline-word').forEach((word, i) => {
      play(word, [
        { opacity: 0, transform: 'translate3d(0,28px,0) rotate(3deg)' },
        { opacity: 1, transform: 'translate3d(0,0,0) rotate(0)' }
      ], { delay: 100 + i * 55, duration: 950 });
    });
    reveal(document.querySelector('#cover .eyebrow'), 50, 8);
    reveal(document.querySelector('#cover .intro'), 300, 14);
    reveal(document.querySelector('.envelope-scene'), 280, 25, 1100);
    reveal(document.querySelector('#open-button'), 540, 15);
    reveal(document.querySelector('#cover .microcopy'), 650, 8);
    reveal(document.querySelector('.cover-bottom'), 700, 10);
  }

  function effectElement(className, point, size = 160) {
    const element = document.createElement('span');
    element.className = className;
    element.style.left = `${point.x - size / 2}px`;
    element.style.top = `${point.y - size / 2}px`;
    layer.append(element);
    return element;
  }

  function ring(point = origin()) {
    if (reduced.matches) return;
    const element = effectElement('celebration-ring', point);
    play(element, [
      { opacity: 0, transform: 'scale(.12)' },
      { opacity: .7, transform: 'scale(.7)', offset: .12 },
      { opacity: 0, transform: `scale(${innerWidth < 600 ? 3 : 5})` }
    ], { duration: 1400 }, true);
  }

  function glints(point, count = 12, hearts = false) {
    if (reduced.matches) return;
    for (let i = 0; i < count; i++) {
      const element = document.createElement('span');
      element.className = `effect-glint${hearts ? ' heart-reaction' : ''}`;
      if (hearts) element.textContent = i % 3 ? '♡' : '♥';
      else element.innerHTML = sparkleSvg(i % 3 === 0);
      element.style.color = colors[i % colors.length];
      const angle = (i / count) * Math.PI * 2;
      const length = 35 + Math.random() * (hearts ? 65 : 105);
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length - (hearts ? 55 : 20);
      layer.append(element);
      play(element, [
        { opacity: 0, transform: `translate3d(${point.x}px,${point.y}px,0) scale(.2) rotate(0)` },
        { opacity: 1, offset: .18, transform: `translate3d(${point.x + dx * .35}px,${point.y + dy * .35}px,0) scale(1)` },
        { opacity: 0, transform: `translate3d(${point.x + dx}px,${point.y + dy}px,0) scale(.4) rotate(${dx}deg)` }
      ], { duration: 900 + Math.random() * 500, delay: i * 15 }, true);
    }
  }

  function openEnvelope() {
    if (reduced.matches) return 0;
    play(document.querySelector('#cover'), [
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      { opacity: 0, transform: 'translate3d(0,-25px,0) scale(1.025)' }
    ], { delay: 1350, duration: 350 });
    const point = origin(document.querySelector('.seal'));
    later(() => glints(point, 12, true), 220);
    later(() => {
      const bloom = effectElement('reveal-bloom', point, 200);
      play(bloom, [
        { opacity: 0, transform: 'scale(.1)' },
        { opacity: .8, transform: 'scale(3)', offset: .4 },
        { opacity: 0, transform: `scale(${Math.max(innerWidth, innerHeight) / 70})` }
      ], { duration: 1400 }, true);
    }, 1100);
    return 1700;
  }

  function revealParty() {
    const party = document.querySelector('#party');
    reveal(party.querySelector('.eyebrow'), 80, 10);
    party.querySelectorAll('.headline-word').forEach((word, index) => {
      play(word, [
        { opacity: 0, transform: 'translate3d(0,48px,0) rotate(5deg) scale(.94)' },
        { opacity: 1, transform: 'translate3d(0,0,0) rotate(0) scale(1)' }
      ], { delay: 120 + index * 70, duration: 1100 });
    });
    reveal(party.querySelector('.intro'), 420, 15);
    play(party.querySelector('.cake-area'), [
      { opacity: 0, transform: 'translate3d(0,75px,0) scale(.5) rotate(-8deg)' },
      { opacity: 1, transform: 'translate3d(0,-8px,0) scale(1.035) rotate(2deg)', offset: .7 },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1) rotate(0)' }
    ], { delay: 300, duration: 1150 });
    party.querySelectorAll('.party-cat').forEach((cat, index) => {
      const tilt = parseFloat(getComputedStyle(cat).getPropertyValue('--tilt')) || 0;
      const direction = index < 3 ? -1 : 1;
      play(cat, [
        { opacity: 0, transform: `translate3d(${direction * 90}px,90px,0) rotate(${tilt + direction * 28}deg) scale(.3)` },
        { opacity: 1, transform: `translate3d(${-direction * 5}px,-10px,0) rotate(${tilt - direction * 5}deg) scale(1.04)`, offset: .72 },
        { opacity: 1, transform: `translate3d(0,0,0) rotate(${tilt}deg) scale(1)` }
      ], { delay: 480 + index * 85, duration: 1100 });
    });
    [party.querySelector('.birthday-sticker'), party.querySelector('.speech-note')].forEach((element, i) => {
      const rotation = i ? '8deg' : '-12deg';
      play(element, [
        { opacity: 0, transform: `scale(.5) rotate(${i ? 25 : -30}deg)` },
        { opacity: 1, transform: `scale(1) rotate(${rotation})` }
      ], { delay: 700 + i * 130, duration: 1000 });
    });
    reveal(party.querySelector('.wish-message'), 1000, 15);
    reveal(party.querySelector('.party-actions'), 1100, 20);
    reveal(party.querySelector('.microcopy'), 1250, 8);
    reveal(party.querySelector('.personal-note'), 1300, 20);
    later(() => { ring(); glints(origin(), 18); }, 550);
    later(() => confetti(35, { rain: true }), 650);
  }

  function flyingCats(amount = 16) {
    if (reduced.matches || !catArtwork) return;
    const point = origin();
    const kinds = ['orange', 'gray', 'cream', 'black', 'pink', 'white'];
    const limit = innerWidth < 600 ? 14 : 22;
    const count = Math.max(0, Math.min(amount, limit - airborne.length));
    const fragment = document.createDocumentFragment();
    // A second celebration gives the existing cats a fresh little push, too.
    airborne.forEach(cat => {
      cat.vy = Math.max(-7, cat.vy - 1.3);
      cat.life = Math.max(cat.life, cat.age + 1800);
    });
    for (let i = 0; i < count; i++) {
      const cat = document.createElement('div');
      cat.className = 'flying-cat';
      const size = (innerWidth < 600 ? 48 : 65) + Math.random() * 45;
      cat.style.setProperty('--size', `${size}px`);
      const artwork = catArtwork(kinds[(i + flightSequence) % kinds.length], i + flightSequence);
      cat.innerHTML = artwork.svg;
      cat.dataset.pose = artwork.pose;
      cat.style.opacity = '0';
      const side = i % 2 ? 1 : -1;
      const spin = side * (artwork.pose === 'curled' ? 2.6 + Math.random() * 1.3
        : artwork.pose === 'tumble' ? 1.9 + Math.random()
        : artwork.pose === 'loaf' ? .25 + Math.random() * .3 : .6 + Math.random() * .7);
      fragment.append(cat);
      airborne.push({
        element: cat, size, x: point.x, y: point.y,
        vx: side * (2.4 + Math.random() * 2.8),
        vy: -3 - Math.random() * 3,
        angle: Math.random() * 24 - 12,
        spin, age: -i * 42, life: 2400 + Math.random() * 700,

      });
    }
    layer.append(fragment);
    flightSequence += count;
    if (!catFrame && !document.hidden) { lastCatTime = 0; catFrame = requestAnimationFrame(drawCats); }
  }

  function drawCats(time) {
    catFrame = 0;
    const delta = lastCatTime ? Math.min((time - lastCatTime) / 16.667, 2) : 1;
    lastCatTime = time;





    airborne = airborne.filter(cat => {
      cat.age += delta * 16.667;
      if (cat.age >= cat.life) { cat.element.remove(); return false; }
      if (cat.age < 0) return true;
      const launch = 1 - Math.pow(1 - Math.min(cat.age / 450, 1), 3);
      const scale = .15 + .85 * launch;

      cat.vy = Math.min(6, cat.vy + .019 * delta);
      cat.x += cat.vx * delta;
      cat.y += cat.vy * delta;
      cat.angle += cat.spin * delta;
      const sx = scale;
      const sy = scale;
      const opacity = Math.min(cat.age / 180, 1, (cat.life - cat.age) / 850);
      cat.element.style.opacity = String(Math.max(0, opacity));
      cat.element.style.transform = `translate3d(${cat.x - cat.size / 2}px,${cat.y - cat.size / 2}px,0) rotate(${cat.angle}deg) scale(${sx},${sy})`;
      return true;
    });
    if (airborne.length && !document.hidden) catFrame = requestAnimationFrame(drawCats);
    else lastCatTime = 0;
  }

  function resizeCanvas() {
    if (canvasWidth === innerWidth && canvasHeight === innerHeight) return;
    canvasWidth = innerWidth;
    canvasHeight = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function confetti(amount = 70, options = {}) {
    if (reduced.matches || !ctx) return;
    resizeCanvas();
    const point = options.point || origin();
    const count = Math.min(amount, (innerWidth < 700 ? 90 : 170) - particles.length);
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI + Math.random() * Math.PI;
      const speed = 4 + Math.random() * 8;
      particles.push({
        x: options.rain ? Math.random() * canvasWidth : point.x,
        y: options.rain ? -20 - Math.random() * 150 : point.y,
        vx: options.rain ? Math.random() * 3 - 1.5 : Math.cos(angle) * speed,
        vy: options.rain ? 1 + Math.random() * 3 : Math.sin(angle) * speed - 3,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * .16,
        phase: Math.random() * Math.PI * 2,
        size: 4 + Math.random() * 5,
        age: 0,
        life: 210 + Math.random() * 75,
        color: colors[i % colors.length],
        shape: i % 5
      });
    }
    if (!frame && !document.hidden) { lastTime = 0; frame = requestAnimationFrame(drawConfetti); }
  }

  function drawConfetti(time) {
    frame = 0;
    resizeCanvas();
    const delta = lastTime ? Math.min((time - lastTime) / 16.667, 2) : 1;
    lastTime = time;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    particles = particles.filter(p => p.age < p.life && p.y < canvasHeight + 40);
    particles.forEach(p => {
      p.age += delta;
      p.vx *= Math.pow(.988, delta);
      p.vy = Math.min(p.vy + .16 * delta, 3.8);
      p.x += (p.vx + Math.sin(p.age * .045 + p.phase) * .6) * delta;
      p.y += p.vy * delta;
      p.angle += p.spin * delta;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.age * .07 + p.phase), 1);
      ctx.globalAlpha = Math.min(1, (p.life - p.age) / 40);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.shape === 0) ctx.ellipse(0, 0, p.size * .6, p.size * .6, 0, 0, Math.PI * 2);
      else if (p.shape === 1) {
        ctx.moveTo(0, p.size * .7);
        ctx.bezierCurveTo(-p.size * 1.4, -p.size * .2, -p.size * .5, -p.size, 0, -p.size * .4);
        ctx.bezierCurveTo(p.size * .5, -p.size, p.size * 1.4, -p.size * .2, 0, p.size * .7);
      } else ctx.rect(-p.size / 2, -p.size, p.size, p.size * (p.shape === 2 ? 2.8 : 1.7));
      ctx.fill();
      ctx.restore();
    });
    if (particles.length && !document.hidden) frame = requestAnimationFrame(drawConfetti);
    else { lastTime = 0; ctx.clearRect(0, 0, canvasWidth, canvasHeight); }
  }

  function miau() {
    if (reduced.matches) return;
    const point = origin();
    const element = document.createElement('span');
    element.className = 'miau-burst';
    element.textContent = 'MIAU!';
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y - 85}px`;
    layer.append(element);
    play(element, [
      { opacity: 0, transform: 'translate(-50%, 20px) scale(.25) rotate(-18deg)' },
      { opacity: 1, transform: 'translate(-50%, -8px) scale(1.08) rotate(-8deg)', offset: .24 },
      { opacity: 1, transform: 'translate(-50%, -15px) scale(1) rotate(-6deg)', offset: .62 },
      { opacity: 0, transform: 'translate(-50%, -55px) scale(.94) rotate(-3deg)' }
    ], { duration: 1500 }, true);
  }

  function catReaction(element) {
    const target = element.querySelector('.cat-reaction');
    for (const animation of target.getAnimations()) animation.cancel();
    play(target, [
      { transform: 'translateY(0) scale(1) rotate(0)' },
      { transform: 'translateY(3px) scale(1.025,.96) rotate(-1deg)', offset: .13 },
      { transform: 'translateY(-17px) scale(.99,1.02) rotate(5deg)', offset: .4 },
      { transform: 'translateY(2px) scale(1.025,.98) rotate(-1.5deg)', offset: .73 },
      { transform: 'translateY(0) scale(1) rotate(0)' }
    ], { duration: 680, easing: 'cubic-bezier(.3,.05,.25,1)' });
    const bounds = element.getBoundingClientRect();
    glints({ x: bounds.left + bounds.width / 2, y: bounds.top + 25 }, 7, true);
  }

  function wish() {
    ring();
    later(() => glints(origin(), 18, true), 180);
    reveal(document.querySelector('#wish-message'), 0, 10, 650);
  }

  function clear() {
    timers.forEach(clearTimeout);
    timers.clear();
    [...scenes, ...effects].forEach(animation => animation.cancel());
    scenes.clear();
    effects.clear();
    particles = [];
    airborne = [];
    cancelAnimationFrame(frame);
    cancelAnimationFrame(catFrame);
    catFrame = 0;
    lastCatTime = 0;
    frame = 0;
    lastTime = 0;
    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
    layer.querySelectorAll(':scope > :not(canvas)').forEach(element => element.remove());
  }

  async function closeParty() {
    clear();
    const animation = play(document.querySelector('#party'), [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(15px) scale(.985)' }
    ], { duration: 300 });
    if (animation) await animation.finished.catch(() => {});
  }

  function init(artwork) {
    catArtwork = artwork;
    document.querySelectorAll('.sparkle, .stage-sparkle, .mini-flower, #more-cats > span').forEach(element => {
      element.innerHTML = sparkleSvg(!!element.querySelector('[data-flower]') || element.textContent.includes('✳'));
    });
    document.querySelectorAll('h1').forEach(splitHeading);
    revealCover();
  }

  document.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const x = (event.clientX / innerWidth - .5) * 2;
      const y = (event.clientY / innerHeight - .5) * 2;
      const root = document.documentElement.style;
      root.setProperty('--pointer-x', `${x * 7}px`);
      root.setProperty('--pointer-y', `${y * 5}px`);
      root.setProperty('--pointer-rx', `${x * 4}deg`);
      root.setProperty('--pointer-ry', `${-y * 3}deg`);
      pointerFrame = 0;
    });
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    ['--pointer-x', '--pointer-y', '--pointer-rx', '--pointer-ry'].forEach(name => document.documentElement.style.removeProperty(name));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      cancelAnimationFrame(catFrame); catFrame = 0; lastCatTime = 0;
    } else {
      if (particles.length && !frame) frame = requestAnimationFrame(drawConfetti);
      if (airborne.length && !catFrame) catFrame = requestAnimationFrame(drawCats);
    }
  });

  reduced.addEventListener('change', () => {
    if (reduced.matches) clear();
  });

  return { init, revealCover, openEnvelope, revealParty, flyingCats, confetti, ring, miau, catReaction, wish, clear, closeParty };
})();


