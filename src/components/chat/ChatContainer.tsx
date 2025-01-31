import React, { useRef, useEffect } from "react";
import { Box, Typography, useTheme, Button, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";
import ChatInput from "./ChatInput";
import LoadingMessage from "./LoadingMessage";
import { ChatContainerProps } from "../../types/chat";
import { Send as SendIcon } from "@mui/icons-material";

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isGenerating,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

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
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          pb: 0,
        }}
      >
        {messages.length === 0 && !isGenerating && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              variants={emptyStateVariants}
              style={{
                textAlign: "center",
                maxWidth: "600px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)"
                      : "linear-gradient(45deg, #000000 30%, #333333 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Merhaba, ben Mimario!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Mimari mevzuatlar ve teknik konularda size yardımcı olmak için
                buradayım. Aşağıdaki örnek sorulardan birini seçebilir veya
                kendi sorunuzu yazabilirsiniz.
              </Typography>
              <Stack spacing={2} sx={{ maxWidth: 500, mx: "auto" }}>
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="large"
                    onClick={() => onSendMessage(question)}
                    endIcon={<SendIcon />}
                    sx={{
                      justifyContent: "space-between",
                      textAlign: "left",
                      py: 1.5,
                      px: 2,
                      borderColor: "divider",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </Stack>
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
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          p: 2,
          display: "flex",
          alignItems: "center",
          height: "69px",
        }}
      >
        <ChatInput onSendMessage={onSendMessage} disabled={isGenerating} />
      </Box>
    </Box>
  );
};

export default ChatContainer;
