import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { mapRange } from '../utils';

import styles from './Knob.module.less';

const minRadians = (4 * Math.PI) / 3;
const maxRadians = -Math.PI / 3;
const radius = 40;
const midX = 50;
const midY = 50;

interface Props {
  value: number;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  direction: 'vertical' | 'horizontal';
  onChange: (v: number) => void;
}

const Knob: FC<Props> = ({ value, min, max, onChange, direction }) => {
  const { rangePath: rP, valuePath: vP } = useMemo(() => {
    const zeroRadians = mapRange(
      min > 0 && max > 0 ? min : 0,
      min,
      max,
      minRadians,
      maxRadians,
    );
    const valueRadians = mapRange(value, min, max, minRadians, maxRadians);

    const minX = midX + Math.cos(minRadians) * radius;
    const minY = midY - Math.sin(minRadians) * radius;
    const maxX = midX + Math.cos(maxRadians) * radius;
    const maxY = midY - Math.sin(maxRadians) * radius;
    const zeroX = midX + Math.cos(zeroRadians) * radius;
    const zeroY = midY - Math.sin(zeroRadians) * radius;
    const valueX = midX + Math.cos(valueRadians) * radius;
    const valueY = midY - Math.sin(valueRadians) * radius;

    const largeArc = Math.abs(zeroRadians - valueRadians) < Math.PI ? 0 : 1;
    const sweep = valueRadians > zeroRadians ? 0 : 1;

    const rangePath = `M ${minX} ${minY} A ${radius} ${radius} 0 1 1 ${maxX} ${maxY}`;
    const valuePath = `M ${zeroX} ${zeroY} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${valueX} ${valueY}`;

    return { rangePath, valuePath };
  }, [value, min, max]);

  const handleMouseDown = useCallback(
    ({ pageX: startX, pageY: startY }: ReactMouseEvent) => {
      console.info('mouseDown', startX, startY);

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const { pageX, pageY } = e;
        const newValue =
          value + (direction === 'horizontal' ? pageX - startX : startY - pageY);
        onChange(newValue >= max ? max : newValue <= min ? min : newValue);
      };

      const handleMouseUp = () => {
        console.info('mouseUp');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    },
    [direction, value, min, max, onChange],
  );

  return (
    <div>
      <svg width={100} height={100} onMouseDown={handleMouseDown}>
        <path d={rP}></path>
        <path d={vP}></path>
      </svg>
    </div>
  );
};

const KnobComponent: FC<Props & { label: string }> = ({
  value,
  min,
  max,
  step,
  onChange,
  defaultValue,
  direction,
  label,
}) => {
  const [inputVal, setInputVal] = useState<number>(value || defaultValue);

  useEffect(() => {
    setInputVal(value || defaultValue);
  }, [setInputVal, value, defaultValue]);

  const handleOnSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onChange(inputVal);
    },
    [inputVal, onChange],
  );

  const handleKnobChange = useCallback(
    (val: number) => {
      onChange(val);
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) =>
      setInputVal(Number(value)),
    [setInputVal],
  );

  return (
    <form className={styles.knobWrapper} onSubmit={handleOnSubmit}>
      <label>
        <header>{label}</header>
        <Knob
          value={inputVal}
          min={min || defaultValue}
          max={max || defaultValue}
          step={1}
          defaultValue={defaultValue}
          onChange={handleKnobChange}
          direction={direction}
        />
        <input
          type="number"
          value={inputVal}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
        />
      </label>
    </form>
  );
};

export default KnobComponent;
