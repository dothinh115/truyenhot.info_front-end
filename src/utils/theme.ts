import { Noto_Sans } from "next/font/google";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { deepOrange, grey, indigo, blueGrey } from "@mui/material/colors";
import React from "react";

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
          myPrimary: {
            main: indigo[300],
          },
          myBackground: {
            default: grey[100],
            paper: grey[300],
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
          mySecondary: {
            //màu border
            main: "#7986cbc2",
            borderBottom: "#ccc",
          },
          myText: {
            //màu text chính
            primary: grey[800],
            secondary: grey[700],
            //màu text heading
            main: "#fff",
            link: "#303f9f",
          },
        }
      : {
          myPrimary: {
            main: indigo[300],
          },
          myBackground: {
            default: grey[800],
            paper: grey[700],
            //những dòng trong bảng
            secondary: "#303030",
            input: grey[600],
            loading: grey[800],
            //headding
            main: "#7986cb",
            headfoot: "#7986cb",
            imgFooter: grey[600],
            loadingBack: grey[600],
            loadingMove: grey[700],
          },
          // màu theme
          mySecondary: {
            //màu border
            main: "#7986cbc2",
            borderBottom: "#7986cbc2",
          },
          myText: {
            //màu text chính
            primary: grey[300],
            secondary: grey[400],
            //màu text heading
            main: "#fff",
            link: grey[300], //light: #303f9f
          },
        }),
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    myPrimary?: any;
    myBackground?: any;
    mySecondary?: any;
    myText?: any;
  }
  interface ThemeOptions {
    // text: {
    //   primary: string;
    //   secondary: string;
    //   disabled: string;
    //   main?: string;
    //   link?: string;
    // };
    // background: {
    //   default: string;
    //   paper: string;
    //   secondary?: string;
    //   input?: string;
    //   loading?: string;
    //   main?: string;
    //   headfoot?: string;
    //   imgFooter?: string;
    //   loadingBack?: string;
    //   loadingMove?: string;
    // };
    myPrimary?: any;
    myBackground?: any;
    mySecondary?: any;
    myText?: any;
  }
}
