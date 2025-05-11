import React, { useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  Button,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { sessionService } from "../../services/session/sessionService";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatContainer from "../../components/chat-container/ChatContainer";
import { ChatHistory, Message } from "../../types/chat";
import { showToast } from "../../utils/toast";

interface ChatPageProps {
  chatHistories: ChatHistory[];
  selectedChatId?: string;
  messages: Message[];
  isGenerating: boolean;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onEditChatTitle: (chatId: string, newTitle: string) => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  onSendMessage: (message: string) => void;
  onLogout: () => void;
}

const Chat: React.FC<ChatPageProps> = ({
  chatHistories,
  selectedChatId,
  messages,
  isGenerating,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onEditChatTitle,
  onToggleTheme,
  isDarkMode,
  onSendMessage,
  onLogout,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usageLimits, setUsageLimits] = useState<{
    daily: { current: number; limit: number };
    monthly: { current: number; limit: number };
  } | null>(null);
  const [showUsageWarning, setShowUsageWarning] = useState(false);

  useEffect(() => {
    fetchUsageLimits();
  }, [messages]);

  const fetchUsageLimits = async () => {
    try {
      const usage = await sessionService.getSessionUsage();
      setUsageLimits(usage);

      if (usage) {
        const dailyPercentage = (usage.daily.current / usage.daily.limit) * 100;
        const monthlyPercentage = (usage.monthly.current / usage.monthly.limit) * 100;

        setShowUsageWarning(dailyPercentage >= 90 || monthlyPercentage >= 90);
      }
    } catch (error) {
      console.error("Usage limits fetch error:", error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (usageLimits) {
        const { daily, monthly } = usageLimits;

        if (daily.current >= daily.limit) {
          showToast.error("Günlük mesaj limitinize ulaştınız. Yarın tekrar deneyin.");
          return;
        }

        if (monthly.current >= monthly.limit) {
          showToast.error("Aylık mesaj limitinize ulaştınız. Gelecek ay tekrar deneyin.");
          return;
        }
      }

      await onSendMessage(content);
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("Mesaj gönderilirken bir hata oluştu.");
      }
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {showUsageWarning && usageLimits && (
        <Collapse in={showUsageWarning}>
          <Alert
            severity="warning"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
              borderRadius: 0,
            }}
            onClose={() => setShowUsageWarning(false)}
          >
            <AlertTitle>Limit Uyarısı</AlertTitle>
            {usageLimits.daily.current >= usageLimits.daily.limit * 0.9 && (
              <div>
                Günlük limit: {usageLimits.daily.current}/{usageLimits.daily.limit}
              </div>
            )}
            {usageLimits.monthly.current >= usageLimits.monthly.limit * 0.9 && (
              <div>
                Aylık limit: {usageLimits.monthly.current}/{usageLimits.monthly.limit}
              </div>
            )}
          </Alert>
        </Collapse>
      )}

      <Box
        sx={{
          position: "absolute",
          top: showUsageWarning ? 80 : 16,
          right: 16,
          display: "flex",
          gap: 2,
          zIndex: 1100,
        }}
      >
        <Button
          component={Link}
          to="/profile"
          variant="outlined"
          startIcon={<ProfileIcon />}
          sx={{
            textTransform: "none",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              color: "inherit !important",
              borderColor: "rgba(0, 0, 0, 0.23) !important",
              "& .MuiButton-startIcon": {
                color: "inherit !important",
              },
            },
          }}
        >
          Profil
        </Button>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          sx={{
            textTransform: "none",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              color: "error.main !important",
              borderColor: (theme) => `${theme.palette.error.main} !important`,
              "& .MuiButton-startIcon": {
                color: "error.main !important",
              },
            },
          }}
        >
          Çıkış Yap
        </Button>
      </Box>

      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              left: 16,
              top: 16,
              zIndex: 1100,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "background.paper",
                boxShadow: 3,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 280,
              },
            }}
          >
            <Sidebar
              chatHistories={chatHistories}
              selectedChatId={selectedChatId}
              onSelectChat={(chatId) => {
                onSelectChat(chatId);
                handleDrawerToggle();
              }}
              onNewChat={() => {
                onNewChat();
                handleDrawerToggle();
              }}
              onDeleteChat={onDeleteChat}
              onEditChatTitle={onEditChatTitle}
              onToggleTheme={onToggleTheme}
              isDarkMode={isDarkMode}
            />
          </Drawer>
        </>
      ) : (
        <Sidebar
          chatHistories={chatHistories}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          onNewChat={onNewChat}
          onDeleteChat={onDeleteChat}
          onEditChatTitle={onEditChatTitle}
          onToggleTheme={onToggleTheme}
          isDarkMode={isDarkMode}
        />
      )}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          paddingTop: showUsageWarning ? "140px" : { xs: "80px", md: "80px" },
        }}
      >
        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          sessionId={selectedChatId || ""}
        />
      </Box>
    </Box>
  );
};

export default Chat;
