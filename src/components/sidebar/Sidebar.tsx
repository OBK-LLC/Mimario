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
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { SidebarProps } from "../../types/chat";
import styles from "./sidebar.module.css";

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
      className={styles.sidebar}
      sx={{
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box className={styles.buttonContainer}>
        <Button
          className={styles.newChatButton}
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
      <List className={styles.chatsList}>
        {chatHistories.length === 0 ? (
          <Box className={styles.emptyChatMessage}>
            <Typography variant="body2" color="text.secondary">
              Henüz sohbet bulunmuyor
            </Typography>
          </Box>
        ) : (
          chatHistories.map((chat) => (
            <ListItem key={chat.id} disablePadding className={styles.chatItem}>
              <ListItemButton
                selected={selectedChatId === chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={styles.chatItemButton}
                sx={{
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
                    className: styles.chatItemText,
                  }}
                />
              </ListItemButton>
              <Box
                className={`${styles.chatActionsContainer} ${styles.chatActions}`}
              >
                <IconButton
                  size="small"
                  className={styles.actionIcon}
                  onClick={(e) =>
                    handleEdit(e, { id: chat.id, title: chat.title })
                  }
                  sx={{ color: "text.secondary" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className={styles.actionIcon}
                  onClick={(e) => handleDelete(e, chat.id)}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))
        )}
      </List>
      {onToggleTheme && (
        <Box className={styles.footer}>
          <Typography variant="body2" color="text.secondary">
            Tema
          </Typography>
          <IconButton
            onClick={onToggleTheme}
            className={styles.themeToggle}
            size="small"
          >
            {isDarkMode ? (
              <Brightness7 fontSize="small" />
            ) : (
              <Brightness4 fontSize="small" />
            )}
          </IconButton>
        </Box>
      )}
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
