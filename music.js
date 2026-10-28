/* Happy Birthday to You, arranged locally for a soft instrumental music box. */
window.KatzenMusic = (() => {
  'use strict';
  const beat = 60 / 100;
  const melody = [
    [67,.75],[67,.25],[69,1],[67,1],[72,1],[71,2],
    [67,.75],[67,.25],[69,1],[67,1],[74,1],[72,2],
    [67,.75],[67,.25],[79,1],[76,1],[72,1],[71,1],[69,2],
    [77,.75],[77,.25],[76,1],[72,1],[74,1],[72,2],[null,2]
  ];
  const roots = [48,55,55,48,48,53,55,48,48];
  const voices = new Set();
  let context;
  let master;
  let enabled = false;
  let scheduler = 0;
  let nextNote = 0;
  let nextChord = 0;
  let noteIndex = 0;
  let chordIndex = 0;

  function note(midi, time, duration, volume, overtone = false) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + .018);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume * .28, .001), time + duration * .55);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration + .25);
    oscillator.connect(gain);
    gain.connect(master);
    voices.add(oscillator);
    oscillator.onended = () => { voices.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(time);
    oscillator.stop(time + duration + .3);
    if (overtone) note(midi + 12, time, duration * .6, volume * .12);
  }

  function tick() {
    if (!enabled || document.hidden) return;
    const horizon = context.currentTime + .3;
    while (nextNote < horizon) {
      const [pitch, length] = melody[noteIndex];
      if (pitch !== null) note(pitch, nextNote, length * beat * .9, .105, true);
      nextNote += length * beat;
      noteIndex = (noteIndex + 1) % melody.length;
    }
    while (nextChord < horizon) {
      const root = roots[chordIndex % roots.length];
      note(root, nextChord, beat * 1.8, .055);
      note(root + 7, nextChord + beat, beat * .8, .027);
      note(root + 16, nextChord + beat * 2, beat * .8, .025);
      nextChord += beat * 3;
      chordIndex++;
    }
  }

  function stopVoices() {
    if (!context) return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(master.gain.value, context.currentTime);
    master.gain.linearRampToValueAtTime(0, context.currentTime + .12);
    voices.forEach(voice => voice.stop(context.currentTime + .14));
  }

  function schedule() {
    clearInterval(scheduler);
    noteIndex = 0;
    chordIndex = 0;
    nextNote = context.currentTime + .1;
    nextChord = nextNote + beat;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(.65, context.currentTime + .25);
    tick();
    scheduler = setInterval(tick, 100);
  }

  async function start() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error('Web Audio unavailable');
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
    }
    enabled = true;
    const resumed = context.resume();
    // iOS needs a source to start inside the touch event, before any await.
    if (context.state !== 'running') {
      const unlock = context.createBufferSource();
      unlock.buffer = context.createBuffer(1, 1, context.sampleRate);
      unlock.connect(context.destination);
      unlock.onended = () => unlock.disconnect();
      unlock.start(0);
    }
    if (!document.hidden && !scheduler) schedule();
    await resumed;
  }

  function stop() {
    enabled = false;
    clearInterval(scheduler);
    scheduler = 0;
    stopVoices();
  }

  document.addEventListener('visibilitychange', () => {
    if (!enabled) return;
    if (document.hidden) { clearInterval(scheduler); scheduler = 0; stopVoices(); }
    else start().catch(() => {});
  });
  window.addEventListener('pagehide', stop);
  return { start, stop, get isPlaying() { return enabled && context?.state === 'running' && !!scheduler; } };
})();
