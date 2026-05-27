import * as React from 'react';
import SelectInput from './SelectInput';
import { IntervalSelectProps } from '../../types';

const IntervalSelect: React.FC<IntervalSelectProps> = ({ value, onChange, style }) => {
  const options = [
    { value: '1min', label: '1 minuto' },
    { value: '5min', label: '5 minutos' },
    { value: '15min', label: '15 minutos' },
  ];

  return (
    <div style={style}>
      <label style={styles.label}>Intervalo:</label>
      <SelectInput value={value} onChange={onChange} options={options} />
    </div>
  );
};

const styles = {
  label: {
    marginRight: '5px',
  },
};

export default IntervalSelect;
