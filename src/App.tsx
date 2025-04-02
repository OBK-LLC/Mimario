import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getTheme } from "./theme/theme";
import { Message, ChatHistory } from "./types/chat";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import Profile from "./pages/profile/Profile";
import Admin from "./pages/admin/Admin";
import AuthCallback from "./components/auth/AuthCallback";
import Verification from "./pages/verification/Verification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STORAGE_KEY = "mimario-chat-histories";
const THEME_MODE_KEY = "mimario-theme-mode";

function ChatWrapper(props: any) {
  const { chatId } = useParams();

  useEffect(() => {
    // Ensure chat selection is in sync with URL parameter
    if (chatId && chatId !== props.selectedChatId) {
      props.onSelectChat(chatId);
    }
  }, [chatId, props.selectedChatId, props.onSelectChat]);

  return <Chat {...props} />;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem(THEME_MODE_KEY) as "light" | "dark") ||
      (prefersDarkMode ? "dark" : "light")
  );

  const theme = getTheme(mode);

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 40,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -40,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

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
    navigate(`/chat/${newChatId}`);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setSelectedChatId(chatId);
      setMessages(selectedChat.messages);
      navigate(`/chat/${chatId}`);
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
        navigate(`/chat/${lastChat.id}`);
      } else {
        setSelectedChatId(undefined);
        setMessages([]);
        navigate("/");
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

  const handleLogin = () => {
    // This function is no longer used in the new implementation
  };

  const handleSignup = () => {
    // This function is no longer used in the new implementation
  };

  const handlePasswordReset = (email: string) => {
    console.log(`Şifre sıfırlama bağlantısı gönderildi: ${email}`);
    // Normalde burada backend'e istek gönderilecek
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const commonChatProps = {
    chatHistories,
    selectedChatId,
    messages,
    isGenerating,
    onSelectChat: handleSelectChat,
    onNewChat: handleNewChat,
    onDeleteChat: handleDeleteChat,
    onEditChatTitle: handleEditChatTitle,
    onToggleTheme: toggleColorMode,
    isDarkMode: mode === "dark",
    onSendMessage: handleSendMessage,
    onLogout: handleLogout,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                style={{ width: "100%", height: "100vh" }}
              >
                <Home
                  chatHistories={chatHistories}
                  onStartChat={handleNewChat}
                  onSelectChat={handleSelectChat}
                  onDeleteChat={handleDeleteChat}
                  onEditChatTitle={handleEditChatTitle}
                  isLoggedIn={!!user}
                  onLogout={handleLogout}
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
              </motion.div>
            }
          />

          <Route
            path="/chat/:chatId"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <ChatWrapper {...commonChatProps} />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <Profile />
                </motion.div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !user ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <Login />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/signup"
            element={
              !user ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <Signup />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={
              !user ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <ForgotPassword />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/verification"
            element={
              !user ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <Verification />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              user?.role === "admin" ? <Admin /> : <Navigate to="/" replace />
            }
          />

          <Route
            path="/auth/callback"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                style={{ width: "100%", height: "100vh" }}
              >
                <AuthCallback />
              </motion.div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <ToastContainer />
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
