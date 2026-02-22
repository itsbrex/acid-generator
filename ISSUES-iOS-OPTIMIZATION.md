# iOS Optimization Issues for ACID Pattern Generator

These issues focus on optimizing the app for iPhone 17 Pro Max and iOS Safari/Chrome best practices.

---

## Issue 1: iOS Web Audio API Best Practices for Safari

**Labels:** `enhancement`, `ios`, `audio`, `priority:high`

### Summary
Optimize the Tone.js audio engine for iOS Safari's unique Web Audio API requirements and limitations.

### Problem
iOS Safari has specific constraints around Web Audio:
- Audio context must be resumed after user interaction
- Sample rate limitations and preferences
- Background audio handling differs from desktop
- Latency requirements for music production

### Proposed Solution
1. Add explicit AudioContext resume on first touch event
2. Implement recommended 48kHz sample rate for iOS devices
3. Add visibility change handlers to pause/resume audio when app is backgrounded
4. Use `playbackCategory: 'playback'` hint for low-latency audio
5. Implement proper audio session handling

### Files to Modify
- `src/audio-engine/synth.ts`
- `src/audio-engine/controls.ts`
- `src/App.tsx`

### Acceptance Criteria
- [ ] Audio plays reliably on first user interaction
- [ ] No audio glitches when switching apps
- [ ] Sub-10ms latency for real-time playback
- [ ] Proper handling of phone calls/interruptions

---

## Issue 2: Touch-Optimized Piano Roll for iPhone

**Labels:** `enhancement`, `ios`, `ux`, `priority:high`

### Summary
Redesign the PianoRoll component with iOS touch interactions and gestures in mind.

### Problem
Current piano roll is designed for mouse interaction. iPhone users need:
- Larger touch targets (minimum 44x44pt per Apple HIG)
- Gesture support (swipe, pinch-to-zoom)
- Momentum scrolling
- Haptic feedback on note selection

### Proposed Solution
1. Increase step cell size to minimum 44pt on mobile
2. Add pinch-to-zoom for pattern length navigation
3. Implement horizontal swipe with momentum scrolling
4. Add haptic feedback via `navigator.vibrate()` or Taptic Engine API
5. Support multi-touch for editing multiple notes

### Technical Details
```typescript
// Use touch-action CSS for gesture control
.pianoRoll {
  touch-action: pan-x pan-y pinch-zoom;
  -webkit-overflow-scrolling: touch;
}
```

### Files to Modify
- `src/components/sequencer/PianoRoll.tsx`
- `src/components/sequencer/PianoRoll.module.less`
- `src/components/sequencer/PatternStep.tsx`

### Acceptance Criteria
- [ ] All touch targets meet 44pt minimum
- [ ] Smooth 60fps scrolling
- [ ] Haptic feedback on note toggle
- [ ] Pinch-to-zoom works for pattern navigation

---

## Issue 3: Optimized Knob Component for Touch Interaction

**Labels:** `enhancement`, `ios`, `ux`, `priority:high`

### Summary
Enhance the Knob component for precise touch control on iPhone, following iOS music app conventions.

### Problem
The current Knob component uses mouse events. For iOS music production:
- Need larger touch area
- Vertical drag is standard for iOS synth knobs
- Should support fine-tuning with slow drag
- Need visual feedback during interaction

### Proposed Solution
1. Implement vertical drag gesture (drag up = increase, down = decrease)
2. Add "fine tune" mode: slow drag = smaller increments
3. Increase touch target to 60x60pt minimum
4. Add visual scale/glow during active touch
5. Implement double-tap to reset to default value
6. Add haptic ticks at detent points

### Technical Details
```typescript
// Fine-tune sensitivity based on drag speed
const sensitivity = Math.abs(deltaY) < 2 ? 0.1 : 1.0;
```

### Files to Modify
- `src/components/Knob.tsx`
- `src/components/Knob.module.less`

### Acceptance Criteria
- [ ] Smooth vertical drag control
- [ ] Fine-tune mode for precision
- [ ] Double-tap reset functionality
- [ ] Haptic feedback at value boundaries

---

## Issue 4: Safe Area and Notch/Dynamic Island Support

**Labels:** `enhancement`, `ios`, `layout`, `priority:high`

### Summary
Implement proper safe area insets for iPhone 17 Pro Max Dynamic Island and rounded corners.

