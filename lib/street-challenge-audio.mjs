// Browser-only sounds. Call play from a tap/click; never during rendering.
export function createGameAudio() {
  let context;
  let muted = false;
  let disposed = false;
  const frequencies = {
    select: [523.25, 659.25],
    equip: [659.25, 783.99],
    celebrate: [523.25, 659.25, 783.99, 1046.5],
    count: [880],
  };
  return {
    setMuted(value) { muted = Boolean(value); },
    async play(cue) {
      if (muted || disposed || typeof window === 'undefined') return;
      const notes = frequencies[cue];
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!notes || !AudioContext) return;
      try {
        context ||= new AudioContext();
        if (context.state === 'suspended') await context.resume();
        if (muted || disposed || context.state !== 'running') return;
        const start = context.currentTime;
        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const time = start + index * 0.09;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(time);
          oscillator.stop(time + 0.18);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      } catch { /* Sound is optional; gameplay remains available. */ }
    },
    async dispose() {
      disposed = true;
      if (context && context.state !== 'closed') await context.close();
    },
  };
}
