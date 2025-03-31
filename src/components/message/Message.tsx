import React, { useState } from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { ThumbUp, ThumbDown, ContentCopy } from "@mui/icons-material";
import { MessageProps } from "../../types/chat";
import { useTheme } from "@mui/material/styles";
import styles from "./message.module.css";
import FeedbackModal from "../feedback-modal/FeedbackModal";

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === "ai";
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isPositiveFeedback, setIsPositiveFeedback] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleFeedback = (isPositive: boolean) => {
    setIsPositiveFeedback(isPositive);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (feedback: {
    rating: number;
    comment: string;
  }) => {
    console.log("Feedback:", { messageId: message.id, ...feedback });
  };

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
      {isAI && (
        <Box className={styles.messageActions}>
          <IconButton
            className={styles.actionButton}
            onClick={() => handleFeedback(true)}
            size="small"
          >
            <ThumbUp fontSize="small" />
          </IconButton>
          <IconButton
            className={styles.actionButton}
            onClick={() => handleFeedback(false)}
            size="small"
          >
            <ThumbDown fontSize="small" />
          </IconButton>
          <IconButton
            className={styles.actionButton}
            onClick={handleCopy}
            size="small"
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
      )}
      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        isPositive={isPositiveFeedback}
        onSubmit={handleFeedbackSubmit}
      />
    </Box>
  );
};

export default Message;
