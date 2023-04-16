import { Noto_Sans, Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const noto = Noto_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
      dark: "#1565c0",
    },
    secondary: {
      main: "#081627",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: noto.style.fontFamily,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "0px!important",
          margin: "0px!important",
        },
      },
      defaultProps: {},
      variants: [],
    },
  },
});

export default theme;
