import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { MessageProps } from "../../types/chat";
import { useTheme } from "@mui/material/styles";
import styles from "./message.module.css";

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === "ai";
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      className={`${styles.messageContainer} ${
        isAI ? styles.aiMessage : styles.userMessage
      }`}
    >
      <Paper
        elevation={0}
        className={`${styles.messageBubble} ${
          isAI ? styles.aiMessageBubble : styles.userMessageBubble
        }`}
        sx={{
          backgroundColor: isAI ? "background.paper" : "primary.main",
        }}
      >
        <Typography
          variant="body1"
          className={styles.messageText}
          sx={{
            color: isAI ? "text.primary" : "primary.contrastText",
          }}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          className={`${styles.timestamp} ${
            isAI ? styles.aiTimestamp : styles.userTimestamp
          }`}
          sx={{
            color: isAI
              ? "text.secondary"
              : isDarkMode
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(255, 255, 255, 0.85)",
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Message;
