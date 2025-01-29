import { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { getTheme } from "./theme/theme";
import Sidebar from "./components/chat/Sidebar";
import ChatContainer from "./components/chat/ChatContainer";
import Welcome from "./components/chat/Welcome";
import { Message, ChatHistory } from "./types/chat";

const STORAGE_KEY = "mimario-chat-histories";
const THEME_MODE_KEY = "mimario-theme-mode";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem(THEME_MODE_KEY) as "light" | "dark") ||
      (prefersDarkMode ? "dark" : "light")
  );

  const theme = getTheme(mode);

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
  };

  const initialChatHistories = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((chat: ChatHistory) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      } catch (error) {
        console.error("Local storage parse error:", error);
        return [];
      }
    }
    return [];
  };

  const [chatHistories, setChatHistories] =
    useState<ChatHistory[]>(initialChatHistories);
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistories));
  }, [chatHistories]);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    const newChat: ChatHistory = {
      id: newChatId,
      title: `Yeni Sohbet ${chatHistories.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChatHistories([...chatHistories, newChat]);
    setSelectedChatId(newChatId);
    setMessages([]);
    setShowWelcome(false);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setSelectedChatId(chatId);
      setMessages(selectedChat.messages);
      setShowWelcome(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedHistories = chatHistories.filter((chat) => chat.id !== chatId);
    setChatHistories(updatedHistories);

    if (selectedChatId === chatId) {
      const lastChat = updatedHistories[updatedHistories.length - 1];
      if (lastChat) {
        setSelectedChatId(lastChat.id);
        setMessages(lastChat.messages);
      } else {
        setSelectedChatId(undefined);
        setMessages([]);
        setShowWelcome(true);
      }
    }
  };

  const handleEditChatTitle = (chatId: string, newTitle: string) => {
    setChatHistories(
      chatHistories.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: newTitle,
              updatedAt: new Date(),
            }
          : chat
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setChatHistories(
      chatHistories.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: updatedMessages,
              updatedAt: new Date(),
            }
          : chat
      )
    );

    setIsGenerating(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        content:
          "Bu bir örnek AI yanıtıdır. API entegrasyonu henüz yapılmamıştır.",
        sender: "ai",
        timestamp: new Date(),
      };

      const updatedWithAiMessages = [...updatedMessages, aiResponse];
      setMessages(updatedWithAiMessages);
      setIsGenerating(false);

      setChatHistories(
        chatHistories.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: updatedWithAiMessages,
                updatedAt: new Date(),
              }
            : chat
        )
      );
    }, 1500);
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ width: "100%", height: "100vh" }}
          >
            <Welcome
              onStartChat={handleNewChat}
              onSelectChat={handleSelectChat}
              chatHistories={chatHistories}
              onDeleteChat={handleDeleteChat}
              onEditChatTitle={handleEditChatTitle}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ width: "100%", height: "100vh" }}
          >
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ height: "100%" }}
              >
                <Sidebar
                  chatHistories={chatHistories}
                  selectedChatId={selectedChatId}
                  onSelectChat={handleSelectChat}
                  onNewChat={handleNewChat}
                  onDeleteChat={handleDeleteChat}
                  onEditChatTitle={handleEditChatTitle}
                  onToggleTheme={toggleColorMode}
                  isDarkMode={mode === "dark"}
                />
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{ flex: 1, height: "100%" }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <ChatContainer
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isGenerating={isGenerating}
                  />
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
