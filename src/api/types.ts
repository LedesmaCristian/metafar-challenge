// ─── Meta / Stock list ────────────────────────────────────────────────────────

export interface TwelveDataStock {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
  type: string;
}

export interface TwelveDataStocksResponse {
  data: TwelveDataStock[];
  status: string;
  count?: number;
}

// ─── Time series ──────────────────────────────────────────────────────────────

export interface TwelveDataMeta {
  symbol: string;
  interval: string;
  currency: string;
  exchange_timezone: string;
  exchange: string;
  mic_code: string;
  type: string;
}

export interface TwelveDataOHLCV {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface TwelveDataTimeSeriesResponse {
  meta: TwelveDataMeta;
  values: TwelveDataOHLCV[];
  status: string;
}

// ─── Quote ────────────────────────────────────────────────────────────────────

export interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
    low_change: string;
    high_change: string;
    low_change_percent: string;
    high_change_percent: string;
    range: string;
  };
}

// ─── Symbol search ────────────────────────────────────────────────────────────

export interface TwelveDataSearchResult {
  symbol: string;
  instrument_name: string;
  exchange: string;
  mic_code: string;
  exchange_timezone: string;
  instrument_type: string;
  country: string;
  currency: string;
}

export interface TwelveDataSymbolSearchResponse {
  data: TwelveDataSearchResult[];
  status: string;
}

// ─── API error shape ──────────────────────────────────────────────────────────

export interface TwelveDataErrorResponse {
  code: number;
  message: string;
  status: string;
}
