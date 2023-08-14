import { type GeneratorState } from './store/generator';
import { type SequencerState } from './store/sequencer';
import { type TransportState } from './store/transport';
import { type SynthState } from './store/synth';

export interface State {
  transport: TransportState;
  sequencer: SequencerState;
  generator: GeneratorState;
  synth: SynthState;
}
