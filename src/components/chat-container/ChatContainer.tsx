import React, { useRef, useEffect } from "react";
import { Box, Typography, useTheme, Button, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Message from "../message/Message";
import ChatInput from "../chat-input/ChatInput";
import LoadingMessage from "../loading-message/LoadingMessage";
import { ChatContainerProps } from "../../types/chat";
import { useAuth } from "../../contexts/AuthContext";
import {
  Send as SendIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import styles from "./chat-container.module.css";

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isGenerating,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { user } = useAuth();

  const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const exampleQuestions = [
    "Yapı ruhsatı için gerekli belgeler nelerdir?",
    "Yangın merdivenine, ne zaman ihtiyaç duyulur?",
    "Bina yüksekliği hesaplama yöntemi nedir?",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const emptyStateVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.container}
      sx={{
        backgroundColor: "background.default",
      }}
    >
      <Box className={styles.messagesContainer}>
        {messages.length === 0 && !isGenerating && (
          <Box className={styles.emptyStateContainer}>
            <motion.div
              variants={emptyStateVariants}
              className={styles.emptyStateContent}
            >
              <Typography
                variant="h4"
                align="center"
                className={styles.welcomeTitle}
                sx={{
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Merhaba{user?.name ? ` ${capitalize(user.name)}` : ""}, ben
                Mimario!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                className={styles.welcomeText}
                sx={{
                  maxWidth: 600,
                  margin: "0 auto",
                  mb: 5,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                }}
              >
                Mimari mevzuatlar ve teknik konularda size yardımcı olmak için
                buradayım. Aşağıdaki örnek sorulardan birini seçebilir veya
                kendi sorunuzu yazabilirsiniz.
              </Typography>
              <Box maxWidth={600} mx="auto" sx={{ width: "100%" }}>
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    fullWidth
                    onClick={() => onSendMessage(question)}
                    endIcon={<ArrowIcon sx={{ marginLeft: 2, fontSize: 20 }} />}
                    className={styles.exampleQuestionButton}
                    sx={{
                      justifyContent: "space-between",
                      textAlign: "left",
                      py: 2.5,
                      px: 3,
                      mb: 3,
                      borderColor: "divider",
                      color: "text.primary",
                      borderRadius: 2,
                      width: "100%",
                      maxWidth: "600px",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </Box>
            </motion.div>
          </Box>
        )}
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <Message message={message} />
            </motion.div>
          ))}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingMessage />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>
      <Box
        className={styles.inputContainer}
        sx={{
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          height: 80,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <ChatInput onSendMessage={onSendMessage} disabled={isGenerating} />
      </Box>
    </Box>
  );
};

export default ChatContainer;
