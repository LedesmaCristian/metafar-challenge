import { useQuery } from '@tanstack/react-query';
import { getStocks } from '@/services/stockService';
import { queryKeys } from './queryKeys';
import { DEFAULT_EXCHANGE } from '@/constants';
import type { TwelveDataStock } from '@/api/types';

export function useStockList(exchange: string = DEFAULT_EXCHANGE) {
  return useQuery<TwelveDataStock[], Error>({
    queryKey: queryKeys.stocks.list(exchange),
    queryFn: () => getStocks({ exchange, source: 'docs' }),
    staleTime: Infinity,
  });
}
