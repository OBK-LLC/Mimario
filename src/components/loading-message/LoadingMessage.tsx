import { Box, Paper, useTheme } from "@mui/material";
import { motion, Variants } from "framer-motion";
import styles from "./loading-message.module.css";

interface LoadingMessageProps {
  size?: number;
  dotColor?: string;
  className?: string;
}

const LoadingMessage = ({
  size = 8,
  dotColor,
  className,
}: LoadingMessageProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const color = dotColor || (isDarkMode ? "#E0E0E0" : "#000000");

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
    <Box className={`${styles.container} ${className || ""}`}>
      <Paper
        elevation={0}
        className={styles.bubble}
        sx={{
          backgroundColor: "background.paper",
          boxShadow: "none",
          padding: 0,
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
              backgroundColor: color,
              width: size,
              height: size,
              margin: 2,
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
