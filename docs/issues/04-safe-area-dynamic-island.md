# Issue 4: Safe Area and Notch/Dynamic Island Support

**Labels:** `enhancement`, `ios`, `layout`, `priority:high`

## Summary
Implement proper safe area insets for iPhone 17 Pro Max Dynamic Island and rounded corners.

## Problem
iPhone 17 Pro Max has:
- Dynamic Island at top
- Rounded screen corners
- Home indicator at bottom
- Content can be obscured without safe area handling

## Proposed Solution
1. Use `env(safe-area-inset-*)` CSS variables
2. Add viewport meta tag with `viewport-fit=cover`
3. Implement safe area padding for all UI edges
4. Ensure controls aren't obscured by Dynamic Island
5. Keep transport controls above home indicator

## Technical Details
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

## Files to Modify
- `index.html`
- `src/App.module.less`
- `src/index.less`

## Dependencies
- None (foundational layout)

## Acceptance Criteria
- [ ] No content hidden behind Dynamic Island
- [ ] Transport controls visible above home indicator
- [ ] Full-bleed design with safe content areas
- [ ] Landscape orientation properly handled
