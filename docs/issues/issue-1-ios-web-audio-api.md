# iOS Web Audio API Best Practices for Safari

**Labels:** `enhancement`, `ios`, `audio`, `priority:high`

## Summary
Optimize the Tone.js audio engine for iOS Safari's unique Web Audio API requirements and limitations.

## Problem
iOS Safari has specific constraints around Web Audio:
- Audio context must be resumed after user interaction
- Sample rate limitations and preferences
- Background audio handling differs from desktop
- Latency requirements for music production

## Proposed Solution
1. Add explicit AudioContext resume on first touch event
2. Implement recommended 48kHz sample rate for iOS devices
3. Add visibility change handlers to pause/resume audio when app is backgrounded
4. Use `playbackCategory: 'playback'` hint for low-latency audio
5. Implement proper audio session handling

## Files to Modify
- `src/audio-engine/synth.ts`
- `src/audio-engine/controls.ts`
- `src/App.tsx`

## Acceptance Criteria
- [ ] Audio plays reliably on first user interaction
- [ ] No audio glitches when switching apps
- [ ] Sub-10ms latency for real-time playback
- [ ] Proper handling of phone calls/interruptions
