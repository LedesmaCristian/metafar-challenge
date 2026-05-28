import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { getStocks, searchSymbols } from '@/services/stockService';
import type { TwelveDataStocksResponse, TwelveDataSymbolSearchResponse } from '@/api/types';

vi.mock('@/api/client');

const mockedGet = vi.mocked(apiClient.get);

const MOCK_STOCKS: TwelveDataStocksResponse = {
  status: 'ok',
  data: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      currency: 'USD',
      exchange: 'NASDAQ',
      mic_code: 'XNAS',
      country: 'United States',
      type: 'Common Stock',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      currency: 'USD',
      exchange: 'NASDAQ',
      mic_code: 'XNAS',
      country: 'United States',
      type: 'Common Stock',
    },
  ],
};

const MOCK_SEARCH_RESPONSE: TwelveDataSymbolSearchResponse = {
  data: [
    {
      symbol: 'AAPL',
      instrument_name: 'Apple Inc',
      exchange: 'NASDAQ',
      mic_code: 'XNAS',
      exchange_timezone: 'America/New_York',
      instrument_type: 'Common Stock',
      country: 'United States',
      currency: 'USD',
    },
  ],
  status: 'ok',
};

describe('stockService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStocks', () => {
    it('calls the correct endpoint with default params', async () => {
      mockedGet.mockResolvedValueOnce({ data: MOCK_STOCKS });

      await getStocks();

      expect(mockedGet).toHaveBeenCalledWith(ENDPOINTS.STOCKS, { params: {} });
    });

    it('calls the correct endpoint with provided params', async () => {
      mockedGet.mockResolvedValueOnce({ data: MOCK_STOCKS });

      await getStocks({ exchange: 'NASDAQ', source: 'docs' });

      expect(mockedGet).toHaveBeenCalledWith(ENDPOINTS.STOCKS, {
        params: { exchange: 'NASDAQ', source: 'docs' },
      });
    });

    it('returns the data array from the response', async () => {
      mockedGet.mockResolvedValueOnce({ data: MOCK_STOCKS });

      const result = await getStocks();

      expect(result).toEqual(MOCK_STOCKS.data);
      expect(result).toHaveLength(2);
      expect(result[0].symbol).toBe('AAPL');
    });

    it('returns an empty array when response data is empty', async () => {
      mockedGet.mockResolvedValueOnce({ data: { ...MOCK_STOCKS, data: [] } });

      const result = await getStocks();

      expect(result).toEqual([]);
    });
  });

  describe('searchSymbols', () => {
    it('calls the correct endpoint with the symbol param', async () => {
      mockedGet.mockResolvedValueOnce({ data: MOCK_SEARCH_RESPONSE });

      await searchSymbols('AAPL');

      expect(mockedGet).toHaveBeenCalledWith(ENDPOINTS.SYMBOL_SEARCH, {
        params: { symbol: 'AAPL' },
      });
    });

    it('returns the full response object', async () => {
      mockedGet.mockResolvedValueOnce({ data: MOCK_SEARCH_RESPONSE });

      const result = await searchSymbols('AAPL');

      expect(result).toEqual(MOCK_SEARCH_RESPONSE);
      expect(result.data[0].symbol).toBe('AAPL');
    });
  });
});
