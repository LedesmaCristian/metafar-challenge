import React from 'react';
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { getCurrentDay } from '@/helpers';
import { INTERVALS, DEFAULT_INTERVAL } from '@/constants';

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
  const [interval, setInterval] = React.useState<string>(DEFAULT_INTERVAL);
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

  const handleIntervalChange = React.useCallback((event: SelectChangeEvent<string>) => {
    setInterval(event.target.value);
  }, []);

  const handleStartDateChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  }, []);

  const handleEndDateChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  }, []);

  const handleModeChange = React.useCallback(
    (_: React.MouseEvent<HTMLElement>, value: string | null) => {
      if (value === null) return; // prevent deselect
      const rt = value === 'realtime';
      if (rt) {
        const today = getCurrentDay();
        setStartDate(today);
        setEndDate(today);
      }
      setIsRealTime(rt);
    },
    [],
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }} noValidate>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {symbol}
          {stockName ? ` — ${stockName}` : ''}
        </Typography>
        {stockCurrency && (
          <Typography variant="body2" color="text.secondary">
            Moneda: {stockCurrency}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <ToggleButtonGroup
          value={isRealTime ? 'realtime' : 'history'}
          exclusive
          onChange={handleModeChange}
          size="small"
          color="primary"
          sx={{ flexShrink: 0 }}
        >
          <ToggleButton value="realtime">Tiempo Real</ToggleButton>
          <ToggleButton value="history">Histórico</ToggleButton>
        </ToggleButtonGroup>

        {/* Date inputs — disabled in real-time mode */}
        <TextField
          label="Fecha inicio"
          type="datetime-local"
          value={startDate}
          onChange={handleStartDateChange}
          disabled={isRealTime}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Fecha fin"
          type="datetime-local"
          value={endDate}
          onChange={handleEndDateChange}
          disabled={isRealTime}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120, flexShrink: 0 }}>
          <InputLabel id="interval-label">Intervalo</InputLabel>
          <Select
            labelId="interval-label"
            value={interval}
            onChange={handleIntervalChange}
            label="Intervalo"
          >
            {INTERVALS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ flexShrink: 0, width: 160, ml: { md: 'auto' } }}
        >
          Graficar
        </Button>
      </Box>

      {isRealTime && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          El gráfico se actualiza automáticamente según el intervalo seleccionado.
        </Typography>
      )}
    </Box>
  );
};

export default StockPreferenceForm;
