import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import { StockPreferenceForm } from './index';
import { useStockData } from '../hooks/queries/useStockData';
import { useStockQuote } from '../hooks/queries/useStockQuote';
import type { StockQuoteParams } from './StockPreferenceForm';

// Lazy-loaded so Highcharts lives in its own chunk
const Chart = React.lazy(() => import('./StockChart'));

const CHART_HEIGHT = 400;

const Detail: React.FC = () => {
  const { symbol = 'MELI' } = useParams<{ symbol: string }>();

  const [quoteParams, setQuoteParams] = React.useState<StockQuoteParams>({
    interval: '5min',
    startDate: '',
    endDate: '',
    isRealTime: true,
  });

  const { data: stockList, isLoading: isStockLoading } = useStockData(symbol);

  const {
    data: quoteData,
    isLoading: isQuoteLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useStockQuote({ symbol, ...quoteParams });

  const stockInfo = stockList?.[0];
  const isInitialLoading = isStockLoading || isQuoteLoading;

  const handleParamsChange = React.useCallback((params: StockQuoteParams) => {
    setQuoteParams(params);
  }, []);

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Reintentar
          </Button>
        }
      >
        {error?.message ?? 'Error al cargar los datos del gráfico.'}
      </Alert>
    );
  }

  if (isInitialLoading) {
    return (
      <>
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={CHART_HEIGHT} />
      </>
    );
  }

  return (
    <>
      <StockPreferenceForm
        symbol={symbol}
        stockName={stockInfo?.name}
        stockCurrency={stockInfo?.currency}
        onParamsChange={handleParamsChange}
      />

      <Box sx={{ position: 'relative', mt: 2 }}>
        {/* Background refetch indicator */}
        {isFetching && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        )}

        {/* Live badge */}
        {quoteParams.isRealTime && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Chip label="En vivo" color="success" size="small" />
          </Box>
        )}

        {quoteData ? (
          <React.Suspense
            fallback={
              <Box
                sx={{
                  height: CHART_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Chart stockData={quoteData} />
          </React.Suspense>
        ) : null}
      </Box>
    </>
  );
};

export default Detail;
