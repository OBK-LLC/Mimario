import React, { useState, KeyboardEvent } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { ChatInputProps } from "../../types/chat";
import styles from "./chat-input.module.css";

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
      className={styles.inputContainer}
      sx={{
        backgroundColor: "background.default",
      }}
    >
      <InputBase
        className={styles.input}
        classes={{
          input: styles.inputField,
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
        className={`${styles.sendButton} ${styles.sendButtonHover}`}
        sx={{
          color: "primary.main",
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
