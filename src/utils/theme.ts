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
      defaultProps: {},
      styleOverrides: {
        maxWidthMd: {
          maxWidth: "960px",
          "@media (min-width:900px)": {
            maxWidth: "960px",
          },
        },
        root: {
          "@media (min-width: 600px)": {
            padding: "0px",
            margin: "0px",
          },
        },
      },
      variants: [],
    },
  },
});

export default theme;
