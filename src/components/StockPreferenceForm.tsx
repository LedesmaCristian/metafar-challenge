import React from 'react';
import { RadioButton, DateInput, IntervalSelect, Button } from './atomics/index';
import { getCurrentDay } from '../helpers';

export interface StockQuoteParams {
  interval: string;
  startDate: string;
  endDate: string;
  isRealTime: boolean;
}

interface StockPreferenceFormProps {
  symbol: string;
  stockName?: string | undefined;
  stockCurrency?: string | undefined;
  onParamsChange: (params: StockQuoteParams) => void;
}

const StockPreferenceForm: React.FC<StockPreferenceFormProps> = ({
  symbol,
  stockName,
  stockCurrency,
  onParamsChange,
}) => {
  const [interval, setInterval] = React.useState<string>('5min');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [isRealTime, setIsRealTime] = React.useState<boolean>(true);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onParamsChange({ interval, startDate, endDate, isRealTime });
    },
    [onParamsChange, interval, startDate, endDate, isRealTime],
  );

  const handleIntervalChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(event.target.value);
  }, []);

  const handleStartDateChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  }, []);

  const handleEndDateChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  }, []);

  const handleCheckboxChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const rt = event.target.value === 'realtime';
    if (rt) {
      const today = getCurrentDay();
      setStartDate(today);
      setEndDate(today);
    }
    setIsRealTime(rt);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #ccc',
        padding: '10px',
        marginBottom: '20px',
      }}
    >
      <div style={styles.headerContainer}>
        <div style={styles.headerTitle}>
          {symbol}
          {stockName ? ` - ${stockName}` : ''}
          {stockCurrency ? ` - ${stockCurrency}` : ''}
        </div>
        <div style={styles.headerUser}>Usuario: Juan</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={styles.radioContainer}>
          <RadioButton
            name="dataOption"
            value="realtime"
            checked={isRealTime}
            onChange={handleCheckboxChange}
            label="Tiempo Real"
          />
          <span style={styles.description}>
            (utiliza la fecha actual, al graficar esta opción, se debe actualizar el gráfico en
            forma automática según el intervalo seleccionado)
          </span>
        </div>
        <div style={styles.radioContainer}>
          <RadioButton
            name="dataOption"
            value="history"
            checked={!isRealTime}
            onChange={handleCheckboxChange}
            label="Histórico"
          />
          <div style={styles.dateInputContainer}>
            <DateInput
              disabled={isRealTime}
              value={startDate}
              onChange={handleStartDateChange}
              style={styles.dateInput}
            />
            <DateInput
              disabled={isRealTime}
              value={endDate}
              onChange={handleEndDateChange}
              style={styles.dateInput}
            />
          </div>
        </div>
        <IntervalSelect
          value={interval}
          onChange={handleIntervalChange}
          style={styles.intervalSelect}
        />
        <Button variant="contained" type="submit" style={styles.button}>
          Graficar
        </Button>
      </div>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  headerUser: {
    marginTop: '10px',
    fontSize: '18px',
    textAlign: 'right',
  },
  description: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '5px',
  },
  radioContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  dateInputContainer: {
    margin: '0px 5px',
  },
  dateInput: {
    padding: '5px',
    fontSize: '14px',
    margin: '10px 0px',
  },
  intervalSelect: {
    padding: '5px',
    fontSize: '17px',
    marginBottom: '10px',
  },
  button: {
    padding: '5px 10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default StockPreferenceForm;
