import { Box, Paper, useTheme } from "@mui/material";
import { motion, Variants } from "framer-motion";
import styles from "./loading-message.module.css";

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
    <Box className={styles.container}>
      <Paper
        elevation={0}
        className={styles.bubble}
        sx={{
          backgroundColor: "background.paper",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={styles.dot}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            custom={i}
            style={{
              backgroundColor: isDarkMode ? "#E0E0E0" : "#000000",
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
