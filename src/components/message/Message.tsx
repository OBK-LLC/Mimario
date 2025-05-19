import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Collapse,
  List,
  ListItem,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  ContentCopy,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { MessageProps } from "../../types/chat";
import { useTheme } from "@mui/material/styles";
import styles from "./message.module.css";
import FeedbackModal from "../feedback-modal/FeedbackModal";
import { showToast } from "../../utils/toast";
import ReactMarkdown from "react-markdown";

export const Message: React.FC<MessageProps> = ({
  message,
  previousMessage,
  sessionId,
}) => {
  const isAI = message.sender === "ai";
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isPositiveFeedback, setIsPositiveFeedback] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<"positive" | null>(null);
  const sources = message.sources || [];
  const hasSources = isAI && sources.length > 0;

  const handleCopy = () => {
    const mdContent = `\n\n\`\`\`\n${message.content}\n\`\`\``;
    navigator.clipboard.writeText(mdContent);
    showToast.success("Panoya kopyalandı!");
  };

  const handleFeedback = (isPositive: boolean) => {
    setIsPositiveFeedback(isPositive);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalOpen(false);
  };

  const handleFeedbackModalAfterSubmit = (isPositive: boolean) => {
    if (isPositive) {
      setFeedbackGiven("positive");
    }
    setFeedbackModalOpen(false);
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
        {isAI ? (
          <div
            className={styles.messageText}
            style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 16 }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <Typography
            variant="body1"
            className={styles.messageText}
            sx={{
              color: isAI ? "text.primary" : "primary.contrastText",
            }}
          >
            {message.content}
          </Typography>
        )}
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
            ...(isAI && { display: "block", textAlign: "right" }),
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>

        {hasSources && (
          <>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => setShowSources(!showSources)}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flex: 1, paddingLeft: 2 }}
              >
                Kaynaklar ({sources.length})
              </Typography>
              {showSources ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={showSources}>
              <List sx={{ mt: 1, pb: 0 }}>
                {sources.map((source, index) => {
                  const sourceKey = source.id
                    ? `${message.id}-${source.id}`
                    : `${message.id}-source-${index}`;

                  return (
                    <ListItem
                      key={sourceKey}
                      sx={{
                        px: 2,
                        py: 1,
                        backgroundColor: "action.hover",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {source.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {source.content}
                        </Typography>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </>
        )}
      </Paper>

      {isAI && (
        <Box className={styles.messageActions}>
          <IconButton
            className={styles.actionButton}
            onClick={() => handleFeedback(true)}
            size="small"
            disabled={feedbackGiven === "positive"}
            sx={{
              color:
                feedbackGiven === "positive"
                  ? theme.palette.success.main
                  : undefined,
            }}
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
        onClose={handleFeedbackModalClose}
        isPositive={isPositiveFeedback}
        sessionId={sessionId}
        messageId={message.id}
        messageContent={message.content}
        messageRole={message.sender}
        previousMessageId={previousMessage?.id}
        previousMessageContent={previousMessage?.content}
        onAfterSubmit={handleFeedbackModalAfterSubmit}
      />
    </Box>
  );
};

export default Message;
