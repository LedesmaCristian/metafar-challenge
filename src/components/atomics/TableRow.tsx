import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { Link } from 'react-router-dom';
import { IStock } from '../../types';

interface IStockTableRowProps {
  stock: IStock;
  onHover?: (symbol: string) => void;
}

const StockTableRow: React.FC<IStockTableRowProps> = React.memo(({ stock, onHover }) => {
  // Stable handler — only recreated when symbol or onHover changes,
  // so React.memo can skip re-renders when neither changes.
  const handleMouseEnter = React.useCallback(() => {
    onHover?.(stock.symbol);
  }, [onHover, stock.symbol]);

  return (
    <TableRow onMouseEnter={handleMouseEnter}>
      <TableCell>
        <Link to={`/stock/${stock.symbol}`}>{stock.symbol}</Link>
      </TableCell>
      <TableCell>{stock.name}</TableCell>
      <TableCell>{stock.currency}</TableCell>
      <TableCell>{stock.type}</TableCell>
    </TableRow>
  );
});

StockTableRow.displayName = 'StockTableRow';

export default StockTableRow;
