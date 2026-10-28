/* Native media playback avoids Safari's silent/interrupted Web Audio contexts. */
window.KatzenMusic = (() => {
  'use strict';
  const audio = document.createElement('audio');
  audio.id = 'birthday-audio';
  audio.src = new URL('./assets/happy-birthday.wav?v=20261028-9', document.baseURI).href;
  audio.preload = 'auto';
  audio.loop = true;
  audio.volume = .7;
  audio.hidden = true;
  audio.setAttribute('playsinline', '');
  document.body.append(audio);
  let enabled = false;

  function start() {
    enabled = true;
    // Call play synchronously inside click/touch handlers; do not await first.
    const playing = audio.play();
    return playing || Promise.resolve();
  }

  function stop() {
    enabled = false;
    audio.pause();
  }

  ['playing', 'pause', 'error'].forEach(event => {
    audio.addEventListener(event, () => document.dispatchEvent(new Event('katzenmusicchange')));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause();
    else if (enabled) start().catch(() => {});
  });
  window.addEventListener('pagehide', () => audio.pause());
  window.addEventListener('pageshow', () => { if (enabled) start().catch(() => {}); });
  return { start, stop, get isPlaying() { return enabled && !audio.paused && !audio.ended && audio.readyState >= 2; } };
})();
