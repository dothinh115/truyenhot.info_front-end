import { Noto_Sans } from "next/font/google";
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
      main: "#7986cb",
      dark: "#1565c0",
      light: "#fff",
      contrastText: "#fff",
    },
    secondary: {
      main: "#081627",
    },
    error: {
      main: "#e57373",
      contrastText: "#fff",
    },
    success: {
      main: "#00c853",
      contrastText: "#fff",
    },
    info: {
      main: "#0091ea",
      contrastText: "#fff",
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
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          "@media (min-width: 600px)": {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
    },
  },
});

export default theme;