### Problem
iPhone 17 Pro Max has:
- Dynamic Island at top
- Rounded screen corners
- Home indicator at bottom
- Content can be obscured without safe area handling

### Proposed Solution
1. Use `env(safe-area-inset-*)` CSS variables
2. Add viewport meta tag with `viewport-fit=cover`
3. Implement safe area padding for all UI edges
4. Ensure controls aren't obscured by Dynamic Island
5. Keep transport controls above home indicator

### Technical Details
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

```css
.app {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Files to Modify
- `index.html`
- `src/App.module.less`
- `src/index.less`

### Acceptance Criteria
- [ ] No content hidden behind Dynamic Island
- [ ] Transport controls visible above home indicator
- [ ] Full-bleed design with safe content areas
- [ ] Landscape orientation properly handled

---

## Issue 5: High Refresh Rate (ProMotion 120Hz) Optimization

**Labels:** `enhancement`, `ios`, `performance`, `priority:medium`

### Summary
Optimize animations and rendering for iPhone's 120Hz ProMotion display.

### Problem
iPhone 17 Pro Max supports 120Hz refresh rate. Current implementation may:
- Not take advantage of smoother animations
- Have janky step indicator movement
- Cause unnecessary battery drain with unoptimized renders

### Proposed Solution
1. Use CSS transforms for step indicator (GPU accelerated)
2. Implement `will-change` hints for animated elements
3. Use `requestAnimationFrame` properly for step updates
4. Add `prefers-reduced-motion` media query support
5. Optimize React re-renders with proper memoization

### Technical Details
```css
.stepIndicator {
  will-change: transform;
  transform: translateX(var(--step-offset));
}

@media (prefers-reduced-motion: reduce) {
  .stepIndicator {
    transition: none;
  }
}
```

### Files to Modify
- `src/components/sequencer/PianoRoll.tsx`
- `src/components/sequencer/PianoRoll.module.less`
- `src/audio-engine/controls.ts`

### Acceptance Criteria
- [ ] Consistent 120fps animations on ProMotion displays
- [ ] Reduced motion support for accessibility
- [ ] No dropped frames during playback
- [ ] Battery-efficient rendering

---

## Issue 6: PWA Support with iOS-Specific Optimizations

**Labels:** `enhancement`, `ios`, `pwa`, `priority:medium`

### Summary
Implement Progressive Web App features optimized for iOS Safari standalone mode.

### Problem
iOS Safari supports PWA features but with specific requirements:
- Need Apple-specific meta tags
- Splash screens require specific configurations
- Status bar styling options
- No native install prompt (relies on manual "Add to Home Screen")

### Proposed Solution
1. Add Apple-specific PWA meta tags
2. Create splash screen images for all iPhone sizes
3. Implement `standalone` display mode detection
4. Add `apple-mobile-web-app-*` meta tags
5. Create app icons in required iOS sizes (180x180, etc.)

### Technical Details
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ACID Gen">
<link rel="apple-touch-icon" href="/icon-180.png">
<link rel="apple-touch-startup-image" href="/splash.png">
```

### Files to Modify
- `index.html`
- Add `public/manifest.json`
- Add icon assets

### Acceptance Criteria
- [ ] App installable via "Add to Home Screen"
- [ ] Custom splash screen displays on launch
- [ ] Status bar matches app theme
- [ ] Works offline with service worker

---

## Issue 7: MIDI over Bluetooth LE Support

**Labels:** `enhancement`, `ios`, `midi`, `priority:medium`

### Summary
Add support for Bluetooth MIDI devices on iOS, common for mobile music production.

### Problem
iOS musicians often use Bluetooth MIDI controllers. Current Web MIDI implementation may not:
- Properly detect BLE MIDI devices
- Handle connection/disconnection gracefully
- Support iOS-specific MIDI workflows

### Proposed Solution
1. Implement Web Bluetooth API for BLE MIDI discovery
2. Add UI for Bluetooth device pairing
3. Handle iOS permission prompts gracefully
4. Support background MIDI connection persistence
5. Add latency compensation for Bluetooth timing

### Technical Details
```typescript
// Request BLE MIDI device
const device = await navigator.bluetooth.requestDevice({
  filters: [{ services: ['03b80e5a-ede8-4b33-a751-6ce34ec4c700'] }] // MIDI service UUID
});
```

### Files to Modify
- `src/audio-engine/midi-output.ts`
- `src/components/sequencer/OutputSelector.tsx`
- Add `src/audio-engine/bluetooth-midi.ts`

