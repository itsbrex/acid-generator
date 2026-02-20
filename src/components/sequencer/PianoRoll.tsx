import { type FC, useCallback } from 'react';
import { type SequenceStep } from '../../audio-engine/generator';
import { type SCALE } from '../../audio-engine/scales';
import PatternStep from './PatternStep';

import styles from './PianoRoll.module.less';
import { editNoteInPattern, switchToNextStep } from '../../audio-engine/editors';

// Trigger haptic feedback for touch devices
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

interface Props {
  pattern: SequenceStep[];
  currentStep: number;
  scaleName: SCALE;
}

const PianoRoll: FC<Props> = ({ pattern, currentStep, scaleName }) => {
  const handleOctaveClick = useCallback(
    (i: number) => {
      triggerHaptic();
      switchToNextStep('octave', pattern, i);
    },
    [pattern],
  );

  const handleSlideClick = useCallback(
    (i: number) => {
      triggerHaptic();
      switchToNextStep('slide', pattern, i);
    },
    [pattern],
  );

  const handleAccentClick = useCallback(
    (i: number) => {
      triggerHaptic();
      switchToNextStep('accent', pattern, i);
    },
    [pattern],
  );

  return (
    <ul className={styles.pattern}>
      <li className={styles.step}>
        <ul>
          <li>
            <PatternStep
              note={null}
              scaleName={scaleName}
              slide={false}
              accent={false}
              highlightScale={true}
            />
          </li>
          <li className={styles.cell}>O</li>
          <li className={styles.cell}>S</li>
          <li className={styles.cell}>A</li>
          <li className={styles.cell}>N</li>
        </ul>
      </li>
      {pattern.map(({ note, octave, accent, slide }, i) => {
        return (
          <li
            className={`${styles.step} ${i === currentStep ? styles.active : ''}`}
            key={`pattern-step-${i}`}
          >
            <ul>
              <li>
                <PatternStep
                  note={note}
                  scaleName={scaleName}
                  accent={accent}
                  slide={slide}
                  highlightScale={false}
                  setNote={(newNote) => {
                    editNoteInPattern(newNote, scaleName, pattern, i);
                  }}
                />
              </li>
              <li
                onClick={() => handleOctaveClick(i)}
                className={`${styles.cell} ${
                  octave === 1 ? styles.octaveUp : octave === -1 ? styles.octaveDown : ''
                } ${styles.canEdit}`}
              />
              <li
                onClick={() => handleSlideClick(i)}
                className={`${styles.cell} ${slide ? styles.slide : ''} ${
                  styles.canEdit
                }`}
              />
              <li
                onClick={() => handleAccentClick(i)}
                className={`${styles.cell} ${accent ? styles.accent : ''} ${
                  styles.canEdit
                }`}
              />
              <li className={styles.cell}>{i + 1}</li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export { type Props };

export default PianoRoll;
