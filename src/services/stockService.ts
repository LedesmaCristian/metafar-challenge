import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  TwelveDataStock,
  TwelveDataStocksResponse,
  TwelveDataSymbolSearchResponse,
} from '@/api/types';

export interface GetStocksParams {
  symbol?: string;
  exchange?: string;
  source?: string;
}

export async function getStocks(params: GetStocksParams = {}): Promise<TwelveDataStock[]> {
  const response = await apiClient.get<TwelveDataStocksResponse>(ENDPOINTS.STOCKS, { params });
  return response.data.data;
}

export async function searchSymbols(symbol: string): Promise<TwelveDataSymbolSearchResponse> {
  const response = await apiClient.get<TwelveDataSymbolSearchResponse>(ENDPOINTS.SYMBOL_SEARCH, {
    params: { symbol },
  });
  return response.data;
}
