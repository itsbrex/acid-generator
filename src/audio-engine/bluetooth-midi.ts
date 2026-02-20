// These imports will be used when full BLE MIDI output integration is implemented
// import { store } from '../store';
// import { addMidiOutput } from '../store/sequencer';

const BLE_MIDI_SERVICE = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const BLE_MIDI_CHARACTERISTIC = '7772e5db-3868-4112-a1a9-f2669d106bf3';

/**
 * Check if Web Bluetooth API is supported in the current browser.
 * Note: Web Bluetooth has limited support, especially in Safari/iOS.
 * Chrome on Android and desktop has the best support.
 */
export const isBluetoothMidiSupported = (): boolean => {
  return 'bluetooth' in navigator;
};

/**
 * Request a Bluetooth MIDI device from the user.
 * This will trigger the browser's Bluetooth device picker dialog.
 *
 * @returns The selected BluetoothDevice or null if cancelled/unsupported
 */
export const requestBluetoothMidiDevice = async (): Promise<BluetoothDevice | null> => {
  if (!isBluetoothMidiSupported()) {
    console.warn('Web Bluetooth API not supported');
    return null;
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BLE_MIDI_SERVICE] }],
      optionalServices: [BLE_MIDI_SERVICE],
    });

    console.log('Bluetooth MIDI device connected:', device.name);
    return device;
  } catch (error) {
    console.error('Bluetooth MIDI connection failed:', error);
    return null;
  }
};

/**
 * Connect to a Bluetooth MIDI device and set up the GATT connection.
 * Note: Full BLE MIDI implementation requires GATT server connection
 * and characteristic write operations. This is a foundation.
 *
 * @param device The BluetoothDevice to connect to
 */
export const connectBluetoothMidi = async (device: BluetoothDevice): Promise<void> => {
  try {
    const server = await device.gatt?.connect();
    const service = await server?.getPrimaryService(BLE_MIDI_SERVICE);
    const characteristic = await service?.getCharacteristic(BLE_MIDI_CHARACTERISTIC);

    if (characteristic) {
      console.log('BLE MIDI characteristic found');
      // In a full implementation, you would:
      // 1. Create a wrapper that implements MIDIOutput interface
      // 2. Use characteristic.writeValue() to send MIDI messages
      // 3. Add latency compensation (~30-50ms for Bluetooth)

      // For now, we log the connection success
      // Future implementation would create a BLE MIDI output wrapper:
      // const bleMidiOutput = createBleMidiOutput(device, characteristic);
      // store.dispatch(addMidiOutput({ port: bleMidiOutput, selected: false, channel: 0 }));
    }
  } catch (error) {
    console.error('BLE MIDI connection error:', error);
  }
};

/**
 * Scan for and connect to a Bluetooth MIDI device.
 * This is a convenience function that combines device selection and connection.
 */
export const scanAndConnectBluetoothMidi = async (): Promise<void> => {
  const device = await requestBluetoothMidiDevice();
  if (device) {
    await connectBluetoothMidi(device);
  }
};
