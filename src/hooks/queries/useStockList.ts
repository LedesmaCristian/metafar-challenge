import { useQuery } from '@tanstack/react-query';
import { getStocks } from '@/services/stockService';
import type { TwelveDataStock } from '@/api/types';

export function useStockList(exchange = 'NASDAQ') {
  return useQuery<TwelveDataStock[], Error>({
    queryKey: ['stocks', exchange],
    queryFn: () => getStocks({ exchange, source: 'docs' }),
    staleTime: Infinity,
  });
}
