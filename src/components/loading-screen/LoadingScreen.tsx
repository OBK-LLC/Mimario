import React from "react";
import { Box, CircularProgress, useTheme } from "@mui/material";

const LoadingScreen = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: theme.zIndex.modal + 1,
        gap: 2,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      <Box
        sx={{
          color: theme.palette.text.secondary,
          typography: "body2",
          fontWeight: 500,
        }}
      >
        Yönlendiriliyor...
      </Box>
    </Box>
  );
};

export default LoadingScreen;