### Acceptance Criteria
- [ ] BLE MIDI devices discoverable
- [ ] Stable connection maintained
- [ ] Latency compensation applied
- [ ] Graceful handling of disconnection

---

## Issue 8: Dark Mode and OLED Optimization

**Labels:** `enhancement`, `ios`, `design`, `priority:medium`

### Summary
Implement system-aware dark mode with true black backgrounds for iPhone OLED displays.

### Problem
iPhone uses OLED displays where true black (#000000) pixels are completely off:
- Saves battery
- Reduces eye strain in dark environments
- Expected behavior for iOS apps

### Proposed Solution
1. Detect system dark mode via `prefers-color-scheme`
2. Use true black (#000000) for backgrounds
3. Ensure sufficient contrast ratios (WCAG AA minimum)
4. Add subtle borders/separators for depth
5. Optimize accent colors for OLED vibrancy

### Technical Details
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #1c1c1e; /* iOS system gray */
    --accent: #30d158; /* iOS green */
  }
}
```

### Files to Modify
- `src/colors.less`
- `src/index.less`
- All component `.module.less` files

### Acceptance Criteria
- [ ] Automatic dark/light mode switching
- [ ] True black backgrounds in dark mode
- [ ] WCAG AA contrast compliance
- [ ] Matches iOS system appearance

---

## Issue 9: Optimize Bundle Size for Mobile Networks

**Labels:** `enhancement`, `ios`, `performance`, `priority:medium`

### Summary
Reduce initial bundle size and implement code splitting for faster load times on mobile networks.

### Problem
Mobile users on cellular may experience:
- Slow initial load times
- Data usage concerns
- Poor performance on slower connections

### Proposed Solution
1. Implement dynamic imports for heavy dependencies (Tone.js)
2. Add route-based code splitting
3. Optimize and compress assets
4. Implement resource hints (preload, prefetch)
5. Add loading states for lazy-loaded components

### Technical Details
```typescript
// Lazy load Tone.js
const ToneModule = await import('tone');

// Vite config for chunk optimization
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'audio': ['tone', '@tonejs/midi'],
        'vendor': ['react', 'react-dom', 'react-redux']
      }
    }
  }
}
```

### Files to Modify
- `vite.config.ts`
- `src/audio-engine/synth.ts`
- `src/App.tsx`

### Acceptance Criteria
- [ ] Initial bundle under 200KB gzipped
- [ ] Audio engine lazy-loaded
- [ ] Time to Interactive under 3s on 3G
- [ ] Proper loading states shown

---

## Issue 10: iOS Keyboard and Input Optimization

**Labels:** `enhancement`, `ios`, `ux`, `priority:low`

### Summary
Handle iOS virtual keyboard and text input edge cases for pattern naming and BPM input.

### Problem
iOS virtual keyboard can:
- Obscure input fields
- Cause viewport resize issues
- Have different behavior for number inputs
- Interfere with audio playback when appearing

### Proposed Solution
1. Use `inputmode="numeric"` for BPM input
2. Implement `visualViewport` API for keyboard detection
3. Scroll inputs into view when keyboard appears
4. Prevent viewport zoom on input focus
5. Use iOS-native input styling

### Technical Details
```html
<!-- Prevent zoom on input focus -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<!-- Numeric keyboard for BPM -->
<input type="text" inputmode="numeric" pattern="[0-9]*">
```

```typescript
// Detect keyboard
visualViewport?.addEventListener('resize', () => {
  const keyboardHeight = window.innerHeight - visualViewport.height;
});
```

### Files to Modify
- `index.html`
- `src/components/sequencer/Header.tsx` (pattern name input)
- `src/components/sequencer/Controls.tsx` (BPM input if present)

### Acceptance Criteria
- [ ] Numeric keyboard for BPM input
- [ ] Inputs not obscured by keyboard
- [ ] No viewport zoom on focus
- [ ] Audio continues when keyboard appears

---

## Implementation Priority

| Priority | Issues |
|----------|--------|
| High | #1, #2, #3, #4 |
| Medium | #5, #6, #7, #8, #9 |
| Low | #10 |

## Testing Requirements

All issues should be tested on:
- iPhone 17 Pro Max (or latest available)
- iOS Safari (latest)
- iOS Chrome (latest)
- Both portrait and landscape orientations
- With and without external MIDI devices
