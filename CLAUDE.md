# CLAUDE.md

This document provides guidance for AI assistants working with the ACID Pattern Generator codebase.

## Project Overview

The ACID Pattern Generator is a web-based music sequencer for creating TB-303-style acid house sequences. Inspired by "STING by SKINNERBOX" Max for Live device, it features algorithmic pattern generation with interactive editing.

**Live demo:** https://itsbrex.github.io/acid-generator/

### Key Features
- Generative pattern sequencer with density, spread, accents, and slides controls
- 16/32/64-step sequencer with piano roll interface
- Built-in TB-303 style synthesizer (Tone.js)
- MIDI output support for external hardware (Web MIDI API)
- Bluetooth MIDI support (WIP foundation in `bluetooth-midi.ts`)
- Pattern storage, management, and MIDI file export
- 18 musical scales
- PWA support with service worker
- iOS-specific audio handling (context unlock, background/foreground transitions)

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.0.2 (strict mode, ES2020 target) |
| UI | React 18.2.0 (functional components, hooks) |
| State | Redux Toolkit 1.9.5 |
| Audio | Tone.js 14.7.77, @tonejs/midi 2.0.28 |
| Music Theory | tonal 5.0.0 |
| Styling | LESS 4.1.3, CSS Modules |
| Build | Vite 4.4.0 (manual chunks for audio/vendor/music) |
| Linting | ESLint 8.44.0, Prettier 2.5.1 |
| Analytics | Piwik Pro (production only) |
| Naming | docker-names-ts (random pattern names) |

## Project Structure

```
acid-generator/
├── .github/workflows/
│   ├── node.js.yml              # CI: lint + build (Node 18.x, 20.x) on dev branch
│   └── gh-pages-publish.yml     # Deploy to GitHub Pages on master push
├── .husky/
│   └── pre-commit               # Runs `npm run lint` on commit
├── docs/
│   ├── IMPLEMENTATION-PLAN.md   # Implementation planning
│   └── issues/                  # Detailed issue tracking (iOS, PWA, Bluetooth, etc.)
├── public/
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── screenshots/                 # Desktop and mobile screenshots
├── src/
│   ├── audio-engine/            # Core audio and music logic
│   │   ├── bluetooth-midi.ts    # Bluetooth LE MIDI support (WIP)
│   │   ├── controls.ts          # Transport, playback, synth controls, MIDI export
│   │   ├── editors.ts           # Pattern editing functions
│   │   ├── generator.ts         # Pattern generation algorithm + SequenceStep type
│   │   ├── midi-output.ts       # Web MIDI API integration
│   │   ├── scales.ts            # Musical scale definitions (SCALE enum, 18 scales)
│   │   └── synth.ts             # TB-303 MonoSynth with PingPongDelay
│   ├── components/
│   │   ├── About.tsx            # Info panel (renders markdown)
│   │   ├── Button.tsx           # Keyboard-bindable button component
│   │   ├── GeneratorControls.tsx # Pattern generation parameter knobs
│   │   ├── Icons.tsx            # Centralized icon exports (react-icons)
│   │   ├── Knob.tsx             # Custom rotary knob (SVG arc, mouse/touch/wheel)
│   │   ├── Sequencer.tsx        # Main sequencer container
│   │   ├── StoredPatterns.tsx   # Pattern browser/manager
│   │   └── sequencer/           # Sequencer sub-components
│   │       ├── ChannelSelector.tsx   # MIDI channel selector
│   │       ├── Controls.tsx          # Synth parameter controls wrapper
│   │       ├── Footer.tsx            # Scale and output selector
│   │       ├── Header.tsx            # Pattern name, download, shift
│   │       ├── OutputSelector.tsx    # MIDI output selection
│   │       ├── PatternStep.tsx       # Individual step cell
│   │       ├── PianoRoll.tsx         # Main pattern display grid
│   │       ├── PlayControls.tsx      # Play button and tempo knob
│   │       ├── ScaleSelector.tsx     # Scale selection dropdown
│   │       └── SynthControls.tsx     # Synth parameter knobs
│   ├── store/                   # Redux slices
│   │   ├── generator.ts         # Generation parameters
│   │   ├── sequencer.ts         # Pattern, scale, MIDI state
│   │   ├── synth.ts             # Synth parameters
│   │   └── transport.ts         # Playback state
│   ├── styles/
│   │   └── mixins.less          # Shared LESS mixins
│   ├── App.tsx                  # Root component
│   ├── App.module.less          # Root component styles
│   ├── colors.less              # Color variable definitions
│   ├── constants.ts             # Default values, ranges, base note
│   ├── index.less               # Global styles
│   ├── localStorage.ts          # State persistence (load/save)
│   ├── main.tsx                 # React DOM entry, Piwik Pro init, SW registration
│   ├── store.ts                 # Redux store + localStorage middleware
│   ├── types.ts                 # Shared TypeScript types (Pattern, SequencerOutput, DIRECTION)
│   ├── utils.ts                 # Utility functions (scale mapping, iOS detection, hooks)
│   └── vite-env.d.ts            # Vite type declarations
├── .env.dev                     # NODE_ENV=development (analytics disabled)
├── .env.prod                    # NODE_ENV=production (analytics enabled)
├── .eslintrc.cjs                # ESLint config
├── .prettierrc.json             # Prettier config
├── index.html                   # HTML entry point (PWA meta tags)
├── tsconfig.json                # TypeScript config (strict, ES2020)
├── tsconfig.node.json           # Node-specific TypeScript config (for vite.config.ts)
└── vite.config.ts               # Vite build config (manual chunks, eslint plugin)
```

