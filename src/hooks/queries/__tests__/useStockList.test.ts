import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStockList } from '@/hooks/queries/useStockList';
import * as stockService from '@/services/stockService';
import { createTestQueryClient } from '@/test/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import type { TwelveDataStock } from '@/api/types';

vi.mock('@/services/stockService');

const mockedGetStocks = vi.mocked(stockService.getStocks);

const MOCK_STOCKS: TwelveDataStock[] = [
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
    symbol: 'TSLA',
    name: 'Tesla Inc',
    currency: 'USD',
    exchange: 'NASDAQ',
    mic_code: 'XNAS',
    country: 'United States',
    type: 'Common Stock',
  },
];

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useStockList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isLoading true initially', () => {
    mockedGetStocks.mockResolvedValue(MOCK_STOCKS);

    const { result } = renderHook(() => useStockList(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns data when the query resolves', async () => {
    mockedGetStocks.mockResolvedValue(MOCK_STOCKS);

    const { result } = renderHook(() => useStockList(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(MOCK_STOCKS);
    expect(result.current.data).toHaveLength(2);
  });

  it('calls getStocks with the default NASDAQ exchange', async () => {
    mockedGetStocks.mockResolvedValue(MOCK_STOCKS);

    const { result } = renderHook(() => useStockList(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetStocks).toHaveBeenCalledWith({ exchange: 'NASDAQ', source: 'docs' });
  });

  it('calls getStocks with a custom exchange', async () => {
    mockedGetStocks.mockResolvedValue(MOCK_STOCKS);

    const { result } = renderHook(() => useStockList('NYSE'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetStocks).toHaveBeenCalledWith({ exchange: 'NYSE', source: 'docs' });
  });

  it('has staleTime set to Infinity', () => {
    // staleTime Infinity means the query won't be refetched on re-render
    mockedGetStocks.mockResolvedValue(MOCK_STOCKS);

    const wrapper = createWrapper();
    const { result: r1 } = renderHook(() => useStockList(), { wrapper });
    const { result: r2 } = renderHook(() => useStockList(), { wrapper });

    // Both hooks share the same query — getStocks should only be called once
    expect(mockedGetStocks).toHaveBeenCalledTimes(1);
    expect(r1.current.isLoading).toBe(r2.current.isLoading);
  });

  it('returns isError true when the query fails', async () => {
    mockedGetStocks.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useStockList(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Network error');
  });
});
