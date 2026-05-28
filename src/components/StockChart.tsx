import * as React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Box, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { TwelveDataTimeSeriesResponse, TwelveDataOHLCV } from '@/api/types';

interface ChartProps {
  stockData: TwelveDataTimeSeriesResponse;
}

const StockChart: React.FC<ChartProps> = React.memo(({ stockData }) => {
  const isEmpty = stockData.status === 'no_data' || stockData.values.length === 0;

  const chartOptions = React.useMemo(
    () => ({
      title: {
        text: stockData.meta.symbol,
      },
      xAxis: {
        categories: stockData.values.map((item: TwelveDataOHLCV) => item.datetime),
        title: { text: 'Interval' },
      },
      yAxis: {
        title: { text: 'Price' },
      },
      series: [
        {
          name: 'Interval',
          data: stockData.values.map((item: TwelveDataOHLCV) => parseFloat(item.close)),
        },
      ],
    }),
    [stockData],
  );

  if (isEmpty) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          py: 8,
        }}
      >
        <CalendarMonthIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
        <Typography fontWeight={600}>Sin datos para el período seleccionado</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Probá con un rango de fechas diferente o verificá que el mercado haya operado en ese
          período
        </Typography>
      </Box>
    );
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
});

StockChart.displayName = 'StockChart';

export default StockChart;
