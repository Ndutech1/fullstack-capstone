import { createTheme } from '@mui/material/styles';

// Utility function to create a theme based on mode
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#ff4081' },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
      },
    },
  });

// Default theme (light mode)
const theme = createTheme({
  palette: {
    mode: 'light', // switch to 'dark' if desired
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#ff4081', // Pink
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12, // rounded corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
