# Issue 2: Touch-Optimized Piano Roll for iPhone

**Labels:** `enhancement`, `ios`, `ux`, `priority:high`

## Summary
Redesign the PianoRoll component with iOS touch interactions and gestures in mind.

## Problem
Current piano roll is designed for mouse interaction. iPhone users need:
- Larger touch targets (minimum 44x44pt per Apple HIG)
- Gesture support (swipe, pinch-to-zoom)
- Momentum scrolling
- Haptic feedback on note selection

## Proposed Solution
1. Increase step cell size to minimum 44pt on mobile
2. Add pinch-to-zoom for pattern length navigation
3. Implement horizontal swipe with momentum scrolling
4. Add haptic feedback via `navigator.vibrate()` or Taptic Engine API
5. Support multi-touch for editing multiple notes

## Technical Details
```typescript
// Use touch-action CSS for gesture control
.pianoRoll {
  touch-action: pan-x pan-y pinch-zoom;
  -webkit-overflow-scrolling: touch;
}
```

## Files to Modify
- `src/components/sequencer/PianoRoll.tsx`
- `src/components/sequencer/PianoRoll.module.less`
- `src/components/sequencer/PatternStep.tsx`

## Dependencies
- Issue #4 (Safe Area Support) - layout constraints affect sizing

## Acceptance Criteria
- [ ] All touch targets meet 44pt minimum
- [ ] Smooth 60fps scrolling
- [ ] Haptic feedback on note toggle
- [ ] Pinch-to-zoom works for pattern navigation
