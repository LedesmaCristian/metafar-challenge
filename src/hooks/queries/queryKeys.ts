// Centralised source of truth for all React Query cache keys.
// Using a factory prevents typos and makes invalidation straightforward.

export const queryKeys = {
  stocks: {
    all: ['stocks'] as const,
    list: (exchange: string) => ['stocks', 'list', exchange] as const,
    detail: (symbol: string) => ['stocks', 'detail', symbol] as const,
  },
  quotes: {
    all: ['quotes'] as const,
    timeSeries: (symbol: string, interval: string, startDate?: string, endDate?: string) =>
      ['quotes', 'timeSeries', symbol, interval, startDate, endDate] as const,
  },
  search: {
    all: ['search'] as const,
    byQuery: (query: string) => ['search', query] as const,
  },
} as const;
