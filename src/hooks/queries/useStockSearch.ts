import { useQuery } from '@tanstack/react-query';
import { searchSymbols } from '../../services/stockService';
import type { TwelveDataSymbolSearchResponse } from '../../api/types';

export function useStockSearch(symbol: string) {
  return useQuery<TwelveDataSymbolSearchResponse, Error>({
    queryKey: ['symbolSearch', symbol],
    queryFn: () => searchSymbols(symbol),
    enabled: symbol.trim().length > 0,
    staleTime: 2 * 60 * 1_000, // 2 minutes
  });
}
