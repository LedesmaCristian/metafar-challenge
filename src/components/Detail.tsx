import * as React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Link,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { StockPreferenceForm } from './index';
import { useStockData } from '@/hooks/queries/useStockData';
import { useStockQuote } from '@/hooks/queries/useStockQuote';
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
      <Box sx={{ p: 3 }}>
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
      </Box>
    );
  }

  if (isInitialLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* ── Breadcrumb ── */}
      <Breadcrumbs sx={{ mb: 2 }} aria-label="navegación">
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon sx={{ fontSize: 16 }} />
          Inicio
        </Link>
        <Typography color="text.primary" fontWeight={600}>
          {symbol}
        </Typography>
      </Breadcrumbs>

      {/* ── Stock header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight={700}>
          {symbol}
        </Typography>
        {stockInfo?.name && (
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            {stockInfo.name}
          </Typography>
        )}
        {stockInfo?.currency && (
          <Chip label={stockInfo.currency} size="small" variant="outlined" color="primary" />
        )}
        {quoteParams.isRealTime && (
          <Chip
            label="● En vivo"
            size="small"
            color="success"
            sx={{ fontWeight: 600, animation: 'pulse 2s infinite' }}
          />
        )}
      </Box>

      {/* ── Preference form card ── */}
      <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
        <StockPreferenceForm
          symbol={symbol}
          stockName={stockInfo?.name}
          stockCurrency={stockInfo?.currency}
          onParamsChange={handleParamsChange}
        />
      </Paper>

      {/* ── Chart card ── */}
      <Paper elevation={2} sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background refetch indicator inside the card */}
        {isFetching && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        )}

        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Evolución del precio
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
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
          ) : (
            <Box
              sx={{
                height: CHART_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">
                Configure los parámetros y presione Graficar
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Detail;
