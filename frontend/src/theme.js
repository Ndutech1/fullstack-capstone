import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#9d8cff' }, secondary: { main: '#f5a3cc' },
    background: { default: mode === 'dark' ? '#101015' : '#f7f5fa', paper: mode === 'dark' ? '#1a181e' : '#ffffff' },
  },
  typography: { fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', h1: { fontWeight: 900, letterSpacing: '-.06em' }, h2: { fontWeight: 900, letterSpacing: '-.04em' }, h3: { fontWeight: 800, letterSpacing: '-.035em' }, button: { fontWeight: 700, textTransform: 'none' } },
  shape: { borderRadius: 14 },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 10, boxShadow: 'none' } } }, MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }, MuiCssBaseline: { styleOverrides: { body: { margin: 0 } } } },
});

export default getTheme('light');
