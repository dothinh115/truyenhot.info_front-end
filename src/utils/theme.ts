import { Noto_Sans } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { deepOrange, grey, indigo, yellow } from "@mui/material/colors";

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
      },
      variants: [],
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          margin: "unset",
        },
      },
    },
  },
});

export default theme;

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: indigo[300],
          },
          background: {
            default: grey[200],
            paper: grey[100],
            //những dòng trong bảng
            secondary: "#fff",
            input: grey[50],
            loading: "#fff",
            //headding
            main: "#7986cbc2",
            headfoot: "#7986cb",
            imgFooter: grey[700],
            loadingBack: grey[300],
            loadingMove: grey[400],
          },
          // màu theme
          secondary: {
            //màu border
            main: "#7986cbc2",
          },
          text: {
            //màu text chính
            primary: grey[800],
            secondary: grey[400],
            //màu text heading
            main: "#fff",
            link: "#303f9f",
          },
        }
      : {
          primary: {
            main: indigo[300],
          },
          divider: deepOrange[700],
          background: {
            default: grey[800],
            paper: grey[900],
            //những dòng trong bảng
            secondary: grey[700],
            input: grey[600],
            loading: grey[900],
            //headding
            main: "#7986cbc2",
            headfoot: "#7986cb",
            imgFooter: grey[600],
            loadingBack: grey[300],
            loadingMove: grey[400],
          },
          // màu theme
          secondary: {
            //màu border
            main: grey[300],
          },
          text: {
            //màu text chính
            primary: grey[200],
            secondary: grey[400],
            //màu text heading
            main: "#fff",
            link: "#fff", //light: #303f9f
          },
        }),
  },
});
