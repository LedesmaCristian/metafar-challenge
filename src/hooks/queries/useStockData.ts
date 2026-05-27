import { useQuery } from '@tanstack/react-query';
import { getStocks } from '@/services/stockService';
import type { TwelveDataStock } from '@/api/types';

export function useStockData(symbol: string) {
  return useQuery<TwelveDataStock[], Error>({
    queryKey: ['stock', symbol],
    queryFn: () => getStocks({ symbol, source: 'docs' }),
    enabled: !!symbol,
    staleTime: Infinity,
  });
}
