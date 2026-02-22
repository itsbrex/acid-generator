# CLAUDE.md

This document provides guidance for AI assistants working with the ACID Pattern Generator codebase.

## Project Overview

The ACID Pattern Generator is a web-based music sequencer for creating TB-303-style acid house sequences. Inspired by "STING by SKINNERBOX" Max for Live device, it features algorithmic pattern generation with interactive editing.

**Live demo:** https://itsbrex.github.io/acid-generator/

### Key Features
- Generative pattern sequencer with density, spread, accents, and slides controls
- 16/32/64-step sequencer with piano roll interface
- Built-in TB-303 style synthesizer (Tone.js)
- MIDI output support for external hardware
- Pattern storage and management
- 20+ musical scales

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.0.2 (strict mode) |
| UI | React 18.2.0 (functional components, hooks) |
| State | Redux Toolkit 1.9.5 |
| Audio | Tone.js 14.7.77, @tonejs/midi 2.0.28 |
| Music Theory | tonal 5.0.0 |
| Styling | LESS 4.1.3, CSS Modules |
| Build | Vite 4.4.0 |
| Linting | ESLint 8.44.0, Prettier 2.5.1 |

## Project Structure

```
src/
├── audio-engine/           # Core audio and music logic
│   ├── generator.ts        # Pattern generation algorithm
│   ├── synth.ts            # TB-303 MonoSynth configuration
│   ├── controls.ts         # Transport, playback, synth controls
│   ├── scales.ts           # Musical scale definitions (SCALE enum)
│   ├── midi-output.ts      # Web MIDI API integration
│   └── editors.ts          # Pattern editing functions
├── components/             # React UI components
│   ├── sequencer/          # Sequencer sub-components
│   │   ├── PianoRoll.tsx   # Main pattern display grid
│   │   ├── PatternStep.tsx # Individual step cell
│   │   ├── Header.tsx      # Pattern name, download, shift
│   │   ├── Footer.tsx      # Scale and output selector
│   │   └── Controls.tsx    # Synth parameter knobs
│   ├── GeneratorControls.tsx   # Pattern generation knobs
│   ├── Sequencer.tsx       # Main sequencer container
│   ├── Knob.tsx            # Custom rotary knob control
│   ├── StoredPatterns.tsx  # Pattern browser/manager
│   └── About.tsx           # Info panel (markdown)
├── store/                  # Redux slices
│   ├── generator.ts        # Generation parameters
│   ├── sequencer.ts        # Pattern and MIDI state
│   ├── transport.ts        # Playback state
│   └── synth.ts            # Synth parameters
├── App.tsx                 # Root component
├── store.ts                # Redux store configuration
├── types.ts                # TypeScript type definitions
├── constants.ts            # Default values and ranges
├── utils.ts                # Utility functions
└── localStorage.ts         # State persistence
```

## Development Commands

```bash
npm run dev      # Start dev server (Vite + hot reload)
npm run build    # TypeScript compile + production build
npm run lint     # ESLint with auto-fix
npm run preview  # Preview production build
```

## Code Conventions

### TypeScript
- Strict mode enabled - no implicit `any`
- Use type imports: `import { type Foo }` (enforced by ESLint)
- Generic constraints for type safety (see `SequenceStep<T>`)
- Avoid `any`, prefer union types

### React Components
- Functional components only (no class components)
- Use hooks: `useMemo`, `useCallback` for performance
- Props passed via explicit destructuring
- Component files use `.tsx` extension

### Styling
- LESS preprocessor with CSS Modules
- Component styles: `ComponentName.module.less`
- Colors defined in `src/colors.less`
- Mixins in `src/styles/mixins.less`

### Formatting (Prettier)
- 90 character line width
- Single quotes, trailing commas
- Semicolons required
- 2-space indentation

### ESLint Rules
- No circular imports (`import/no-cycle`)
- React hooks rules enforced
- Consistent type imports required
- Prettier integration for formatting

## Architecture Patterns

### Redux State Structure
```typescript
interface State {
  transport: TransportState;   // currentStep, playing, tempo
  sequencer: SequencerState;   // pattern, scale, outputs, storedPatterns
  generator: GeneratorState;   // density, spread, accents, slides, length
  synth: SynthState;           // cutoff, resonance, delaySend
}
```

### State Persistence
Custom Redux middleware persists state to localStorage on every action except playback updates (`setPlaying`, `setStep`) to avoid performance issues.

### Audio Engine
- `Tone.Transport` drives timing with `scheduleRepeat` on 16th notes
- Pattern is an array of `SequenceStep` objects
- Scale-agnostic note indices (0-6) mapped to MIDI notes via `scales.ts`
- MIDI output via Web MIDI API with fallback to internal synth

### SequenceStep Type
```typescript
interface SequenceStep<T extends Unit.Note | null = Unit.Note | null> {
  note: T extends null ? T : number;    // 0-6 scale degree
  octave: T extends null ? T : Octave;  // -1, 0, or 1
  accent: T extends null ? T : boolean;
  slide: T extends null ? T : boolean;
}
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/audio-engine/generator.ts` | Core pattern generation algorithm |
| `src/audio-engine/synth.ts` | TB-303 MonoSynth with filter envelope |
| `src/audio-engine/controls.ts` | Transport control, note scheduling |
| `src/components/Knob.tsx` | Custom knob with SVG arc, mouse/touch/wheel |
| `src/store.ts` | Redux store with localStorage middleware |
| `src/constants.ts` | Default values (BPM, cutoff, ranges) |

## Common Tasks

### Adding a New Scale
1. Edit `src/audio-engine/scales.ts`
2. Add entry to `SCALE` enum
3. Add interval array to `scaleIntervals` object

### Modifying Pattern Generation
1. Edit `src/audio-engine/generator.ts`
2. Adjust algorithm in `generate()` function
3. Add new parameters to `GeneratorParams` interface

### Adding a Redux Action
1. Add action in appropriate slice (`src/store/*.ts`)
2. Use `createSlice` pattern with reducers
3. Export action creator and add to exports

### Adding UI Controls
1. Create component in `src/components/`
2. Use existing `Knob.tsx` or `Button.tsx` as examples
3. Connect to Redux via `useSelector`/`useDispatch`
4. Add LESS module for styling

## CI/CD

- **node.js.yml**: Runs on `dev` branch pushes/PRs, tests Node 16.x/18.x
- **gh-pages-publish.yml**: Deploys to GitHub Pages on `master` push
- **Husky pre-commit**: Runs `npm run lint` automatically

## Known TODOs (from codebase)

- Euclidean rhythm mode (dependency installed but not integrated)
- Polyend Play format export
- `euclidean-rhythms` package is imported but commented out in generator.ts

## Testing

No formal test suite is currently configured. The project relies on:
- TypeScript type checking
- ESLint static analysis
- Manual testing via dev server

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Start/stop playback |
| G | Generate new pattern |

## Environment Files

- `.env.dev`: Development mode (analytics disabled)
- `.env.prod`: Production mode (analytics enabled)

## Important Notes for AI Assistants

1. **Preserve audio timing**: Changes to `controls.ts` affect real-time playback
2. **Type safety**: The codebase uses conditional types - maintain them
3. **MIDI compatibility**: Test MIDI output when modifying sequencer logic
4. **State persistence**: Avoid adding high-frequency state updates to persistence
5. **Knob component**: Complex with mouse/touch/wheel events - modify carefully
6. **Scale-agnostic**: Note values are indices (0-6), not MIDI numbers
