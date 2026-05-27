import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const StockTable = React.lazy(() => import('./components/StockTable'));
const Detail = React.lazy(() => import('./components/Detail'));

const SuspenseFallback: React.FC = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<StockTable />} />
          <Route path="/stock/:symbol" element={<Detail />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;