import { useQuery } from '@tanstack/react-query';
import { getQuote } from '../../services/quoteService';
import type { TwelveDataQuote } from '../../api/types';

export function useStockQuote(symbol: string) {
  return useQuery<TwelveDataQuote, Error>({
    queryKey: ['quote', symbol],
    queryFn: () => getQuote(symbol),
    enabled: Boolean(symbol),
    staleTime: 60 * 1_000, // 1 minute
  });
}
