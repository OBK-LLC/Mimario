import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { MessageProps } from "../../types/chat";

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === "ai";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: isAI ? "background.paper" : "primary.main",
          borderRadius: 2,
          borderTopLeftRadius: isAI ? 0 : 2,
          borderTopRightRadius: isAI ? 2 : 0,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: isAI ? "text.primary" : "primary.contrastText",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: isAI ? "text.secondary" : "rgba(255, 255, 255, 0.7)",
            display: "block",
            mt: 0.5,
            textAlign: isAI ? "left" : "right",
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Message;
