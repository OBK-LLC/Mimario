import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProps } from "../../types/chat";
import { useTheme } from "@mui/material/styles";

interface EditDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  title,
  onClose,
  onSave,
}) => {
  const [newTitle, setNewTitle] = useState(title);

  const handleSave = () => {
    if (newTitle.trim()) {
      onSave(newTitle.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Sohbet Başlığını Düzenle</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Başlık"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          İptal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface ExtendedSidebarProps extends SidebarProps {
  onDeleteChat?: (chatId: string) => void;
  onEditChatTitle?: (chatId: string, newTitle: string) => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<ExtendedSidebarProps> = ({
  chatHistories,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onEditChatTitle,
  onToggleTheme,
  isDarkMode,
}) => {
  const [editingChat, setEditingChat] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const theme = useTheme();

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (onDeleteChat) {
      onDeleteChat(chatId);
    }
  };

  const handleEdit = (
    e: React.MouseEvent,
    chat: { id: string; title: string }
  ) => {
    e.stopPropagation();
    setEditingChat(chat);
  };

  const handleSaveTitle = (newTitle: string) => {
    if (editingChat && onEditChatTitle) {
      onEditChatTitle(editingChat.id, newTitle);
    }
    setEditingChat(null);
  };

  return (
    <Box
      sx={{
        width: 280,
        height: "100%",
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Yeni Sohbet
        </Button>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
        {chatHistories.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Henüz sohbet bulunmuyor
            </Typography>
          </Box>
        ) : (
          chatHistories.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              sx={{
                position: "relative",
                "&:hover .chat-actions": {
                  opacity: 1,
                },
              }}
            >
              <ListItemButton
                selected={selectedChatId === chat.id}
                onClick={() => onSelectChat(chat.id)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  pr: 8,
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                  },
                }}
              >
                <ListItemIcon>
                  <ChatIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={chat.title}
                  secondary={new Date(chat.updatedAt).toLocaleDateString()}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
                <Box
                  className="chat-actions"
                  sx={{
                    position: "absolute",
                    right: 8,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => handleEdit(e, chat)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(e, chat.id)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "error.main" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
      <Divider />
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Tema
        </Typography>
        <IconButton
          onClick={onToggleTheme}
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {isDarkMode ? (
            <Brightness7 fontSize="small" />
          ) : (
            <Brightness4 fontSize="small" />
          )}
        </IconButton>
      </Box>
      <EditDialog
        open={!!editingChat}
        title={editingChat?.title || ""}
        onClose={() => setEditingChat(null)}
        onSave={handleSaveTitle}
      />
    </Box>
  );
};

export default Sidebar;
