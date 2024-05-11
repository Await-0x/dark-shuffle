import { createTheme } from '@mui/material/styles';

export const mainTheme = createTheme({
  typography: {
    fontFamily: [
      'oldenburg',
      'roboto',
    ].join(','),
    allVariants: {
      color: '#FFF'
    },
    h1: {
      fontSize: '35px'
    },
    h2: {
      fontSize: '26px',
    },
    h3: {
      fontSize: '22px'
    },
    h4: {
      fontSize: '20px'
    },
    h5: {
      fontSize: '18px'
    },
    h6: {
      fontSize: '16px'
    },
    body1: {
      fontSize: '14px',
      lineHeight: '18px'
    },
    subtitle1: {
      fontSize: '14px',
      lineHeight: '18px',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    subtitle2: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontStyle: 'italic',
      fontSize: '12px',
      fontFamily: 'cursive'
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFE97F',
      contrastText: '#000'
    },
    secondary: {
      main: 'rgba(160, 187, 201, 0.9)',
      contrastText: "rgb(234, 236, 239)"
    },
    warning: {
      main: '#f59100',
      contrastText: "#fff"
    },
    background: {
      default: '#1F1E1F',
      paper: '#000000'
    },
    text: {
      primary: '#FFF'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          textTransform: 'none'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '16px',
          background: '#282729'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '40px'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 16px',
          minHeight: '40px'
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          top: '50%',
          width: '25px',
          borderRadius: '0'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            'webkitBoxShadow': '0 0 0 100px #282729 inset',
            'webkitTextFillColor': '#fff'
          }
        }
      }
    }
  }
})
