import { useQuery } from '@tanstack/react-query';
import { getTimeSeries } from '../../services/quoteService';
import type { TwelveDataTimeSeriesResponse } from '../../api/types';
import { intervalToMs } from '../../helpers';

export interface UseStockQuoteParams {
  symbol: string;
  interval?: string;
  startDate?: string;
  endDate?: string;
  isRealTime?: boolean;
}

export function useStockQuote({
  symbol,
  interval = '5min',
  startDate,
  endDate,
  isRealTime = false,
}: UseStockQuoteParams) {
  const refetchInterval = isRealTime ? intervalToMs(interval) : undefined;

  return useQuery<TwelveDataTimeSeriesResponse, Error>({
    queryKey: ['quote', symbol, interval, startDate, endDate],
    queryFn: () =>
      getTimeSeries({
        symbol,
        interval,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!symbol,
    staleTime: 0,
    refetchInterval,
    placeholderData: (previousData) => previousData,
  });
}
