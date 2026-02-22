# Issue 8: Dark Mode and OLED Optimization

**Labels:** `enhancement`, `ios`, `design`, `priority:medium`

## Summary
Implement system-aware dark mode with true black backgrounds for iPhone OLED displays.

## Problem
iPhone uses OLED displays where true black (#000000) pixels are completely off:
- Saves battery
- Reduces eye strain in dark environments
- Expected behavior for iOS apps

## Proposed Solution
1. Detect system dark mode via `prefers-color-scheme`
2. Use true black (#000000) for backgrounds
3. Ensure sufficient contrast ratios (WCAG AA minimum)
4. Add subtle borders/separators for depth
5. Optimize accent colors for OLED vibrancy

## Technical Details
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #1c1c1e; /* iOS system gray */
    --accent: #30d158; /* iOS green */
  }
}
```

## Files to Modify
- `src/colors.less`
- `src/index.less`
- All component `.module.less` files

## Dependencies
- None (can be done independently)

## Acceptance Criteria
- [ ] Automatic dark/light mode switching
- [ ] True black backgrounds in dark mode
- [ ] WCAG AA contrast compliance
- [ ] Matches iOS system appearance
