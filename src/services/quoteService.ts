import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { TwelveDataTimeSeriesResponse, TwelveDataQuote } from '@/api/types';

export interface GetTimeSeriesParams {
  symbol: string;
  interval?: string;
  start_date?: string;
  end_date?: string;
  outputsize?: number;
}

export async function getTimeSeries(
  params: GetTimeSeriesParams,
): Promise<TwelveDataTimeSeriesResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  );
  const response = await apiClient.get<TwelveDataTimeSeriesResponse>(ENDPOINTS.TIME_SERIES, {
    params: cleanParams,
  });
  return response.data;
}

export async function getQuote(symbol: string): Promise<TwelveDataQuote> {
  const response = await apiClient.get<TwelveDataQuote>(ENDPOINTS.QUOTE, {
    params: { symbol },
  });
  return response.data;
}
