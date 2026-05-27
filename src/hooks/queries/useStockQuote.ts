import { useQuery } from '@tanstack/react-query';
import { getTimeSeries } from '@/services/quoteService';
import type { TwelveDataTimeSeriesResponse } from '@/api/types';
import { intervalToMs } from '@/helpers';

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
  // exactOptionalPropertyTypes: true requires `false` instead of `undefined` to
  // disable refetchInterval, and explicit undefined-guarded optional fields.
  const refetchInterval: number | false = isRealTime ? intervalToMs(interval) : false;

  return useQuery<TwelveDataTimeSeriesResponse, Error>({
    queryKey: ['quote', symbol, interval, startDate, endDate],
    queryFn: () =>
      getTimeSeries({
        symbol,
        interval,
        ...(startDate !== undefined ? { start_date: startDate } : {}),
        ...(endDate !== undefined ? { end_date: endDate } : {}),
      }),
    enabled: !!symbol,
    staleTime: 0,
    refetchInterval,
    placeholderData: (previousData) => previousData,
  });
}
