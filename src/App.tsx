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
import AuthCallback from "./components/auth/AuthCallback";
import Verification from "./pages/verification/Verification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sessionService } from "./services/session/sessionService";
import { useSession } from "./hooks/useSession";
import LoadingScreen from "./components/loading-screen/LoadingScreen";

const THEME_MODE_KEY = "mimario-theme-mode";

function getStorageKey(userId: string) {
  return `mimario-chat-histories-${userId}`;
}

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
      if (response) {
        setSelectedChatId(response.id);
        setMessages(response.messages || []);
        navigate(`/chat/${response.id}`);
      }
    } catch (error) {
      console.error("Chat creation failed:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setSelectedChatId(chatId);
      setMessages(selectedChat.messages || []);
      navigate(`/chat/${chatId}`);
    }
  };

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      sessionService
        .getSessionMessages(selectedChatId)
        .then((response) => {
          setMessages(response.data || []);
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
          setMessages(lastChat.messages || []);
          navigate(`/chat/${lastChat.id}`);
        } else {
          setSelectedChatId(undefined);
          setMessages([]);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Chat deletion failed:", error);
    }
  };

  const handleEditChatTitle = async (chatId: string, newTitle: string) => {
    try {
      await updateSession(chatId, newTitle);
      // Başlık değişikliğini yerel state'te güncellemeye gerek yok
      // useSession hook'u otomatik olarak güncelleyecek
    } catch (error) {
      console.error("Chat update failed:", error);
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

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      await sessionService.updateSessionMessages(
        selectedChatId,
        updatedMessages
      );

      setIsGenerating(true);

      setTimeout(() => {
        const aiResponse: Message = {
          id: uuidv4(),
          content:
            "Bu bir örnek AI yanıtıdır. API entegrasyonu henüz yapılmamıştır.",
          role: "assistant",
          sender: "ai",
          timestamp: Date.now(),
        };

        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        sessionService.updateSessionMessages(selectedChatId, finalMessages);

        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error("Message sending failed:", error);
      setIsGenerating(false);
    }
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
            path="/verification"
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
              isLoading ? (
                <LoadingScreen />
              ) : user?.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/auth/callback"
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
                  <AuthCallback />
                </motion.div>
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
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
