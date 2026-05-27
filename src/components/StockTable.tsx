import * as React from 'react';
import {
  TableBody,
  TableRow as MuiTableRow,
  TableCell,
  Paper,
  Alert,
  Skeleton,
  Box,
  Button,
  Typography,
  InputAdornment,
  TextField as MuiTextField,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TableHeader, TableRow } from './atomics/index';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryClient } from '@tanstack/react-query';
import { useStockList } from '@/hooks/queries/useStockList';
import { getStocks } from '@/services/stockService';
import useDebounce from '@/hooks/useDebounce';
import type { TwelveDataStock } from '@/api/types';

// ─── Column widths (shared between header and body) ──────────────────────────
const COL_WIDTHS = ['15%', '45%', '12%', '28%'] as const;

const ColGroup: React.FC = () => (
  <colgroup>
    {COL_WIDTHS.map((w, i) => (
      <col key={i} style={{ width: w }} />
    ))}
  </colgroup>
);

// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonTableRow: React.FC = () => (
  <MuiTableRow sx={{ height: 52 }}>
    {COL_WIDTHS.map((_, i) => (
      <TableCell key={i}>
        <Skeleton variant="text" />
      </TableCell>
    ))}
  </MuiTableRow>
);

const SKELETON_COUNT = 10;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

// ─── Component ────────────────────────────────────────────────────────────────
const StockTable: React.FC = () => {
  const [searchName, setSearchName] = React.useState<string>('');
  const [searchSymbol, setSearchSymbol] = React.useState<string>('');

  const parentRef = React.useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: stocks = [], isLoading, isError, error, refetch } = useStockList();

  const debouncedSearchName = useDebounce(searchName, 500);
  const debouncedSearchSymbol = useDebounce(searchSymbol, 500);

  const filteredStocks = React.useMemo<TwelveDataStock[]>(
    () =>
      stocks.filter(
        (stock) =>
          stock.name.toLowerCase().includes(debouncedSearchName.toLowerCase()) &&
          stock.symbol.toLowerCase().includes(debouncedSearchSymbol.toLowerCase()),
      ),
    [stocks, debouncedSearchName, debouncedSearchSymbol],
  );

  const virtualizer = useVirtualizer({
    count: filteredStocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  const handleSearchNameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  }, []);

  const handleSearchSymbolChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchSymbol(event.target.value);
    },
    [],
  );

  const handlePrefetch = React.useCallback(
    (symbol: string) => {
      queryClient.prefetchQuery({
        queryKey: ['stock', symbol],
        queryFn: () => getStocks({ symbol, source: 'docs' }),
        staleTime: Infinity,
      });
    },
    [queryClient],
  );

  // ── Derive padding spacers for virtualizer ──────────────────────────────────
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0;

  // ── Error state ─────────────────────────────────────────────────────────────
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
          {error?.message ?? 'Error al cargar la lista de acciones.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* ── Page header ── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Mercado de Valores
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          NASDAQ — Datos en tiempo real
        </Typography>
      </Box>

      {/* ── Search bar ── */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <MuiTextField
          label="Buscar por nombre"
          value={searchName}
          onChange={handleSearchNameChange}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
        <MuiTextField
          label="Buscar por símbolo"
          value={searchSymbol}
          onChange={handleSearchSymbolChange}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* ── Table card ── */}
      <Paper elevation={2}>
        {/* Scrollable container — parentRef for the virtualizer */}
        <Box
          ref={parentRef}
          sx={{
            height: 600,
            overflowY: 'auto',
            overflowX: { xs: 'auto', sm: 'hidden' },
            '& thead': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: '#F5F7FA',
            },
          }}
        >
          <table
            style={{
              width: '100%',
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
            }}
          >
            <ColGroup />
            <TableHeader />

            <TableBody>
              {isLoading ? (
                SKELETON_KEYS.map((i) => <SkeletonTableRow key={i} />)
              ) : (
                <>
                  {paddingTop > 0 && (
                    <MuiTableRow>
                      <TableCell colSpan={4} sx={{ height: paddingTop, p: 0, border: 0 }} />
                    </MuiTableRow>
                  )}

                  {virtualItems.map((virtualItem) => {
                    const stock = filteredStocks[virtualItem.index];
                    return <TableRow key={stock.symbol} stock={stock} onHover={handlePrefetch} />;
                  })}

                  {paddingBottom > 0 && (
                    <MuiTableRow>
                      <TableCell colSpan={4} sx={{ height: paddingBottom, p: 0, border: 0 }} />
                    </MuiTableRow>
                  )}
                </>
              )}
            </TableBody>
          </table>
        </Box>

        <Divider />
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {isLoading
              ? 'Cargando...'
              : `${filteredStocks.length} resultado${filteredStocks.length !== 1 ? 's' : ''}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pase el cursor sobre una fila para precargar datos
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default StockTable;
