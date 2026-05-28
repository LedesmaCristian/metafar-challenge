import { alpha, createTheme } from '@mui/material/styles';

const PRIMARY_MAIN = '#1565C0';
const SECONDARY_MAIN = '#00897B';
const BACKGROUND_DEFAULT = '#F0F4F8';

/** Background colour used by table headers — exported for reuse in components. */
export const TABLE_HEADER_BG = '#F5F7FA';

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_MAIN,
    },
    secondary: {
      main: SECONDARY_MAIN,
    },
    background: {
      default: BACKGROUND_DEFAULT,
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(PRIMARY_MAIN, 0.04),
          },
        },
      },
    },
  },
});

export default theme;
