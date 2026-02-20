# Issue 6: PWA Support with iOS-Specific Optimizations

**Labels:** `enhancement`, `ios`, `pwa`, `priority:medium`

## Summary
Implement Progressive Web App features optimized for iOS Safari standalone mode.

## Problem
iOS Safari supports PWA features but with specific requirements:
- Need Apple-specific meta tags
- Splash screens require specific configurations
- Status bar styling options
- No native install prompt (relies on manual "Add to Home Screen")

## Proposed Solution
1. Add Apple-specific PWA meta tags
2. Create splash screen images for all iPhone sizes
3. Implement `standalone` display mode detection
4. Add `apple-mobile-web-app-*` meta tags
5. Create app icons in required iOS sizes (180x180, etc.)

## Technical Details
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ACID Gen">
<link rel="apple-touch-icon" href="/icon-180.png">
<link rel="apple-touch-startup-image" href="/splash.png">
```

## Files to Modify
- `index.html`
- Add `public/manifest.json`
- Add icon assets to `public/`

## Dependencies
- Issue #4 (Safe Area) - standalone mode uses same viewport
- Issue #8 (Dark Mode) - theme color coordination

## Acceptance Criteria
- [ ] App installable via "Add to Home Screen"
- [ ] Custom splash screen displays on launch
- [ ] Status bar matches app theme
- [ ] Works offline with service worker
