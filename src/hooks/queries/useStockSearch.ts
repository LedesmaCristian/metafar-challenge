import { useQuery } from '@tanstack/react-query';
import { searchSymbols } from '@/services/stockService';
import { queryKeys } from './queryKeys';
import type { TwelveDataSymbolSearchResponse } from '@/api/types';

export function useStockSearch(query: string) {
  return useQuery<TwelveDataSymbolSearchResponse, Error>({
    queryKey: queryKeys.search.byQuery(query),
    queryFn: () => searchSymbols(query),
    enabled: query.length > 1,
    staleTime: 60 * 1_000, // 1 minute
  });
}
