# iOS Optimization Implementation Plan

A phased roadmap for optimizing ACID Pattern Generator for iPhone 17 Pro Max with dependencies organized by execution order.

---

## Dependency Graph

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                      PHASE 1                            │
                    │                   (Foundation)                          │
                    │                                                         │
                    │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
                    │  │ Issue #1 │  │ Issue #4 │  │ Issue #3 │              │
                    │  │ Web Audio│  │Safe Area │  │  Knob    │              │
                    │  └────┬─────┘  └────┬─────┘  └──────────┘              │
                    │       │             │                                   │
                    └───────┼─────────────┼───────────────────────────────────┘
                            │             │
        ┌───────────────────┼─────────────┼───────────────────────────────────┐
        │                   │  PHASE 2    │                                   │
        │                   │  (Core UX)  │                                   │
        │                   ▼             ▼                                   │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
        │  │ Issue #8 │  │ Issue #2 │  │Issue #10 │                          │
        │  │Dark Mode │  │Piano Roll│  │ Keyboard │                          │
        │  └────┬─────┘  └────┬─────┘  └──────────┘                          │
        │       │             │                                               │
        └───────┼─────────────┼───────────────────────────────────────────────┘
                │             │
    ┌───────────┼─────────────┼───────────────────────────────────────────────┐
    │           │  PHASE 3    │                                               │
    │           │(Performance)│                                               │
    │           ▼             ▼                                               │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐                              │
    │  │ Issue #6 │  │ Issue #5 │  │ Issue #9 │                              │
    │  │   PWA    │  │  120Hz   │  │  Bundle  │                              │
    │  └──────────┘  └──────────┘  └────┬─────┘                              │
    │                                   │                                     │
    └───────────────────────────────────┼─────────────────────────────────────┘
                                        │
            ┌───────────────────────────┼─────────────────────────────────────┐
            │           PHASE 4         │                                     │
            │          (Advanced)       │                                     │
            │                           ▼                                     │
            │                    ┌──────────┐                                 │
            │                    │ Issue #7 │                                 │
            │                    │ BLE MIDI │                                 │
            │                    └──────────┘                                 │
            │                                                                 │
            └─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation (No Dependencies)

These issues have no dependencies and establish the foundation for subsequent work.

| Issue | Title | Est. Effort | Files | Parallel? |
|-------|-------|-------------|-------|-----------|
| **#1** | iOS Web Audio API Best Practices | 3-4 hours | `synth.ts`, `controls.ts`, `App.tsx` | ✅ |
| **#4** | Safe Area / Dynamic Island | 2-3 hours | `index.html`, `App.module.less`, `index.less` | ✅ |
| **#3** | Touch-Optimized Knob | 3-4 hours | `Knob.tsx`, `Knob.module.less` | ✅ |
| **#8** | Dark Mode / OLED | 2-3 hours | `colors.less`, `index.less`, `*.module.less` | ✅ |

### Phase 1 Tasks

#### Issue #1: iOS Web Audio API
- [ ] Add iOS detection utility
- [ ] Implement AudioContext unlock on first touch
- [ ] Configure 48kHz sample rate for iOS
- [ ] Add visibility change handlers (pause/resume)
- [ ] Test audio interruption handling (calls, alarms)

#### Issue #4: Safe Area / Dynamic Island
- [ ] Update viewport meta tag with `viewport-fit=cover`
- [ ] Add CSS env() variables for safe-area-inset
- [ ] Update App.module.less with safe area padding
- [ ] Test landscape orientation
- [ ] Verify Dynamic Island doesn't obscure content

#### Issue #3: Touch-Optimized Knob
- [ ] Refactor to vertical drag gesture
- [ ] Implement fine-tune mode (velocity-based)
- [ ] Add double-tap reset
- [ ] Increase touch target to 60pt
- [ ] Add haptic feedback triggers
- [ ] Update visual feedback during touch

