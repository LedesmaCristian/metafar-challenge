import * as React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import { TABLE_HEADER_BG } from '@/theme';

const HEADERS = ['Símbolo', 'Nombre', 'Moneda', 'Tipo'] as const;

const StockTableHeader: React.FC = () => (
  <TableHead>
    <TableRow>
      {HEADERS.map((h) => (
        <TableCell
          key={h}
          sx={{
            fontWeight: 600,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
            bgcolor: TABLE_HEADER_BG,
            borderBottom: '2px solid',
            borderColor: 'divider',
            py: 1.5,
          }}
        >
          {h}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default StockTableHeader;
