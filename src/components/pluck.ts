// A tiny plucked-string synth (Karplus-Strong). No audio files, no dependencies.
// Audio only starts after a click, tap or key press, as browsers require.

let context: AudioContext | null = null;
const cache = new Map<number, AudioBuffer>();

function getContext(): AudioContext | null {
  if (context) return context;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}

function buildBuffer(ctx: AudioContext, frequency: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const seconds = 3.4;
  const length = Math.floor(sampleRate * seconds);
  const period = Math.max(2, Math.round(sampleRate / frequency));
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  // Start with a softened burst of noise so the pluck sounds round rather than twangy.
  const ring = new Float32Array(period);
  let previous = 0;
  for (let i = 0; i < period; i++) {
    const noise = Math.random() * 2 - 1;
    previous = previous * 0.7 + noise * 0.3;
    ring[i] = previous;
  }

  const decay = 0.9965;
  for (let i = 0; i < length; i++) {
    const index = i % period;
    const next = (index + 1) % period;
    data[i] = ring[index];
    ring[index] = 0.5 * (ring[index] + ring[next]) * decay;
  }

  // Normalise so every string is about the same loudness.
  let peak = 0;
  for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(data[i]));
  const gain = peak > 0 ? 0.9 / peak : 1;
  for (let i = 0; i < length; i++) data[i] *= gain;
  return buffer;
}

export function pluck(frequency: number) {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  let buffer = cache.get(frequency);
  if (!buffer) {
    buffer = buildBuffer(ctx, frequency);
    cache.set(frequency, buffer);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.5, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

  source.connect(gain).connect(ctx.destination);
  source.start();
}