## Development Commands

```bash
npm run dev      # Start dev server (Vite + hot reload, dev mode)
npm run build    # TypeScript compile + production build
npm run lint     # ESLint with auto-fix (zero warnings enforced)
npm run preview  # Preview production build
```

## Code Conventions

### TypeScript
- Strict mode enabled — no implicit `any`, `noUnusedLocals`, `noUnusedParameters`
- Use type imports: `import { type Foo }` (enforced by ESLint `consistent-type-imports`)
- Generic constraints for type safety (see `SequenceStep<T>`)
- Avoid `any`, prefer union types
- `@ts-ignore` allowed only with description (`ban-ts-comment` rule)

### React Components
- Functional components only (no class components)
- Use hooks: `useMemo`, `useCallback` for performance
- Props passed via explicit destructuring
- Component files use `.tsx` extension
- `Button` component supports keyboard binding via `bindKey` prop (uses `e.code` values)

### Styling
- LESS preprocessor with CSS Modules
- Component styles: `ComponentName.module.less` (co-located with component)
- Colors defined in `src/colors.less`
- Mixins in `src/styles/mixins.less`

### Formatting (Prettier — `.prettierrc.json`)
- 90 character print width
- Single quotes, trailing commas (`all`)
- Semicolons required
- 2-space indentation
- End of line: auto

### ESLint Rules (`.eslintrc.cjs`)
- No circular imports (`import/no-cycle` — error)
- React hooks rules enforced
- Consistent type imports required (`inline-type-imports` fix style)
- Prettier integration for formatting
- `@typescript-eslint/no-non-null-assertion` is off (non-null assertions allowed)
- `react-refresh/only-export-components` — warn

## Architecture Patterns

### Redux State Structure
```typescript
// src/store.ts
interface State {
  transport: TransportState;   // currentStep, playing, tempo
  sequencer: SequencerState;   // pattern, name, scale, storedPatterns, options
  generator: GeneratorState;   // density, spread, accents, slides, length, flags
  synth: SynthState;           // cutoff, resonance, delaySend
}
```

**TransportState** (`src/store/transport.ts`):
- `currentStep: number` — current playback position (-1 when stopped)
- `playing: boolean` — playback state
- `tempo: number` — BPM (default: 120, range: 30–240)

**GeneratorState** (`src/store/generator.ts`):
- `dispatchGenerate: boolean` — deferred generation flag (generates at next bar start)
- `patternLength: number` — 16/32/64 steps (default: 16)
- `density: number` — note density 0–100 (default: 100)
- `spread: number` — pitch spread 0–100 (default: 100)
- `accentsDensity: number` — accent probability 0–100 (default: 50)
- `slidesDensity: number` — slide probability 0–100 (default: 50)
- `startWithNote: boolean` — force first step to have a note
- `startWithAccent: boolean` — force first step to have an accent

**SequencerState** (`src/store/sequencer.ts`):
- `pattern: SequenceStep[]` — the active pattern
- `name: string` — pattern name (random docker name)
- `scale: SCALE` — active musical scale (default: PHRYGIAN)
- `storedPatterns: Pattern[]` — saved patterns
- `options.baseNote: number` — MIDI root note (default: 48 = C3)
- `options.gate: number` — note gate length (default: 0.8)
- `options.output.midi: MIDIAccess | null` — Web MIDI interface
- `options.output.outputs: SequencerOutput[]` — available MIDI outputs

