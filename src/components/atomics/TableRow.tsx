import React from 'react';
import { TableRow, TableCell, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { TwelveDataStock } from '@/api/types';
import { STOCK_TYPE_CHIP_COLORS, ROUTES } from '@/constants';

type ChipColor = 'primary' | 'secondary' | 'warning' | 'info' | 'default';

function typeChipColor(type: string): ChipColor {
  const lowerType = type.toLowerCase();
  for (const [keyword, color] of Object.entries(STOCK_TYPE_CHIP_COLORS)) {
    if (lowerType.includes(keyword)) return color as ChipColor;
  }
  return 'default';
}

interface StockTableRowProps {
  stock: TwelveDataStock;
  onHover?: (symbol: string) => void;
}

const StockTableRow: React.FC<StockTableRowProps> = React.memo(({ stock, onHover }) => {
  const handleMouseEnter = React.useCallback(() => {
    onHover?.(stock.symbol);
  }, [onHover, stock.symbol]);

  return (
    <TableRow onMouseEnter={handleMouseEnter}>
      <TableCell>
        <Typography
          component={Link}
          to={ROUTES.stockDetail(stock.symbol)}
          variant="body2"
          fontWeight={600}
          color="primary"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {stock.symbol}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap>
          {stock.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {stock.currency}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={stock.type}
          size="small"
          color={typeChipColor(stock.type)}
          variant="outlined"
          sx={{ fontSize: 11, maxWidth: '100%' }}
        />
      </TableCell>
    </TableRow>
  );
});

StockTableRow.displayName = 'StockTableRow';

export default StockTableRow;
