import { MonoSynth, PingPongDelay, Split, Volume } from 'tone';
import { store } from '../store';

/**
 * TB-303 style MonoSynth configuration.
 *
 * iOS Web Audio API Considerations:
 * - The AudioContext created by Tone.js may start in a "suspended" state on iOS Safari
 * - Audio unlock is handled in App.tsx via a first-touch event listener that calls start()
 * - Visibility change handling in controls.ts pauses/resumes playback when app is backgrounded
 * - The synth itself doesn't need special iOS handling - it's managed at the context level
 */

const {
  synth: { cutoff, resonance, delaySend },
} = store.getState();

const split = new Split(2);
const pingPong = new PingPongDelay('8n.', 0.6).toDestination();
const vol = new Volume(delaySend).connect(pingPong);

split.connect(vol);

const tb303 = new MonoSynth({
  oscillator: {
    type: 'sawtooth',
  },
  envelope: {
    attackCurve: 'exponential',
    releaseCurve: 'exponential',
    attack: 0.01,
    decay: 0.3,
    sustain: 0.5,
    release: 0.2,
  },
  filterEnvelope: {
    attackCurve: 'exponential',
    releaseCurve: 'exponential',
    attack: 0.01,
    decay: 0.3,
    sustain: 0.5,
    release: 1,
    baseFrequency: cutoff,
    exponent: 5,
  },
  filter: {
    frequency: cutoff,
    rolloff: -24,
    Q: resonance,
    type: 'lowpass',
  },
  portamento: 0.02,
})
  .connect(split)
  .toDestination();

export { tb303, vol as delaySend };
