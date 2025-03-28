import React, { useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
          paddingTop: isMobile ? 7 : 0,
        }}
      >
        <ChatContainer
          messages={messages}
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
        />
      </Box>
    </Box>
  );
};

export default Chat;
