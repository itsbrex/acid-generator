import { type FC } from 'react';
import { type SequenceStep } from '../audio-engine/generator';
import { type SCALE } from '../audio-engine/scales';

import styles from './Pattern.module.less';
import PianoRoll from './PianoRoll';

const Pattern: FC<{ pattern: SequenceStep[]; currentStep: number; scaleName: SCALE }> = ({
  pattern,
  currentStep,
  scaleName,
}) => {
  return (
    <ul className={styles.pattern}>
      <li className={styles.step}>
        <ul>
          <li>
            <PianoRoll
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
                <PianoRoll
                  note={note}
                  scaleName={scaleName}
                  accent={accent}
                  slide={slide}
                  highlightScale={false}
                />
              </li>
              <li className={styles.cell}>{`${
                octave === 1 ? 'UP' : octave === -1 ? 'DW' : ''
              }`}</li>
              <li className={`${styles.cell} ${slide ? styles.slide : ''}`}>{slide}</li>
              <li className={`${styles.cell} ${accent ? styles.accent : ''}`}></li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default Pattern;
