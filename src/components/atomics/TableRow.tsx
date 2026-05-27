import React from 'react';
import { TableRow, TableCell, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IStock } from '@/types';

// Map stock type to a Chip color
type ChipColor = 'primary' | 'secondary' | 'warning' | 'info' | 'default';
function typeChipColor(type: string): ChipColor {
  if (type.toLowerCase().includes('common')) return 'primary';
  if (type.toLowerCase().includes('etf')) return 'secondary';
  if (type.toLowerCase().includes('warrant')) return 'warning';
  if (type.toLowerCase().includes('preferred')) return 'info';
  return 'default';
}

interface IStockTableRowProps {
  stock: IStock;
  onHover?: (symbol: string) => void;
}

const StockTableRow: React.FC<IStockTableRowProps> = React.memo(({ stock, onHover }) => {
  const handleMouseEnter = React.useCallback(() => {
    onHover?.(stock.symbol);
  }, [onHover, stock.symbol]);

  return (
    <TableRow onMouseEnter={handleMouseEnter}>
      <TableCell>
        <Typography
          component={Link}
          to={`/stock/${stock.symbol}`}
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
