# iOS Keyboard and Input Optimization

**Labels:** `enhancement`, `ios`, `ux`, `priority:low`

## Summary
Handle iOS virtual keyboard and text input edge cases for pattern naming and BPM input.

## Problem
iOS virtual keyboard can:
- Obscure input fields
- Cause viewport resize issues
- Have different behavior for number inputs
- Interfere with audio playback when appearing

## Proposed Solution
1. Use `inputmode="numeric"` for BPM input
2. Implement `visualViewport` API for keyboard detection
3. Scroll inputs into view when keyboard appears
4. Prevent viewport zoom on input focus
5. Use iOS-native input styling

## Technical Details
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

## Files to Modify
- `index.html`
- `src/components/sequencer/Header.tsx` (pattern name input)
- `src/components/sequencer/Controls.tsx` (BPM input if present)

## Acceptance Criteria
- [ ] Numeric keyboard for BPM input
- [ ] Inputs not obscured by keyboard
- [ ] No viewport zoom on focus
- [ ] Audio continues when keyboard appears
