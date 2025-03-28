import React from "react";
import { Box } from "@mui/material";
import Welcome from "../../components/welcome/Welcome";
import { ChatHistory } from "../../types/chat";

interface HomeProps {
  chatHistories: ChatHistory[];
  onStartChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onEditChatTitle?: (chatId: string, newTitle: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({
  chatHistories,
  onStartChat,
  onSelectChat,
  onDeleteChat,
  onEditChatTitle,
  isLoggedIn,
  onLogout,
}) => {
  return (
    <Box sx={{ height: "100vh" }}>
      <Welcome
        onStartChat={onStartChat}
        onSelectChat={onSelectChat}
        chatHistories={chatHistories}
        onDeleteChat={onDeleteChat}
        onEditChatTitle={onEditChatTitle}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
    </Box>
  );
};

export default Home;
