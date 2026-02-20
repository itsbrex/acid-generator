# Optimize Bundle Size for Mobile Networks

**Labels:** `enhancement`, `ios`, `performance`, `priority:medium`

## Summary
Reduce initial bundle size and implement code splitting for faster load times on mobile networks.

## Problem
Mobile users on cellular may experience:
- Slow initial load times
- Data usage concerns
- Poor performance on slower connections

## Proposed Solution
1. Implement dynamic imports for heavy dependencies (Tone.js)
2. Add route-based code splitting
3. Optimize and compress assets
4. Implement resource hints (preload, prefetch)
5. Add loading states for lazy-loaded components

## Technical Details
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

## Files to Modify
- `vite.config.ts`
- `src/audio-engine/synth.ts`
- `src/App.tsx`

## Acceptance Criteria
- [ ] Initial bundle under 200KB gzipped
- [ ] Audio engine lazy-loaded
- [ ] Time to Interactive under 3s on 3G
- [ ] Proper loading states shown
