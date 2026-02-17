import { green, lightGreen } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';


const theme = createTheme({      
  typography: {
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: green[600],
      dark: green[800],
      light: lightGreen,
    },
    secondary: {
      main: green[400],
      dark: green[700],
      light: lightGreen[200],
    },
  }
});

export default theme;