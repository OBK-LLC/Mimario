import React, { useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatContainer from "../../components/chat-container/ChatContainer";
import { ChatHistory, Message } from "../../types/chat";

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          position: "absolute",
          top: 16,
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
          paddingTop: { xs: "80px", md: "80px" },
        }}
      >
        <ChatContainer
          messages={messages}
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
          sessionId={selectedChatId || ""}
        />
      </Box>
    </Box>
  );
};

export default Chat;
