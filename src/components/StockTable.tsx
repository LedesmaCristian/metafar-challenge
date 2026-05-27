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
} from '@mui/material';
import { TextField, TableHeader, TableRow } from './atomics/index';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryClient } from '@tanstack/react-query';
import { useStockList } from '../hooks/queries/useStockList';
import { getStocks } from '../services/stockService';
import useDebounce from '../hooks/useDebounce';
import type { TwelveDataStock } from '../api/types';

// ─── Column widths (shared between header and body) ──────────────────────────
const COL_WIDTHS = ['15%', '50%', '15%', '20%'] as const;

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
    );
  }

  return (
    <>
      <TextField label="Buscar por nombre" value={searchName} onChange={handleSearchNameChange} />
      <TextField
        label="Buscar por símbolo"
        value={searchSymbol}
        onChange={handleSearchSymbolChange}
      />

      <Paper>
        {/* Scrollable container — parentRef for the virtualizer */}
        <Box
          ref={parentRef}
          sx={{
            height: 600,
            overflowY: 'auto',
            // Make the sticky thead work inside overflow container
            '& thead': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
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
                  {/* Top spacer */}
                  {paddingTop > 0 && (
                    <MuiTableRow>
                      <TableCell colSpan={4} sx={{ height: paddingTop, p: 0, border: 0 }} />
                    </MuiTableRow>
                  )}

                  {virtualItems.map((virtualItem) => {
                    const stock = filteredStocks[virtualItem.index];
                    return <TableRow key={stock.symbol} stock={stock} onHover={handlePrefetch} />;
                  })}

                  {/* Bottom spacer */}
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

        {!isLoading && (
          <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block' }}>
            {filteredStocks.length} resultado{filteredStocks.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default StockTable;
