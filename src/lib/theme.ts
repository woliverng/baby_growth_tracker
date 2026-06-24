import { createTheme, type Theme } from '@mui/material/styles';

/**
 * Shared typography configuration for both light and dark themes.
 * Uses Nunito for display/headings and Quicksand for body/UI text.
 */
const sharedTypography = {
  fontFamily:
    '"Quicksand", "Nunito", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
  h4: {
    fontFamily: '"Nunito", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontWeight: 800,
  },
  h5: {
    fontFamily: '"Nunito", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontWeight: 700,
  },
  h6: {
    fontFamily: '"Nunito", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontWeight: 700,
  },
  subtitle1: { fontWeight: 600 },
  subtitle2: {
    fontFamily: '"Nunito", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontWeight: 700,
  },
  button: { textTransform: 'none', fontWeight: 700 },
} as const;

/**
 * Light theme — giraffe warm yellow & brown palette.
 * Primary: #F4A940 (giraffe yellow)
 * Secondary: #8B5E3C (giraffe brown)
 */
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F4A940',
      light: '#FDE68A',
      dark: '#D97706',
    },
    secondary: {
      main: '#8B5E3C',
      light: '#A0724A',
      dark: '#5D3A1A',
    },
    background: {
      default: '#FFF8EE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4A3728',
      secondary: '#8B7355',
    },
    error: { main: '#FF8A80' },
    warning: { main: '#F4A940' },
    success: { main: '#81C784' },
    info: { main: '#64B5F6' },
  },
  shape: {
    borderRadius: 14,
  },
  typography: sharedTypography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          minHeight: 48,
          fontSize: '0.95rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #F0E6D8',
          boxShadow: '0 1px 3px rgba(93,58,26,0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F0E6D8',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0D0B8',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F4A940',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#F4A940',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#F4A940',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 20px rgba(244,169,64,0.35), 0 2px 6px rgba(244,169,64,0.2)',
        },
      },
    },
  },
});

/**
 * Dark theme — giraffe palette adapted for dark mode.
 */
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F4A940',
      light: '#FDE68A',
      dark: '#D97706',
    },
    secondary: {
      main: '#A0724A',
      light: '#C49A72',
      dark: '#8B5E3C',
    },
    background: {
      default: '#2A2118',
      paper: '#3A2E22',
    },
    text: {
      primary: '#FFF8EE',
      secondary: '#D4BFA8',
    },
    error: { main: '#FF8A80' },
    warning: { main: '#F4A940' },
    success: { main: '#81C784' },
    info: { main: '#64B5F6' },
  },
  shape: {
    borderRadius: 14,
  },
  typography: sharedTypography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          minHeight: 48,
          fontSize: '0.95rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(139,94,60,0.25)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(139,94,60,0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F4A940',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#F4A940',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#F4A940',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 6px 20px rgba(244,169,64,0.35), 0 2px 6px rgba(244,169,64,0.2)',
        },
      },
    },
  },
});

/**
 * Get theme by mode.
 * @param mode - 'light' or 'dark'
 * @returns MUI Theme
 */
export function getTheme(mode: 'light' | 'dark'): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
