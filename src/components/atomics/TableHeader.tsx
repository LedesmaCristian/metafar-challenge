import * as React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

const StockTableHeader: React.FC = () => (
  <TableHead>
    <TableRow>
      <TableCell>Símbolo</TableCell>
      <TableCell>Nombre</TableCell>
      <TableCell>Moneda</TableCell>
      <TableCell>Tipo</TableCell>
    </TableRow>
  </TableHead>
);

export default StockTableHeader;
