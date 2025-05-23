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
  Stack,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHistory } from "../../types/chat";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingMessage from "../loading-message/LoadingMessage";
import CircularProgress from "@mui/material/CircularProgress";

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
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  onStartChat,
  onSelectChat,
  chatHistories,
  onDeleteChat,
  onEditChatTitle,
  isLoggedIn,
  onLogout,
}) => {
  const { user } = useAuth();
  const recentChats = chatHistories.slice(-3).reverse();
  const [editingChat, setEditingChat] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const theme = useTheme();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const isDarkMode = theme.palette.mode === "dark";

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

  const handleStartChat = async () => {
    setIsStartingChat(true);
    try {
      await onStartChat();
    } finally {
      setIsStartingChat(false);
    }
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
        p: { xs: 2, md: 3 },
        position: "relative",
      }}
    >
      {isLoggedIn && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: { xs: 16, md: "calc((100% - 1225px) / 2 + 16px)" },
            display: "flex",
            gap: 2,
          }}
        >
          {user?.role === "admin" || user?.role === "superadmin" ? (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                component={Link}
                to="/admin"
                variant="outlined"
                startIcon={<AdminIcon />}
                sx={{
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    borderColor: (theme) =>
                      `${theme.palette.primary.main} !important`,
                    color: (theme) =>
                      `${theme.palette.primary.main} !important`,
                  },
                }}
              >
                Admin
              </Button>
            </motion.div>
          ) : null}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              startIcon={<ProfileIcon />}
              sx={{
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  borderColor: (theme) =>
                    `${theme.palette.primary.main} !important`,
                  color: (theme) => `${theme.palette.primary.main} !important`,
                },
              }}
            >
              Profil
            </Button>
          </motion.div>
        </Box>
      )}

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
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)"
                    : "linear-gradient(45deg, #000000 30%, #333333 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.5rem", md: "3.75rem" },
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
                fontSize: { xs: "1.5rem", md: "2.125rem" },
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

            {!isLoggedIn ? (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        color: "primary.main",
                        "& .MuiButton-startIcon": {
                          color: "primary.main",
                        },
                      },
                    }}
                  >
                    Giriş Yap
                  </Button>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SignupIcon />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        color: "#fff",
                        "& .MuiButton-startIcon": {
                          color: "#fff",
                        },
                      },
                    }}
                  >
                    Kayıt Ol
                  </Button>
                </motion.div>
              </Stack>
            ) : (
              <>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={handleStartChat}
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<ChatIcon />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        minWidth: 180,
                        position: "relative",
                        "&:hover": {
                          color: "#fff",
                          "& .MuiButton-startIcon": {
                            color: "#fff",
                          },
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
                              color: isDarkMode ? "#fff" : "primary.main",
                              mr: 1.5,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDarkMode ? "#fff" : "primary.main",
                              fontWeight: 500,
                            }}
                          >
                            Başlatılıyor...
                          </Typography>
                        </Box>
                      ) : (
                        "Yeni Sohbet Başlat"
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={onLogout}
                      variant="outlined"
                      color="error"
                      size="large"
                      startIcon={<LogoutIcon />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          color: "error.main",
                          "& .MuiButton-startIcon": {
                            color: "error.main",
                          },
                        },
                      }}
                    >
                      Çıkış Yap
                    </Button>
                  </motion.div>
                </Stack>
              </>
            )}
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
              {isLoggedIn ? (
                recentChats.length > 0 ? (
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
                          className="chat-actions"
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
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
                )
              ) : (
                <Typography
                  component={motion.p}
                  variant="body1"
                  color="text.secondary"
                  variants={itemVariants}
                  sx={{
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  Önceki sohbetlerinizi görmek için giriş yapın
                </Typography>
              )}
            </AnimatePresence>
          </Paper>
        </Grid>
      </Grid>
      {editingChat && (
        <EditDialog
          open={!!editingChat}
          title={editingChat.title}
          onClose={() => setEditingChat(null)}
          onSave={handleSaveTitle}
        />
      )}
    </Box>
  );
};

export default Welcome;
