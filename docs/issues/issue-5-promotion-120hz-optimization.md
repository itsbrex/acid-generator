# High Refresh Rate (ProMotion 120Hz) Optimization

**Labels:** `enhancement`, `ios`, `performance`, `priority:medium`

## Summary
Optimize animations and rendering for iPhone's 120Hz ProMotion display.

## Problem
iPhone 17 Pro Max supports 120Hz refresh rate. Current implementation may:
- Not take advantage of smoother animations
- Have janky step indicator movement
- Cause unnecessary battery drain with unoptimized renders

## Proposed Solution
1. Use CSS transforms for step indicator (GPU accelerated)
2. Implement `will-change` hints for animated elements
3. Use `requestAnimationFrame` properly for step updates
4. Add `prefers-reduced-motion` media query support
5. Optimize React re-renders with proper memoization

## Technical Details
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

## Files to Modify
- `src/components/sequencer/PianoRoll.tsx`
- `src/components/sequencer/PianoRoll.module.less`
- `src/audio-engine/controls.ts`

## Acceptance Criteria
- [ ] Consistent 120fps animations on ProMotion displays
- [ ] Reduced motion support for accessibility
- [ ] No dropped frames during playback
- [ ] Battery-efficient rendering
