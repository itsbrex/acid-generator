import { type FC, useCallback } from 'react';
import { SCALE, SCALES } from '../../audio-engine/scales';
import { getNoteInScale } from '../../utils';

import styles from './PatternStep.module.less';
import { noteMatchScale } from '../../audio-engine/editors';

// Trigger haptic feedback for touch devices
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

const OCTAVE = 12;
const NOTES = Array(OCTAVE).fill(1);
const WHITE_KEYS = SCALES[SCALE.MAJOR];

const PatternStep: FC<{
  note: number | null;
  scaleName: SCALE;
  accent: boolean | null;
  slide: boolean | null;
  highlightScale: boolean;
  setNote?: (v: number) => void;
}> = ({ note, scaleName, highlightScale, accent, slide, setNote }) => {
  const scale = SCALES[scaleName];

  const handleNoteClick = useCallback(
    (i: number) => {
      if (setNote) {
        triggerHaptic();
        setNote(i);
      }
    },
    [setNote],
  );

  return (
    <ul className={styles.pianoRoll}>
      {NOTES.map((_v, i) => {
        const r = i % OCTAVE;
        return (
          <li
            onClick={() => handleNoteClick(i)}
            className={`${styles.key} ${
              highlightScale && scale.includes(r) ? styles.inkey : ''
            } ${highlightScale && WHITE_KEYS.includes(r) ? styles.white : styles.black} ${
              getNoteInScale(note, scaleName) === i ? styles.active : ''
            } ${accent ? styles.accent : ''} ${slide ? styles.slide : ''} ${
              noteMatchScale(i, scaleName) ? styles.canEdit : styles.cannotEdit
            }`}
            key={`piano-roll-${i}`}
          />
        );
      })}
    </ul>
  );
};

export default PatternStep;
