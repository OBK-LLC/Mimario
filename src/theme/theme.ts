import { createTheme, PaletteMode } from "@mui/material/styles";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode
          primary: {
            main: "#000000",
            light: "#333333",
            dark: "#000000",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#ffffff",
            light: "#ffffff",
            dark: "#e0e0e0",
            contrastText: "#000000",
          },
          background: {
            default: "#ffffff",
            paper: "#f5f5f5",
          },
          text: {
            primary: "#000000",
            secondary: "#333333",
          },
          divider: "rgba(0, 0, 0, 0.12)",
        }
      : {
          // Dark mode
          primary: {
            main: "#ffffff",
            light: "#f5f5f5",
            dark: "#e0e0e0",
            contrastText: "#000000",
          },
          secondary: {
            main: "#000000",
            light: "#333333",
            dark: "#000000",
            contrastText: "#ffffff",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b3b3b3",
          },
          divider: "rgba(255, 255, 255, 0.12)",
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export const getTheme = (mode: PaletteMode) =>
  createTheme(getDesignTokens(mode));

export default getTheme("light");