#### Issue #8: Dark Mode / OLED
- [ ] Add CSS custom properties for theme colors
- [ ] Implement `prefers-color-scheme` media queries
- [ ] Use true black (#000) for OLED backgrounds
- [ ] Audit contrast ratios (WCAG AA)
- [ ] Update all component stylesheets

**Phase 1 Deliverable:** App functions correctly on iOS with proper audio, layout, and basic touch support.

---

## Phase 2: Core UX (Depends on Phase 1)

These issues depend on Phase 1 completion for layout/audio foundations.

| Issue | Title | Est. Effort | Depends On | Parallel? |
|-------|-------|-------------|------------|-----------|
| **#2** | Touch-Optimized Piano Roll | 4-5 hours | #4 (safe area) | ✅ |
| **#10** | iOS Keyboard Input | 2-3 hours | #1, #4 | ✅ |

### Phase 2 Tasks

#### Issue #2: Touch-Optimized Piano Roll
- [ ] Increase touch targets to 44pt minimum
- [ ] Add `-webkit-overflow-scrolling: touch`
- [ ] Implement pinch-to-zoom gesture handler
- [ ] Add momentum scrolling
- [ ] Implement haptic feedback on note toggle
- [ ] Support multi-touch note editing
- [ ] Update PatternStep component for touch

#### Issue #10: iOS Keyboard Input
- [ ] Add `inputmode="numeric"` for BPM
- [ ] Implement `visualViewport` keyboard detection
- [ ] Add scroll-into-view for focused inputs
- [ ] Prevent viewport zoom on focus
- [ ] Ensure audio continues during keyboard display

**Phase 2 Deliverable:** Complete touch-optimized editing experience for iOS.

---

## Phase 3: Performance & PWA (Depends on Phase 1 & 2)

These issues optimize performance and add PWA capabilities.

| Issue | Title | Est. Effort | Depends On | Parallel? |
|-------|-------|-------------|------------|-----------|
| **#5** | ProMotion 120Hz | 3-4 hours | #1, #2 | ✅ |
| **#6** | PWA iOS Support | 4-5 hours | #4, #8 | ✅ |
| **#9** | Bundle Size Optimization | 3-4 hours | #1 | ✅ |

### Phase 3 Tasks

#### Issue #5: ProMotion 120Hz Optimization
- [ ] Convert step indicator to CSS transform animation
- [ ] Add `will-change` hints to animated elements
- [ ] Implement `requestAnimationFrame` for step sync
- [ ] Add `prefers-reduced-motion` support
- [ ] Optimize React memoization (useMemo, useCallback)
- [ ] Profile and eliminate dropped frames

#### Issue #6: PWA iOS Support
- [ ] Add Apple PWA meta tags to index.html
- [ ] Create app icons (180x180, etc.)
- [ ] Generate splash screens for all iPhone sizes
- [ ] Create manifest.json with iOS settings
- [ ] Implement service worker for offline
- [ ] Detect standalone mode and adjust UI
- [ ] Test "Add to Home Screen" flow

#### Issue #9: Bundle Size Optimization
- [ ] Configure Vite manual chunks (audio, vendor)
- [ ] Implement lazy loading for Tone.js
- [ ] Add loading state component
- [ ] Implement resource hints (preload, prefetch)
- [ ] Audit and tree-shake unused dependencies
- [ ] Target < 200KB initial gzipped bundle

**Phase 3 Deliverable:** Silky-smooth 120Hz animations, installable PWA, fast load times.

---

## Phase 4: Advanced Features (Depends on Phase 1 & 3)

Advanced capabilities that extend the core functionality.

| Issue | Title | Est. Effort | Depends On | Parallel? |
|-------|-------|-------------|------------|-----------|
| **#7** | Bluetooth MIDI | 5-6 hours | #1, #9 | N/A |

### Phase 4 Tasks

#### Issue #7: Bluetooth MIDI Support
- [ ] Research Web Bluetooth API Safari support
- [ ] Create `bluetooth-midi.ts` module
- [ ] Implement BLE MIDI service discovery
- [ ] Add Bluetooth pairing UI in OutputSelector
- [ ] Handle iOS permission prompts
- [ ] Implement connection state management
- [ ] Add latency compensation (30-50ms typical)
- [ ] Handle disconnection/reconnection gracefully

**Phase 4 Deliverable:** Full Bluetooth MIDI controller support for iOS music production.

---

## Execution Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IMPLEMENTATION TIMELINE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHASE 1 ─────────────►  PHASE 2 ─────────────►  PHASE 3           │
│  (10-14 hrs)             (6-8 hrs)               (10-13 hrs)        │
│                                                                     │
│  #1 Web Audio ──────────────────────────────────► #5 120Hz          │
│  #4 Safe Area ──────────► #2 Piano Roll ────────► #6 PWA           │
│  #3 Knob                  #10 Keyboard           #9 Bundle          │
│  #8 Dark Mode                                         │             │
│                                                       │             │
│                                              PHASE 4 ◄┘             │
│                                              (5-6 hrs)              │
│                                              #7 BLE MIDI            │
│                                                                     │
│  Total Estimated: 31-41 hours                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Testing Checkpoints

### After Phase 1
- [ ] Audio plays on first tap in iOS Safari
- [ ] No content behind Dynamic Island
- [ ] Knobs respond to vertical drag
- [ ] Dark mode follows system preference

### After Phase 2
- [ ] Piano roll scrolls smoothly
- [ ] Notes toggleable with single tap
- [ ] Keyboard doesn't break layout
- [ ] Audio continues during text input

### After Phase 3
- [ ] Animations smooth at 120fps
- [ ] App installable from Safari
- [ ] Loads in < 3s on 3G
- [ ] Works offline

### After Phase 4
- [ ] BLE MIDI devices discoverable
- [ ] Notes play through Bluetooth MIDI
- [ ] Reconnection works reliably

---

## Test Devices

| Device | Browser | Priority |
|--------|---------|----------|
| iPhone 17 Pro Max | Safari | P0 |
| iPhone 17 Pro Max | Chrome | P0 |
| iPhone 15 Pro | Safari | P1 |
| iPad Pro M4 | Safari | P2 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Web Bluetooth limited in Safari | Graceful fallback to wired MIDI |
| PWA service worker complexity | Start with cache-only strategy |
| Tone.js lazy load complexity | Test thoroughly, have sync fallback |
| 120Hz causing battery drain | Honor prefers-reduced-motion |

---

## Files Modified Per Phase

### Phase 1 (Foundation)
```
index.html
src/App.tsx
src/App.module.less
src/index.less
src/colors.less
src/audio-engine/synth.ts
src/audio-engine/controls.ts
src/components/Knob.tsx
src/components/Knob.module.less
```

### Phase 2 (Core UX)
```
src/components/sequencer/PianoRoll.tsx
src/components/sequencer/PianoRoll.module.less
src/components/sequencer/PatternStep.tsx
src/components/sequencer/Header.tsx
src/components/sequencer/Controls.tsx
```

### Phase 3 (Performance & PWA)
```
vite.config.ts
public/manifest.json (new)
public/icons/* (new)
public/splash/* (new)
src/service-worker.ts (new)
```

### Phase 4 (Advanced)
```
src/audio-engine/bluetooth-midi.ts (new)
src/audio-engine/midi-output.ts
src/components/sequencer/OutputSelector.tsx
```
