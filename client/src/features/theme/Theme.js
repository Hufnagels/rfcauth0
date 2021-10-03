import { createTheme } from '@mui/material/styles'
import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  overrides: {
    MuiSpeedDial: {
      root: {
        backgroundColor: "red",
        borderRadius: 0,
      },
    },
    MuiSpeedDialAction: {
      staticTooltipLabel: {
        backgroundColor: "red"
      },
    },
    body: {
      margin:0,
      padding:0,
    },
    MuiButtonBas: {
      root:{
        MuiFab:{
          root:{
            borderRadius: 0,
          },
        }
      },
    },
    /* MuiButtonBase: {
      root: {
        borderRadius: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&selected':{
            color: '#ff4081 !important'
          } 
        },
      },
    },
    MuiToggleButtonGroup: {
      root: {
        '&selected':{
          color: '#ff4081 !important'
        } 
      },
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          borderRadius: 0,
          '&selected':{
            color: '#ff4081 !important'
          } 
        },
      },
    },
    MuiToggleButton: {
      root: {
        '&Mui-selected':{
          color: '#ff4081 !important'
        } 
      },
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          borderRadius: 0,
          '&selected':{
            color: '#ff4081 !important'
          } 
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
      root: {
        backgroundColor: '#f50057',
        zIndex:'100',
        "@media (max-width: 900px)": {
          paddingLeft: 0,
        },
      }
    }, */
  },
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  palette: {
    common:{
      black:'#000',
      white:'#fff',
      grey:'grey',
      backdrop:'rgba(0, 30, 60, 0.67)',
    },
    background:{
      paper:'#fff',
      default:'#fafafa',
      active: '#cccccc',
    },
    primary:{
      light:"#7986cb",
      main:"#3f51b5",
      dark:"#303f9f",
      link:'#cbcad6',
      header:'#5664d2',
      contrastText:"#fff",
    },
    secondary: {
      light:'#b2fef7',
      main:'#80cbc4',
      dark:'#4f9a94',
      link:'#cbcad6',
      contrastText:'#fff',
    },
    custom:{
      light:'#ff4081',
      main:'#f50057',
      dark:'#c51162',
      contrastText:'#000',
    },
    custom2:{
      color1:'#e53935',
      color2:'#43a047',
      color3:'#fb8c00',
      color4:'#3949ab',
    },
    error:{
      light:'#e57373',
      main:'#f44336',
      dark:'#d32f2f',
      contrastText:'#fff',
    },
    text:{
      primary:'rgba(0, 0, 0, 0.87)',
      secondary:'rgba(0, 0, 0, 0.54)',
      disabled:'rgba(0, 0, 0, 0.38)',
      hint:'rgba(0, 0, 0, 0.38)',
      nav:'rgba(128, 28, 122, 0.38)',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  components : {
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
      root: {
        backgroundColor: '#f50057',
        zIndex:'100',
        "@media (max-width: 900px)": {
          paddingLeft: 0,
        },
      }
    },
  },
  
});

export default theme;