**SynthState** (`src/store/synth.ts`):
- `cutoff: number` — filter frequency in Hz (default: 220, range: 110–880)
- `resonance: number` — filter Q (default: 3, range: 0–9)
- `delaySend: number` — delay send in dB (default: -18, range: -80 to -1)

### State Persistence
Custom Redux middleware in `src/store.ts` persists the full state to `localStorage` on every action **except** `setPlaying` and `setStep` (high-frequency playback updates). On startup, `src/localStorage.ts` loads persisted state and merges it with defaults.

### Audio Engine
- `Tone.Transport` drives timing with `scheduleRepeat` on 16th notes (`controls.ts:212`)
- Pattern is an array of `SequenceStep` objects
- Scale-agnostic note indices (0–6) mapped to MIDI notes via `SCALES` in `scales.ts`
- MIDI output via Web MIDI API with fallback to internal TB-303 MonoSynth
- TB-303 synth: sawtooth oscillator → lowpass filter (-24dB) → split → PingPongDelay (8n., 0.6 feedback)
- Deferred generation: if playing, new pattern generates at next bar boundary (step 0)
- MIDI file export via `@tonejs/midi` (`downloadPattern` in `controls.ts`)

### iOS Audio Handling
- AudioContext starts suspended on iOS Safari — unlocked via first-touch event in `App.tsx`
- Visibility change handler in `controls.ts` pauses transport when backgrounded and resumes when foregrounded
- `isIOS()` utility in `utils.ts` for platform detection
- `useIOSKeyboardDismiss` hook for input field keyboard dismiss on Enter

### SequenceStep Type
```typescript
// src/audio-engine/generator.ts
type Octave = -1 | 0 | 1;

interface SequenceStep<T extends Unit.Note | null = Unit.Note | null> {
  note: T extends null ? T : number;    // 0–6 scale degree index
  octave: T extends null ? T : Octave;  // -1, 0, or 1
  accent: T extends null ? T : boolean;
  slide: T extends null ? T : boolean;
}
```

When `T` is `null`, all fields are `null` (rest step). When `T` is `Unit.Note`, fields have their active types.

### Shared Types
```typescript
// src/types.ts
type Pattern = { pattern: SequenceStep[]; name: string; scale: SCALE };
type SequencerOutput = { port: MIDIOutput; selected: boolean; channel: number };
enum DIRECTION { LEFT = 'left', RIGHT = 'right' }
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/audio-engine/generator.ts` | Core pattern generation algorithm, `SequenceStep` type |
| `src/audio-engine/synth.ts` | TB-303 MonoSynth + PingPongDelay configuration |
| `src/audio-engine/controls.ts` | Transport control, note scheduling, MIDI file export |
| `src/audio-engine/scales.ts` | 18 musical scales (`SCALE` enum + `SCALES` interval map) |
| `src/audio-engine/bluetooth-midi.ts` | Bluetooth LE MIDI support (WIP foundation) |
| `src/components/Knob.tsx` | Custom knob with SVG arc, mouse/touch/wheel input |
| `src/components/Button.tsx` | Keyboard-bindable button (`bindKey` prop uses `KeyboardEvent.code`) |
| `src/store.ts` | Redux store with localStorage persistence middleware |
| `src/constants.ts` | Default values (BPM=120, cutoff=220, resonance=3) and ranges |
| `src/utils.ts` | Scale mapping, iOS detection, `useIOSKeyboardDismiss` hook |
| `src/localStorage.ts` | Load/save state from `localStorage` |
| `src/main.tsx` | Entry point: React render, Piwik Pro init, service worker registration |
| `vite.config.ts` | Build config: manual chunks (audio/vendor/music), eslint plugin |

## Musical Scales

18 scales are defined in `src/audio-engine/scales.ts`. Each maps 7 scale degrees to chromatic intervals:

**Diatonic modes:** Major, Minor, Dorian, Mixolydian, Lydian, Phrygian, Locrian
**Harmonic:** Harmonic Minor, Harmonic Major
**Melodic/Extended:** Melodic Minor, Lydian Augmented, Lydian Dominant, Dorian #4
**Exotic:** Phrygian Dominant, Hungarian Minor, Super Locrian, Spanish, Bhairav

Default scale: **Phrygian** (classic acid house).

## Common Tasks

### Adding a New Scale
1. Add entry to `SCALE` enum in `src/audio-engine/scales.ts`
2. Add 7-interval array to `SCALES` object (same file)
3. The scale will automatically appear in the `ScaleSelector` dropdown

### Modifying Pattern Generation
1. Edit `src/audio-engine/generator.ts`
2. Adjust algorithm in `generate()` function
3. Add new parameters to `GeneratorParams` interface
4. Wire new params through `src/store/generator.ts` (add state + reducer)
5. Connect UI controls in `src/components/GeneratorControls.tsx`

