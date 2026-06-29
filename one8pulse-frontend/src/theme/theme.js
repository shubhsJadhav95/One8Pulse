// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Deep Blue
      light: '#3B82F6',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#10B981', // Emerald Green
      light: '#34D399',
      dark: '#059669',
    },
    accent: {
      main: '#F97316', // Orange Accent
      light: '#FB923C',
      dark: '#EA580C',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8FAFC',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    info: {
      main: '#3B82F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
    '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
    '0 20px 40px rgba(0,0,0,0.2)',
    '0 25px 50px rgba(0,0,0,0.21)',
    '0 30px 60px rgba(0,0,0,0.22)',
    '0 35px 70px rgba(0,0,0,0.23)',
    '0 40px 80px rgba(0,0,0,0.24)',
    '0 45px 90px rgba(0,0,0,0.25)',
    '0 50px 100px rgba(0,0,0,0.26)',
    '0 55px 110px rgba(0,0,0,0.27)',
    '0 60px 120px rgba(0,0,0,0.28)',
    '0 65px 130px rgba(0,0,0,0.29)',
    '0 70px 140px rgba(0,0,0,0.30)',
    '0 75px 150px rgba(0,0,0,0.31)',
    '0 80px 160px rgba(0,0,0,0.32)',
    '0 85px 170px rgba(0,0,0,0.33)',
    '0 90px 180px rgba(0,0,0,0.34)',
    '0 95px 190px rgba(0,0,0,0.35)',
    '0 100px 200px rgba(0,0,0,0.36)',
    '0 105px 210px rgba(0,0,0,0.37)',
    '0 110px 220px rgba(0,0,0,0.38)',
    '0 115px 230px rgba(0,0,0,0.39)',
    '0 120px 240px rgba(0,0,0,0.40)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 320,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    accent: {
      main: '#F97316',
      light: '#FB923C',
      dark: '#EA580C',
    },
    background: {
      default: '#0F172A', // Dark Navy
      paper: '#1E293B', // Charcoal Black
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
  },
});

export { theme, darkTheme };
