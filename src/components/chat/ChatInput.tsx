import React, { useState, KeyboardEvent } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { ChatInputProps } from "../../types/chat";

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: "8px 16px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.default",
        width: "100%",
        borderRadius: 2,
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontSize: "1rem",
          "& input": {
            padding: "8px 0",
          },
        }}
        placeholder="Mesajınızı yazın..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        multiline
        maxRows={4}
      />
      <IconButton
        sx={{
          p: "10px",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        onClick={handleSend}
        disabled={!message.trim() || disabled}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default ChatInput;
