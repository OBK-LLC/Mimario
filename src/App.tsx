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
import { Message } from "./types/session";
import { ChatHistory } from "./types/chat";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import Profile from "./pages/profile/Profile";
import Admin from "./pages/admin/Admin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sessionService } from "./services/session/sessionService";
import { useSession } from "./hooks/useSession";
import LoadingScreen from "./components/loading-screen/LoadingScreen";
import { AdminGuard } from "./components/guards/AdminGuard";
import { normalizeMessage } from "./services/session/sessionService";
import ErrorBoundary from "./components/ErrorBoundary";

const THEME_MODE_KEY = "mimario-theme-mode";

function getStorageKey(userId: string) {
  return `mimario-chat-histories-${userId}`;
}

function ChatWrapper({ selectedChatId, onSelectChat, ...props }: any) {
  const { chatId } = useParams();

  useEffect(() => {
    if (chatId && chatId !== selectedChatId) {
      onSelectChat(chatId);
    }
  }, [chatId, selectedChatId, onSelectChat]);

  return (
    <Chat
      selectedChatId={selectedChatId}
      onSelectChat={onSelectChat}
      {...props}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  const {
    sessions,
    loading: sessionsLoading,
    createSession,
    updateSession,
    deleteSession,
  } = useSession();
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

  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const chatHistories = sessions as unknown as ChatHistory[];

  const handleNewChat = async () => {
    try {
      const nextNumber = chatHistories.length + 1;
      const name = `Yeni Sohbet ${nextNumber}`;
      const response = await createSession(name, {
        topic: name,
      });

      if (response && response.data) {
        setSelectedChatId(response.data.id);
        setMessages((response.data.messages || []).map(normalizeMessage));
        navigate(`/chat/${response.data.id}`);
        toast.success("Yeni sohbet oluşturuldu");
      } else {
        throw new Error("Sohbet oluşturulamadı");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Yeni sohbet oluşturulamadı. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setSelectedChatId(chatId);
      setMessages((selectedChat.messages || []).map(normalizeMessage));
      navigate(`/chat/${chatId}`);
    }
  };

  useEffect(() => {
    if (selectedChatId) {
      sessionService
        .getSessionMessages(selectedChatId)
        .then((response) => {
          setMessages((response.data || []).map(normalizeMessage));
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [selectedChatId]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteSession(chatId);

      if (selectedChatId === chatId) {
        const lastChat = chatHistories[chatHistories.length - 1];
        if (lastChat) {
          setSelectedChatId(lastChat.id);
          setMessages((lastChat.messages || []).map(normalizeMessage));
          navigate(`/chat/${lastChat.id}`);
        } else {
          setSelectedChatId(undefined);
          setMessages([]);
          navigate("/");
        }
      }
      toast.success("Sohbet başarıyla silindi");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Sohbet silinemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleEditChatTitle = async (chatId: string, newTitle: string) => {
    try {
      await updateSession(chatId, newTitle);
      toast.success("Sohbet başlığı güncellendi");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Sohbet başlığı güncellenemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      role: "user",
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, normalizeMessage(newMessage)]);
    setIsGenerating(true);

    try {
      const response = await sessionService.updateSessionMessages(
        selectedChatId,
        content
      );

      if (response.success && response.data) {
        const aiResponse: Message = {
          id: uuidv4(),
          content: response.data.answer,
          role: "assistant",
          sender: "ai",
          timestamp: Date.now(),
          sources: response.data.sources,
        };

        setMessages((prev) => [...prev, normalizeMessage(aiResponse)]);
      } else {
        throw new Error(response.message || "Yanıt alınamadı");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
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
    user,
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
              isLoading ? (
                <LoadingScreen />
              ) : (
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
              )
            }
          />

          <Route
            path="/chat/:chatId"
            element={
              isLoading ? (
                <LoadingScreen />
              ) : user ? (
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
              isLoading ? (
                <LoadingScreen />
              ) : user ? (
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
              isLoading ? (
                <LoadingScreen />
              ) : !user ? (
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
              isLoading ? (
                <LoadingScreen />
              ) : !user ? (
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
              isLoading ? (
                <LoadingScreen />
              ) : !user ? (
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
            path="/admin"
            element={
              isLoading ? (
                <LoadingScreen />
              ) : (
                <AdminGuard>
                  <Admin />
                </AdminGuard>
              )
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
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
