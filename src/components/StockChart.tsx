import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IStockData, IValuesStockData } from "../types";

interface IChartProps {
  stockData: IStockData;
}

const ChartScreen: React.FC<IChartProps> = React.memo(({ stockData }) => {
  const chartOptions = React.useMemo(
    () => ({
      title: {
        text: stockData.meta.symbol,
      },
      xAxis: {
        categories: stockData.values.map(
          (item: IValuesStockData) => item.datetime
        ),
        title: { text: "Interval" },
      },
      yAxis: {
        title: { text: "Price" },
      },
      series: [
        {
          name: "Interval",
          data: stockData.values.map((item: IValuesStockData) =>
            parseFloat(item.close)
          ),
        },
      ],
    }),
    [stockData]
  );

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
});

ChartScreen.displayName = "ChartScreen";

export default ChartScreen;