### Adding a Redux Action
1. Add action in appropriate slice (`src/store/*.ts`)
2. Use `createSlice` pattern with typed `CaseReducer` and `SliceCaseReducers`
3. Export action creator from the slice
4. Note: all slices use explicit `Reducers` interface extending `SliceCaseReducers<State>`

### Adding UI Controls
1. Create component in `src/components/`
2. Use existing `Knob.tsx` or `Button.tsx` as examples
3. Connect to Redux via `useSelector`/`useDispatch`
4. Add co-located `.module.less` file for styling

### Adding a Keyboard Shortcut
1. Use the `Button` component with `bindKey` prop
2. `bindKey` value should be a `KeyboardEvent.code` string (e.g., `"KeyG"`, `"Space"`)
3. The button will trigger on keypress events matching that code

## Build Configuration

### Vite (`vite.config.ts`)
- **Manual chunks** for optimal code splitting:
  - `audio`: tone, @tonejs/midi
  - `vendor`: react, react-dom, react-redux, @reduxjs/toolkit
  - `music`: tonal
- Chunk size warning limit: 500KB
- Base URL: empty string (for relative paths / GitHub Pages)
- ESLint plugin runs with auto-fix during dev
- Markdown files included as assets (`assetsInclude: ['**/*.md']`)

### TypeScript (`tsconfig.json`)
- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode with `noUnusedLocals` and `noUnusedParameters`
- JSX: react-jsx (automatic runtime)

## CI/CD

- **node.js.yml**: Runs on `dev` branch pushes/PRs, tests Node 18.x and 20.x (`npm ci` + `npm run build`)
- **gh-pages-publish.yml**: Deploys `dist/` to GitHub Pages on `master` push (Node 20, uses `actions/deploy-pages@v4`)
- **Husky pre-commit**: Runs `npm run lint` automatically before every commit

## Known TODOs (from codebase)

- **Euclidean rhythm mode**: `euclidean-rhythms` package installed but commented out in `generator.ts`
- **Polyend Play format export**: mentioned in README
- **Bluetooth MIDI**: Foundation exists in `bluetooth-midi.ts` (device scanning, GATT connection) but not integrated into the output pipeline
- **iOS optimization**: Tracked in `docs/issues/` (10 detailed issue documents covering audio API, touch, PWA, dark mode, bundle size)

## Testing

No formal test suite is currently configured. The project relies on:
- TypeScript strict mode type checking (`noUnusedLocals`, `noUnusedParameters`)
- ESLint static analysis (zero warnings enforced)
- Husky pre-commit lint hook
- Manual testing via dev server

## Keyboard Shortcuts

| Key | Action | Bound in |
|-----|--------|----------|
| Space | Start/stop playback | `PlayControls.tsx` via `Button` `bindKey="Space"` |
| G | Generate new pattern | `GeneratorControls.tsx` via `Button` `bindKey="KeyG"` |

## Environment Files

- `.env.dev`: `NODE_ENV=development` (Piwik Pro analytics disabled)
- `.env.prod`: `NODE_ENV=production` (Piwik Pro analytics enabled)

## Important Notes for AI Assistants

1. **Preserve audio timing**: Changes to `controls.ts` affect real-time playback — `Transport.scheduleRepeat` on 16th notes is the core timing loop
2. **Type safety**: The codebase uses conditional types (`SequenceStep<T>`) — maintain them; null steps and active steps have different field types
3. **MIDI compatibility**: Test MIDI output when modifying sequencer logic; both internal synth and external MIDI ports must be handled
4. **State persistence**: Avoid adding high-frequency state updates to persistence — only `setPlaying` and `setStep` are excluded; adding more exclusions requires editing the middleware in `store.ts`
5. **Knob component**: Complex with mouse/touch/wheel events — modify carefully
6. **Scale-agnostic**: Note values are indices (0–6 into the scale array), not MIDI numbers; the `getNoteInScale` utility in `utils.ts` converts to absolute MIDI notes
7. **iOS considerations**: Audio context unlock, visibility change handling, and keyboard dismiss are already implemented — extend rather than replace these patterns
8. **Deferred generation**: When playing, `generatePattern()` sets `dispatchGenerate` flag; the actual generation happens at step 0 of the next loop — don't break this mechanism
9. **Pattern names**: Generated using `docker-names-ts` — new patterns get random Docker-style names
10. **Pre-commit hook**: `npm run lint` runs automatically — ensure code passes ESLint before committing
