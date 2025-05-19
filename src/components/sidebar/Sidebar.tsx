import React, { useState, useEffect } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
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
  const [isSaving, setIsSaving] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleSave = async () => {
    if (newTitle.trim()) {
      setIsSaving(true);
      await onSave(newTitle.trim());
      setIsSaving(false);
      onClose();
    }
  };

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

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
            if (e.key === "Enter" && !isSaving) {
              handleSave();
            }
          }}
          disabled={isSaving}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />} disabled={isSaving}>
          İptal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isSaving || !newTitle.trim()}
        >
          {isSaving ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress
                size={18}
                sx={{ mr: 1, color: isDarkMode ? "#fff" : "primary.main" }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? "#fff" : "primary.main",
                  fontWeight: 500,
                }}
              >
                Kaydediliyor...
              </Typography>
            </Box>
          ) : (
            "Kaydet"
          )}
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
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    chatId: string | null;
  }>({ open: false, chatId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = useTheme();
  const isDarkModeTheme = theme.palette.mode === "dark";

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, chatId });
  };

  const handleEdit = (
    e: React.MouseEvent,
    chat: { id: string; title: string }
  ) => {
    e.stopPropagation();
    setEditingChat(chat);
  };

  const handleNewChat = async () => {
    setIsStartingChat(true);
    try {
      await onNewChat();
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.chatId || !onDeleteChat) return;
    setIsDeleting(true);
    await onDeleteChat(deleteDialog.chatId);
    setIsDeleting(false);
    setDeleteDialog({ open: false, chatId: null });
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
          onClick={handleNewChat}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
          disabled={isStartingChat}
        >
          {isStartingChat ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <CircularProgress
                size={20}
                thickness={4}
                sx={{
                  color: isDarkModeTheme ? "#fff" : "primary.main",
                  mr: 1.5,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isDarkModeTheme ? "#fff" : "primary.main",
                  fontWeight: 500,
                }}
              >
                Başlatılıyor...
              </Typography>
            </Box>
          ) : (
            "Yeni Sohbet"
          )}
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
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 2,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <ChatIcon color="action" sx={{ mr: 2 }} />
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {chat.title || chat.name}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ pl: 4 }}
                >
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </Typography>
              </ListItemButton>
              <Box
                className={`${styles.chatActionsContainer} ${styles.chatActions}`}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
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
                  sx={{ color: "text.secondary" }}
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
        onSave={async (newTitle) => {
          if (editingChat && onEditChatTitle) {
            await onEditChatTitle(editingChat.id, newTitle);
          }
          setEditingChat(null);
        }}
      />
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, chatId: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Sohbeti Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu sohbeti silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, chatId: null })}
            disabled={isDeleting}
          >
            İptal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", fontWeight: 500 }}
                >
                  Siliniyor...
                </Typography>
              </Box>
            ) : (
              "Sil"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
