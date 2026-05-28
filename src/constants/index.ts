/** Supported stock exchanges. */
export const EXCHANGES = {
  NASDAQ: 'NASDAQ',
  NYSE: 'NYSE',
} as const;

export type Exchange = (typeof EXCHANGES)[keyof typeof EXCHANGES];

/** Default chart interval. */
export const DEFAULT_INTERVAL = '5min';

/** Default exchange used in the stock list. */
export const DEFAULT_EXCHANGE = EXCHANGES.NASDAQ;

/** Available time intervals with their display labels. */
export const INTERVALS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '1min', label: '1 min' },
  { value: '5min', label: '5 min' },
  { value: '15min', label: '15 min' },
  { value: '30min', label: '30 min' },
  { value: '1h', label: '1 h' },
  { value: '2h', label: '2 h' },
  { value: '4h', label: '4 h' },
  { value: '1day', label: '1 día' },
];

/**
 * Chip colour mapping for each stock type keyword.
 * Keys are lowercase substrings matched against `stock.type`.
 */
export const STOCK_TYPE_CHIP_COLORS = {
  common: 'primary',
  etf: 'secondary',
  warrant: 'warning',
  preferred: 'info',
} as const satisfies Record<string, 'primary' | 'secondary' | 'warning' | 'info'>;

/** Route path templates. */
export const ROUTES = {
  HOME: '/',
  STOCK_DETAIL: '/stock/:symbol',
  stockDetail: (symbol: string) => `/stock/${symbol}`,
} as const;
