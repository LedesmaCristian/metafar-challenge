import { useQuery } from '@tanstack/react-query';
import { searchSymbols } from '@/services/stockService';
import type { TwelveDataSymbolSearchResponse } from '@/api/types';

export function useStockSearch(query: string) {
  return useQuery<TwelveDataSymbolSearchResponse, Error>({
    queryKey: ['search', query],
    queryFn: () => searchSymbols(query),
    enabled: query.length > 1,
    staleTime: 60 * 1_000, // 1 minute
  });
}
