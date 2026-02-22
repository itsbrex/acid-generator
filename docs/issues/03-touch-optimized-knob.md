# Issue 3: Optimized Knob Component for Touch Interaction

**Labels:** `enhancement`, `ios`, `ux`, `priority:high`

## Summary
Enhance the Knob component for precise touch control on iPhone, following iOS music app conventions.

## Problem
The current Knob component uses mouse events. For iOS music production:
- Need larger touch area
- Vertical drag is standard for iOS synth knobs
- Should support fine-tuning with slow drag
- Need visual feedback during interaction

## Proposed Solution
1. Implement vertical drag gesture (drag up = increase, down = decrease)
2. Add "fine tune" mode: slow drag = smaller increments
3. Increase touch target to 60x60pt minimum
4. Add visual scale/glow during active touch
5. Implement double-tap to reset to default value
6. Add haptic ticks at detent points

## Technical Details
```typescript
// Fine-tune sensitivity based on drag speed
const sensitivity = Math.abs(deltaY) < 2 ? 0.1 : 1.0;
```

## Files to Modify
- `src/components/Knob.tsx`
- `src/components/Knob.module.less`

## Dependencies
- None (self-contained component)

## Acceptance Criteria
- [ ] Smooth vertical drag control
- [ ] Fine-tune mode for precision
- [ ] Double-tap reset functionality
- [ ] Haptic feedback at value boundaries
