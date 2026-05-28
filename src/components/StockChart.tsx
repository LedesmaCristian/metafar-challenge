import * as React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { TwelveDataTimeSeriesResponse, TwelveDataOHLCV } from '@/api/types';

interface ChartProps {
  stockData: TwelveDataTimeSeriesResponse;
}

const StockChart: React.FC<ChartProps> = React.memo(({ stockData }) => {
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

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
});

StockChart.displayName = 'StockChart';

export default StockChart;
