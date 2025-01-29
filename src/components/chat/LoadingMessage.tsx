import React from "react";
import { Box, Paper, useTheme } from "@mui/material";
import { motion, Variants } from "framer-motion";

const LoadingMessage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const dotVariants: Variants = {
    initial: { scale: 0.8, opacity: 0.4 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        mb: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: "background.paper",
          borderRadius: 2,
          borderTopLeftRadius: 0,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            custom={i}
            style={{
              width: 8,
              height: 8,
              backgroundColor: isDarkMode ? "#E0E0E0" : "#000000",
              borderRadius: "50%",
              animationDelay: `${i * 0.2}s`,
            }}
            transition={{
              delay: i * 0.15,
            }}
          />
        ))}
      </Paper>
    </Box>
  );
};

export default LoadingMessage;
