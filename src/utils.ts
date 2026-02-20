import { type RefObject, useEffect } from 'react';
import { type SCALE, SCALES } from './audio-engine/scales';
import { type SequencerOutput } from './types';

/**
 * Detect iOS devices (iPhone, iPad, iPod) for Web Audio API workarounds.
 * iOS Safari requires user interaction to unlock audio context and has
 * specific behavior when the app is backgrounded.
 */
export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

export const arrayRand = (arr: number[], l: number): number[] => {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, l);
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  if (value <= inMin) return outMin;
  if (value >= inMax) return outMax;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

type NullOrNumber<T> = T extends number ? number : null;

export const getNoteInScale = <T extends number | null>(
  note: T,
  scaleName: SCALE,
  root = 0,
  octave = 0,
): NullOrNumber<T> => {
  if (note === null) {
    return null as NullOrNumber<T>;
  }
  return (SCALES[scaleName][note] + root + 12 * octave) as NullOrNumber<T>;
};

export const getOutput = (outputs: SequencerOutput[]): SequencerOutput | undefined =>
  outputs.find(({ selected }) => selected);

/**
 * Custom hook to dismiss iOS virtual keyboard on Enter key press.
 * Useful for input fields where pressing Enter should blur the input
 * and dismiss the keyboard on iOS devices.
 */
export const useIOSKeyboardDismiss = (inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    };
    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [inputRef]);
};
