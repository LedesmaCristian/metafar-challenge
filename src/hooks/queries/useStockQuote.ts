import { useQuery } from '@tanstack/react-query';
import { getTimeSeries } from '@/services/quoteService';
import { queryKeys } from './queryKeys';
import { DEFAULT_INTERVAL } from '@/constants';
import type { TwelveDataTimeSeriesResponse } from '@/api/types';
import { intervalToMs } from '@/helpers';

export interface UseStockQuoteParams {
  symbol: string;
  interval?: string;
  startDate?: string;
  endDate?: string;
  isRealTime?: boolean;
  isPaused?: boolean;
}

export function useStockQuote({
  symbol,
  interval = DEFAULT_INTERVAL,
  startDate,
  endDate,
  isRealTime = false,
  isPaused = false,
}: UseStockQuoteParams) {
  // exactOptionalPropertyTypes: true requires `false` instead of `undefined` to
  // disable refetchInterval, and explicit undefined-guarded optional fields.
  const refetchInterval: number | false = isRealTime && !isPaused ? intervalToMs(interval) : false;

  // React Query cancela automáticamente el request anterior via AbortSignal
  // cuando cambian los parámetros o el componente se desmonta

  return useQuery<TwelveDataTimeSeriesResponse, Error>({
    queryKey: queryKeys.quotes.timeSeries(symbol, interval, startDate, endDate),
    queryFn: () =>
      getTimeSeries({
        symbol,
        interval,
        ...(startDate !== undefined ? { start_date: startDate } : {}),
        ...(endDate !== undefined ? { end_date: endDate } : {}),
        ...(!isRealTime ? { outputsize: 500 } : {}),
      }),
    enabled: !!symbol,
    staleTime: 0,
    refetchInterval,
    placeholderData: (previousData) => previousData,
  });
}
