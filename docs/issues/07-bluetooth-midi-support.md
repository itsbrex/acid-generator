# Issue 7: MIDI over Bluetooth LE Support

**Labels:** `enhancement`, `ios`, `midi`, `priority:medium`

## Summary
Add support for Bluetooth MIDI devices on iOS, common for mobile music production.

## Problem
iOS musicians often use Bluetooth MIDI controllers. Current Web MIDI implementation may not:
- Properly detect BLE MIDI devices
- Handle connection/disconnection gracefully
- Support iOS-specific MIDI workflows

## Proposed Solution
1. Implement Web Bluetooth API for BLE MIDI discovery
2. Add UI for Bluetooth device pairing
3. Handle iOS permission prompts gracefully
4. Support background MIDI connection persistence
5. Add latency compensation for Bluetooth timing

## Technical Details
```typescript
// Request BLE MIDI device
const device = await navigator.bluetooth.requestDevice({
  filters: [{ services: ['03b80e5a-ede8-4b33-a751-6ce34ec4c700'] }] // MIDI service UUID
});
```

## Files to Modify
- `src/audio-engine/midi-output.ts`
- `src/components/sequencer/OutputSelector.tsx`
- Add `src/audio-engine/bluetooth-midi.ts`

## Dependencies
- Issue #1 (Web Audio API) - audio context must be initialized
- Issue #9 (Bundle Size) - new dependency considerations

## Acceptance Criteria
- [ ] BLE MIDI devices discoverable
- [ ] Stable connection maintained
- [ ] Latency compensation applied
- [ ] Graceful handling of disconnection
