import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHistory } from "../../types/chat";

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

interface WelcomeProps {
  onStartChat: () => void;
  onSelectChat: (chatId: string) => void;
  chatHistories: ChatHistory[];
  onDeleteChat?: (chatId: string) => void;
  onEditChatTitle?: (chatId: string, newTitle: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  onStartChat,
  onSelectChat,
  chatHistories,
  onDeleteChat,
  onEditChatTitle,
}) => {
  const recentChats = chatHistories.slice(-3).reverse();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const chatItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        p: 3,
      }}
    >
      <Grid container spacing={4} maxWidth="1200px" margin="auto">
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 6 }}>
            <Typography
              component={motion.h1}
              variant="h2"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(45deg, #000000 30%, #333333 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mimario
            </Typography>
            <Typography
              component={motion.h2}
              variant="h4"
              variants={itemVariants}
              sx={{
                mb: 3,
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Mimari AI Asistanınız
            </Typography>
            <Typography
              component={motion.p}
              variant="body1"
              variants={itemVariants}
              sx={{
                mb: 4,
                color: "text.secondary",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                maxWidth: "90%",
              }}
            >
              Mimari mevzuatlar, yönetmelikler ve teknik konularda size yardımcı
              olmak için buradayım. Hızlı ve doğru bilgiye ulaşmanızı sağlayarak
              işinizi kolaylaştırmak için tasarlandım.
            </Typography>
            <Button
              component={motion.button}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={onStartChat}
              sx={{
                px: 4,
                py: 1.8,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.2rem",
                fontWeight: 500,
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Yeni Sohbet Başlat
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            component={motion.div}
            variants={itemVariants}
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "background.paper",
              borderRadius: 4,
            }}
          >
            <Typography
              component={motion.h3}
              variant="h6"
              variants={itemVariants}
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              <HistoryIcon /> Önceki Sohbetleriniz
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <AnimatePresence>
              {recentChats.length > 0 ? (
                <List sx={{ mb: 2 }}>
                  {recentChats.map((chat, index) => (
                    <ListItem
                      key={chat.id}
                      component={motion.li}
                      variants={chatItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      custom={index}
                      disablePadding
                      sx={{
                        position: "relative",
                        "&:hover .chat-actions": {
                          opacity: 1,
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => onSelectChat(chat.id)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          pr: 8,
                        }}
                      >
                        <ListItemIcon>
                          <ChatIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={chat.title}
                          secondary={new Date(
                            chat.updatedAt
                          ).toLocaleDateString()}
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
                  ))}
                </List>
              ) : (
                <Typography
                  component={motion.p}
                  variant="body2"
                  color="text.secondary"
                  variants={itemVariants}
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Henüz sohbet geçmişiniz bulunmuyor
                </Typography>
              )}
            </AnimatePresence>
          </Paper>
        </Grid>
      </Grid>
      <EditDialog
        open={!!editingChat}
        title={editingChat?.title || ""}
        onClose={() => setEditingChat(null)}
        onSave={handleSaveTitle}
      />
    </Box>
  );
};

export default Welcome;
