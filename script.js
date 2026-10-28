(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = window.KatzenMotion;
  const heartMarkup = '<span class="heart-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 28S3 20 3 11a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 9-13 17-13 17Z"/></svg></span>';
  const cakeArrowMarkup = '<span class="cake-arrow" aria-hidden="true"><svg viewBox="0 0 85 65" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M72 5Q8 8 21 53m-10-11 11 13 12-14"/></svg></span>';
  const palettes = {
    orange: ['#e8a36b', '#f8d7ac', '#c6b6e0', '#d7a4a0'],
    gray: ['#a9aeba', '#e2e0dc', '#e7a064', '#d7a4a0'],
    cream: ['#ebd8b5', '#fff3dc', '#a9ba8e', '#d7a4a0'],
    black: ['#57515e', '#efdfca', '#c6b6e0', '#d7a4a0'],
    pink: ['#e2b8b2', '#f5e4d8', '#a9ba8e', '#d7a4a0'],
    white: ['#f4eee1', '#e3d7cd', '#e8a36b', '#d7a4a0']
  };
  const ink = '#433447';

  // Original vector cats: all artwork lives in the page, with no image requests.
  function catSvg(kind, variant = 0) {
    const [fur, belly, hat, cheek] = palettes[kind] || palettes.orange;
    const stripes = kind === 'orange' || kind === 'gray';
    const dark = kind === 'black';
    const eye = dark ? '#fff2d9' : ink;
    const happy = variant % 3 !== 1;
    const toes = dark ? '#cfb8c2' : '#a57265';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
      <g stroke="${ink}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">
        <path class="cat-tail" d="M139 188c43 21 53-17 35-28-11-7-21 6-10 13 13 8-6 19-23 2" fill="${fur}"/>
        <g class="cat-feet" fill="${fur}">
          <path d="M68 185c-4 13-9 28-3 39 5 9 22 10 29 0l1-30"/>
          <path d="m109 194 2 30c6 10 24 9 29 0 6-11 1-27-4-39"/>
          <path d="M73 220v7m9-6v7m40-7v7m9-8v7" fill="none" stroke="${toes}" stroke-width="2"/>
        </g>
        <path d="M68 132c-16 16-15 52-3 66 15 16 57 16 72 0 12-15 11-51-4-66Z" fill="${fur}"/>
        <ellipse cx="101" cy="175" rx="25" ry="27" fill="${belly}" stroke="none"/>
        ${stripes ? `<path d="m61 165 12 3m-12 7 11 2m68-12-12 3m12 7-11 2" stroke="${kind === 'gray' ? '#808591' : '#c67a43'}" stroke-width="4"/>` : ''}
        <g class="cat-paws" fill="${fur}">
          <g class="cat-paw-left">
          <path d="M66 150c-14-2-20-13-22-24-2-13-16-13-19-1-5 21 16 45 36 47"/>
          <ellipse cx="34" cy="135" rx="5" ry="6" fill="${cheek}" stroke="none"/>
          <path d="m29 124 1 5m6-6 1 5" fill="none" stroke="${toes}" stroke-width="1.8"/>
          </g>
          <g class="cat-paw-right">
          <path d="M137 148c9 10 17 7 25-1 10-10 23 2 13 13-11 13-27 19-38 12"/>
          <path d="m169 151 3 3m-8 2 3 3" fill="none" stroke="${toes}" stroke-width="1.8"/>
          </g>
        </g>
        <g class="cat-head">
        <path d="M48 92 43 49q0-6 6-3l32 23q20-8 42 0l30-24q6-4 6 3l-5 45c22 54-25 61-52 61S25 146 48 92Z" fill="${fur}"/>
        <path d="m51 58 5 23 15-6m64 0 15-16-3 23" fill="${cheek}" stroke="none"/>
        ${stripes ? `<path d="m90 72 5 15m9-17-1 14m12-11-6 14M46 109l14 4m-13 5 13 2m94-11-14 4m13 5-13 2" stroke="${kind === 'gray' ? '#808591' : '#c67a43'}" stroke-width="5"/>` : ''}
        ${kind === 'white' ? `<path d="M117 76q26-12 32 17t-18 27q-21-8-14-44" fill="#b3a4ba" stroke="none"/>` : ''}
        <ellipse cx="71" cy="125" rx="10" ry="5" fill="${cheek}" stroke="none" opacity=".8"/>
        <ellipse cx="132" cy="125" rx="10" ry="5" fill="${cheek}" stroke="none" opacity=".8"/>
        <g class="cat-eyes">${happy ? `<path d="M69 111q6-10 12 0m42 0q6-10 12 0" stroke="${eye}" fill="none"/>` : `<ellipse cx="76" cy="110" rx="3" ry="5" fill="${eye}" stroke="none"/><ellipse cx="128" cy="110" rx="3" ry="5" fill="${eye}" stroke="none"/>`}</g>
        <path d="m97 119 5 4 5-4Z" fill="#bb7d7e" stroke="#bb7d7e"/>
        <path d="M102 124v5m-10 0q5 8 10 0 5 8 10 0" stroke="${eye}" fill="none" stroke-width="2"/>
        <path d="m56 126-19-4m20 11-18 4m108-11 19-4m-20 11 18 4" fill="none" stroke-width="1.7"/>
        <path d="m77 74 24-63 27 63Z" fill="${hat}"/>
        ${variant % 2 ? `<g fill="#fff3de" stroke="none"><circle cx="102" cy="29" r="3"/><circle cx="96" cy="45" r="3"/><circle cx="112" cy="54" r="3"/><circle cx="91" cy="63" r="3"/></g>` : `<path d="m86 51 29-9m-21-12 12-4m-27 41 45-14" stroke="#fff3de" stroke-width="5"/>`}
        <path d="M75 75q26 8 55 0" fill="none" stroke-width="4"/>
        <circle cx="101" cy="11" r="8" fill="#fff2dc"/>
        </g>
      </g>
    </svg>`;
  }

  function flyingCatSvg(kind, variant = 0) {
    const [fur, belly, hat, cheek] = palettes[kind] || palettes.orange;
    const eye = kind === 'black' ? '#fff2d9' : ink;
    const poses = ['curled', 'loaf', 'supercat', 'tumble', 'paws-up'];
    const pose = poses[variant % poses.length];
    if (pose === 'tumble' || pose === 'paws-up') {
      let svg = catSvg(kind, variant);
      if (pose === 'tumble') svg = svg.replace('viewBox="0 0 200 240"', 'viewBox="-25 -15 250 270"')
        .replace(`<g stroke="${ink}"`, `<g transform="rotate(155 100 120)" stroke="${ink}"`);
      return { svg, pose };
    }

    const face = (x, y, scale, rotation, asleep = false) => `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})">
      <path d="M-38 0-40-39-18-25Q0-30 18-25L40-39 38 0Q46 35 0 35T-38 0Z" fill="${fur}"/>
      <path d="m-34-28 3 18 10-8m43 0 12-10-3 18" fill="${cheek}" stroke="none"/>
      <ellipse cx="-24" cy="18" rx="8" ry="4" fill="${cheek}" stroke="none"/>
      <ellipse cx="24" cy="18" rx="8" ry="4" fill="${cheek}" stroke="none"/>
      <path d="${asleep ? 'M-23 8q7 7 14 0m18 0q7 7 14 0' : 'M-23 10q7-10 14 0m18 0q7-10 14 0'}" fill="none" stroke="${eye}"/>
      <path d="m-4 16 4 3 4-3" fill="#bb7d7e" stroke="#bb7d7e"/>
      <path d="M0 20v3m-7 0q3 6 7 0 4 6 7 0m-38-5-15-4m15 10-15 3m77-9 15-4m-15 10 15 3" fill="none" stroke="${eye}" stroke-width="1.8"/>
      <path d="m-20-27 20-54 23 54Z" fill="${hat}"/>
      <path d="m-13-46 23-7m-16-12 9-3m-29 33 36-10" stroke="#fff3de" stroke-width="4"/>
      <circle cx="0" cy="-81" r="6" fill="#fff3de"/>
    </g>`;

    let body;
    if (pose === 'curled') {
      body = `<ellipse cx="123" cy="143" rx="71" ry="65" fill="${fur}"/>
        <ellipse cx="124" cy="151" rx="42" ry="41" fill="${belly}" stroke="none"/>
        <path d="M166 126c44 56-18 100-70 75-29-14-37-40-15-50 20-10 36 16 15 25 31 14 65-6 53-32" fill="${fur}"/>
        <ellipse cx="89" cy="151" rx="13" ry="9" fill="${fur}" transform="rotate(-20 89 151)"/>
        <path d="m83 149 2 5m4-7 2 5" stroke-width="1.6"/>
        ${face(76, 113, .91, -23, true)}`;
    } else if (pose === 'loaf') {
      body = `<path d="M163 161q33-47 24-62-8-12-15-2t2 15q3 16-23 34" fill="${fur}"/>
        <path d="M44 172q-7-57 62-62 69-10 75 58 1 26-64 25H65q-17 0-21-21Z" fill="${fur}"/>
        <ellipse cx="123" cy="166" rx="34" ry="19" fill="${belly}" stroke="none"/>
        <path d="M64 178q10-12 24 0m18 6q9-10 19 0" fill="none"/>
        ${face(78, 118, .96, -9, true)}
        <path d="M146 94h13l-13 15h13m8-35h18l-18 20h18" fill="none" stroke="#9a86ad" stroke-width="3"/>`;
    } else {
      body = `<path d="M155 123q43 3 43-25 0-11-9-10t-6 13q4 10-29 9" fill="${fur}"/>
        <path d="m143 143 42 22q16 6 21-5t-10-15l-41-21m-10 17 24 45q9 13 19 5t-1-20l-25-42" fill="${fur}"/>
        <ellipse cx="116" cy="130" rx="57" ry="31" fill="${fur}" transform="rotate(-20 116 130)"/>
        <ellipse cx="118" cy="137" rx="30" ry="20" fill="${belly}" stroke="none" transform="rotate(-20 118 137)"/>
        <path d="M76 119 28 99q-14-5-17 6t10 16l51 20m13-11-47 12q-14 5-9 16t18 5l42-14" fill="${fur}"/>
        <path d="m19 106 1 6m7-3 1 6m6 36 4 5m1-8 4 5m148 1-3 5m-11 20-4 4" fill="none" stroke-width="1.6"/>
        ${face(74, 99, .83, -25)}`;
    }
    return {
      pose,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 230" aria-hidden="true" focusable="false"><g stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`
    };
  }

  $('[data-cat]').innerHTML = catSvg('orange');
  const clickHint = `<span class="cat-click-hint" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M12 18V8a2.5 2.5 0 0 1 5 0v8-2a2.2 2.2 0 0 1 4 0v2a2.2 2.2 0 0 1 4 0v2a2.2 2.2 0 0 1 4 1v4c0 5-3 7-8 7h-1c-3 0-5-2-7-4l-6-7c-2-3 1-5 3-3l2 2Z"/><path class="click-rays" d="M14.5 1v2M6 5l2 2m14-2-2 2M4 12h3"/></svg></span>`;
  document.querySelectorAll('.party-cat').forEach((element, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${element.dataset.name} — натисни, щоб почути жарт`);
    button.innerHTML = `<span class="cat-reaction"><span class="cat-float">${catSvg(element.dataset.kind, index)}</span></span>${clickHint}${index === 0 ? '<span class="cat-click-label" aria-hidden="true">Натисни!</span>' : ''}`;
    element.style.setProperty('--blink-delay', `${-index * .7}s`);
    element.style.setProperty('--idle-duration', `${4.6 + index * .38}s`);
    element.style.setProperty('--wave-delay', `${-index * .85}s`);
    button.addEventListener('click', () => catTalk(element, index));
    element.append(button);
  });

  const params = new URLSearchParams(window.location.search);
  const recipient = params.get('name')?.trim().slice(0, 50);
  const sender = params.get('from')?.trim().slice(0, 100);
  if (recipient) {
    $('#cover-title').replaceChildren(document.createTextNode(`Post für ${recipient}.`), document.createElement('br'));
    const line = document.createElement('span');
    line.innerHTML = 'Mit extra <em>Miau.</em>';
    $('#cover-title').append(line);
    $('#party-title').replaceChildren(document.createTextNode('Alles Gute zum'), document.createElement('br'));
    const accent = document.createElement('em');
    accent.textContent = 'Geburtstag!';
    $('#party-title').append(accent);
    $('.party-intro').textContent = `Сьогодні ти — зірка, ${recipient}. А ми тут заради тортика.`;
    document.title = `Alles Gute zum Geburtstag, ${recipient}!`;
  }
  if (sender) $('#sender').textContent = `З любов’ю, ${sender}`;

  let isOpening = false;
  let soundOn = true;
  let soundBusy = false;
  let toastTimer;
  let openingTimer;
  let flightTimer;
  let extinguishTimer;
  let chaosCount = 0;
  let wished = false;
  let celebrationPending = false;
  let isResetting = false;

  motion.init(flyingCatSvg);

  function toast(message) {
    clearTimeout(toastTimer);
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('visible');
    toastTimer = setTimeout(() => element.classList.remove('visible'), 4200);
  }

  function showMusicState(ready = true) {
    $('#sound-toggle').setAttribute('aria-pressed', String(soundOn));
    const ukrainian = !$('#party').hidden;
    const label = ukrainian
      ? (soundOn ? (ready ? 'Вимкнути святкову мелодію' : 'Музика почнеться після дотику') : 'Увімкнути святкову мелодію')
      : (soundOn ? (ready ? 'Geburtstagsmelodie ausschalten' : 'Musik aktiviert – startet beim ersten Tippen') : 'Geburtstagsmelodie einschalten');
    $('#sound-toggle').setAttribute('aria-label', label);
    $('#sound-toggle').title = label;
    $('#sound-label').textContent = ukrainian ? (soundOn ? 'Музика грає' : 'Музика вимкнена') : (soundOn ? 'Musik an' : 'Musik aus');
  }

  function startMusic() {
    return window.KatzenMusic.start().then(() => { if (soundOn) showMusicState(); });
  }

  showMusicState(false);
  startMusic().catch(() => {});
  // Mobile browsers may require a real gesture to unlock audible playback.
  function unlockMusic(event) {
    if (soundOn && !window.KatzenMusic.isPlaying && !event.target.closest?.('#sound-toggle')) startMusic().catch(() => {});
  }
  document.addEventListener('pointerdown', unlockMusic, { capture: true, passive: true });
  document.addEventListener('touchend', unlockMusic, { capture: true, passive: true });
  document.addEventListener('keydown', unlockMusic, { capture: true });
  document.addEventListener('click', unlockMusic, { capture: true });
  document.addEventListener('katzenmusicchange', () => showMusicState(window.KatzenMusic.isPlaying));

  $('#sound-toggle').addEventListener('click', async () => {
    if (soundBusy) return;
    soundBusy = true;
    try {
      soundOn = !soundOn;
      showMusicState(!soundOn);
      if (soundOn) await startMusic();
      else window.KatzenMusic.stop();
    } catch {
      soundOn = false;
      window.KatzenMusic.stop();
      showMusicState();
      toast('Diese Katzen bleiben heute lieber leise. Die Party geht trotzdem weiter!');
    } finally {
      soundBusy = false;
    }
  });

  function confetti(amount = 65) {
    motion.confetti(amount);
  }

  function flyingCats(amount = 14) {
    motion.flyingCats(amount);
  }

  function revealParty() {
    if (!isOpening) return;
    clearTimeout(openingTimer);
    $('#cover').hidden = true;
    $('#party').hidden = false;
    showMusicState(window.KatzenMusic.isPlaying);
    document.querySelector('footer > span:first-child').textContent = 'З ЛЮБОВ’Ю, ПУХНАСТИМИ ЛАПКАМИ Й ТРОХИ ХАОСОМ.';
    document.querySelector('footer > span:last-child').innerHTML = 'Перевірено котиками. ' + heartMarkup;
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#party-title').focus({ preventScroll: true });
    motion.revealParty();
    confetti(75);
    flyingCats(18);
    isOpening = false;
  }

  function openCard() {
    if (isOpening || $('#cover').hidden) return;
    isOpening = true;
    $('#cover').classList.add('opening');
    $('#open-button').disabled = true;
    $('#open-card').disabled = true;
    openingTimer = setTimeout(revealParty, motion.openEnvelope());
  }
  $('#open-card').addEventListener('click', openCard);
  $('#open-button').addEventListener('click', openCard);

  const quotes = [
    ['Калорії? Сьогодні рахують лише погладжування!', 'Я охороняв тортик. Ротом.'],
    ['Ти не старієш. Просто стаєш затишнішою людиною.', 'Мій подарунок? Я нічого не скинув зі столу.'],
    ['У мене дев’ять життів, але такого дня, як цей, більше немає. Святкуй!', 'Науково доведено: більше тортика — більше щастя.'],
    ['DJ Лапка сьогодні ставить тільки муркотливі хіти!', 'Усі зустрічі скасовано. Причина: день народження. Мяу.'],
    ['Залишайся такою ж чудовою людиною. І поділись тортиком!', 'Дрескод вечірки: пухнастість і гарний настрій.'],
    ['Твій вік залишиться між нами. І всім інтернетом.', 'Ти — наша улюблена людина в цій коробці.']
  ];
  const talkCounts = new Map();
  function catTalk(element, index) {
    const count = talkCounts.get(index) || 0;
    toast(`${element.dataset.name}: «${quotes[index][count % quotes[index].length]}»`);
    talkCounts.set(index, count + 1);
    motion.catReaction(element);
  }

  $('#cake').addEventListener('click', () => {
    if (wished || isResetting) return;
    wished = true;
    $('#cake').classList.add('blown');
    $('#cake').disabled = true;
    extinguishTimer = setTimeout(() => $('#cake').classList.add('extinguished'), reducedMotion.matches ? 0 : 1000);
    $('#cake').setAttribute('aria-label', 'Die Geburtstagskerzen sind ausgepustet');
    $('#cake svg').setAttribute('aria-label', 'Eine Geburtstagstorte mit fünf ausgepusteten Kerzen');
    $('#cake-hint').innerHTML = 'Geschafft!<br>Wunsch unterwegs. ' + heartMarkup;
    $('#cake-caption').textContent = 'Eine Geburtstagstorte mit fünf ausgepusteten Kerzen';
    $('#wish-message').textContent = 'Бажання відправлено. Всесвіт уже набирає відповідь…';
    toast('Усі свічки погасли! Твоє бажання — наш маленький секрет.');
    confetti(65);
    motion.wish();
  });

  $('#more-cats').addEventListener('click', () => {
    if (celebrationPending) return;
    celebrationPending = true;
    chaosCount++;
    flyingCats(Math.min(16 + chaosCount * 3, 31));
    confetti(60);
    motion.ring();
    motion.miau();
    const messages = ['Котяче конфеті! Усе під контролем. Майже.', 'Увага! Кількість пухнастості щойно подвоїлась.', 'Тепер цією вечіркою керують коти.', 'Котів забагато не буває. Буває замало тортика.'];
    toast(messages[(chaosCount - 1) % messages.length]);
    $('#more-cats').disabled = true;
    flightTimer = setTimeout(() => {
      $('#more-cats').disabled = false;
      celebrationPending = false;
    }, reducedMotion.matches ? 250 : 1800);
  });

  $('#reset-card').addEventListener('click', async () => {
    if (isResetting) return;
    isResetting = true;
    $('#reset-card').disabled = true;
    clearTimeout(openingTimer);
    clearTimeout(flightTimer);
    clearTimeout(toastTimer);
    clearTimeout(extinguishTimer);
    await motion.closeParty();
    $('#toast').classList.remove('visible');
    $('#party').hidden = true;
    $('#cover').hidden = false;
    showMusicState(window.KatzenMusic.isPlaying);
    document.querySelector('footer > span:first-child').textContent = 'MIT LIEBE, VIEL FELL & EIN BISSCHEN CHAOS.';
    document.querySelector('footer > span:last-child').innerHTML = 'Handverlesen. Pfotengeprüft. ' + heartMarkup;
    $('#cover').classList.remove('opening');
    $('#reset-card').disabled = false;
    $('#open-button').disabled = false;
    $('#open-card').disabled = false;
    $('#more-cats').disabled = false;
    $('#cake').classList.remove('blown', 'extinguished');
    $('#cake').disabled = false;
    $('#cake').setAttribute('aria-label', 'Geburtstagskerzen auspusten');
    $('#cake svg').setAttribute('aria-label', 'Eine Geburtstagstorte mit fünf brennenden Kerzen');
    $('#cake-hint').innerHTML = 'Wünsch dir was.<br>Dann puste! ' + cakeArrowMarkup;
    $('#wish-message').textContent = 'Нехай цей день тішить тебе, як нова коробка — кота.';
    $('#cake-caption').textContent = 'Eine Geburtstagstorte mit fünf brennenden Kerzen';
    wished = false;
    isOpening = false;
    celebrationPending = false;
    chaosCount = 0;
    talkCounts.clear();
    isResetting = false;
    motion.revealCover();
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#open-button').focus({ preventScroll: true });
  });

  // Stop transient particles immediately if the visitor changes motion preferences.
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && wished) {
      clearTimeout(extinguishTimer);
      $('#cake').classList.add('extinguished');
    }
    if (reducedMotion.matches && isOpening) revealParty();
  });
})();
