import { useQuery } from '@tanstack/react-query';
import { getTimeSeries } from '../../services/quoteService';
import type { TwelveDataTimeSeriesResponse } from '../../api/types';
import type { GetTimeSeriesParams } from '../../services/quoteService';

export function useStockData(params: GetTimeSeriesParams) {
  return useQuery<TwelveDataTimeSeriesResponse, Error>({
    queryKey: ['timeSeries', params],
    queryFn: () => getTimeSeries(params),
    enabled: Boolean(params.symbol),
    staleTime: 60 * 1_000, // 1 minute
  });
}
