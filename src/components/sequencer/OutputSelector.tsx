import { type ChangeEvent, type FC, useCallback, useMemo, useState } from 'react';
import { type SequencerOutput } from '../../types';
import { internalSynth } from '../../constants';
import { getOutput } from '../../utils';
import {
  isBluetoothMidiSupported,
  scanAndConnectBluetoothMidi,
} from '../../audio-engine/bluetooth-midi';

import styles from './OutputSelector.module.less';

interface Props {
  outputs: SequencerOutput[];
  onOutputChange: (id: string | undefined) => void;
}

const OutputSelector: FC<Props> = ({ outputs, onOutputChange }) => {
  const selected = useMemo(() => getOutput(outputs), [outputs]);
  const [isScanning, setIsScanning] = useState(false);
  const bluetoothSupported = useMemo(() => isBluetoothMidiSupported(), []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const {
        currentTarget: { value },
      } = e;
      onOutputChange(value);
    },
    [onOutputChange],
  );

  const handleBluetoothScan = useCallback(() => {
    setIsScanning(true);
    scanAndConnectBluetoothMidi().finally(() => {
      setIsScanning(false);
    });
  }, []);

  return (
    <div className={styles.outputContainer}>
      <label className={styles.outputSelector}>
        OUTPUT:
        <select onChange={handleChange} value={selected ? selected.port.id : undefined}>
          <option value={undefined} key={`output-${internalSynth}`}>
            INTERNAL
          </option>
          {outputs.map(({ port: { name, id } }) => {
            return (
              <option value={id} key={`output-${id}`}>
                {name}
              </option>
            );
          })}
        </select>
      </label>
      {bluetoothSupported && (
        <button
          className={styles.bluetoothButton}
          onClick={handleBluetoothScan}
          disabled={isScanning}
          title="Scan for Bluetooth MIDI devices"
        >
          {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
        </button>
      )}
    </div>
  );
};

export { type Props };

export default OutputSelector;
