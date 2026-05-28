import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import StockTable from '@/components/StockTable';
import * as useStockListModule from '@/hooks/queries/useStockList';
import type { TwelveDataStock } from '@/api/types';

// Highcharts and virtualizer are not relevant here — mock them
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (opts: { count: number; estimateSize: () => number }) => ({
    getVirtualItems: () =>
      Array.from({ length: opts.count }, (_, i) => ({
        index: i,
        key: i,
        start: i * opts.estimateSize(),
        end: (i + 1) * opts.estimateSize(),
        size: opts.estimateSize(),
        lane: 0,
      })),
    getTotalSize: () => opts.count * opts.estimateSize(),
  }),
}));

vi.mock('@/services/stockService', () => ({
  getStocks: vi.fn(),
}));

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
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc',
    currency: 'USD',
    exchange: 'NASDAQ',
    mic_code: 'XNAS',
    country: 'United States',
    type: 'Common Stock',
  },
];

function mockUseStockList(overrides: Partial<ReturnType<typeof useStockListModule.useStockList>>) {
  vi.spyOn(useStockListModule, 'useStockList').mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
    refetch: vi.fn(),
    // minimal required fields for the hook return type
    status: 'success',
    fetchStatus: 'idle',
    isFetching: false,
    isPending: false,
    isStale: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    isLoadingError: false,
    isRefetchError: false,
    isRefetching: false,
    isPlaceholderData: false,
    isPaused: false,
    isInitialLoading: false,
    errorUpdateCount: 0,
    ...overrides,
  } as ReturnType<typeof useStockListModule.useStockList>);
}

describe('StockTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows skeleton rows when isLoading is true', () => {
    mockUseStockList({ isLoading: true, isPending: true, status: 'pending', data: undefined });

    renderWithProviders(<StockTable />);

    // Skeleton components render inside TableCells
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error Alert when isError is true', () => {
    mockUseStockList({
      isError: true,
      isLoadingError: true,
      status: 'error',
      error: new Error('Error al cargar'),
      data: undefined,
    });

    renderWithProviders(<StockTable />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Error al cargar/i)).toBeInTheDocument();
  });

  it('shows stock rows when data is available', async () => {
    mockUseStockList({ data: MOCK_STOCKS });

    renderWithProviders(<StockTable />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('TSLA')).toBeInTheDocument();
      expect(screen.getByText('GOOGL')).toBeInTheDocument();
    });
  });

  it('shows the page heading', () => {
    mockUseStockList({ data: [] });

    renderWithProviders(<StockTable />);

    expect(screen.getByText('Mercado de Valores')).toBeInTheDocument();
  });

  it('filters rows by name when the name search field is used', async () => {
    mockUseStockList({ data: MOCK_STOCKS });

    renderWithProviders(<StockTable />);

    await waitFor(() => expect(screen.getByText('AAPL')).toBeInTheDocument());

    const [nameInput] = screen.getAllByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Apple' } });

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.queryByText('TSLA')).not.toBeInTheDocument();
      expect(screen.queryByText('GOOGL')).not.toBeInTheDocument();
    });
  });

  it('filters rows by symbol when the symbol search field is used', async () => {
    mockUseStockList({ data: MOCK_STOCKS });

    renderWithProviders(<StockTable />);

    await waitFor(() => expect(screen.getByText('AAPL')).toBeInTheDocument());

    const [, symbolInput] = screen.getAllByRole('textbox');
    fireEvent.change(symbolInput, { target: { value: 'TSLA' } });

    await waitFor(() => {
      expect(screen.getByText('TSLA')).toBeInTheDocument();
      expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
      expect(screen.queryByText('GOOGL')).not.toBeInTheDocument();
    });
  });
});
