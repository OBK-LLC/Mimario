import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Pagination,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Box,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import styles from "./users-list.module.css";
import userService, { User } from "../../services/user/userService";
import { useAuth } from "../../contexts/AuthContext";

const ITEMS_PER_PAGE = 10;

const UsersList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.fetchUsers(page, ITEMS_PER_PAGE);
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kullanıcılar yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleStatusChange = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "user" ? "admin" : "user";
      await userService.updateUser(userId, { role: newRole });
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kullanıcı rolü güncellenirken bir hata oluştu"
      );
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete);
      await loadUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kullanıcı silinirken bir hata oluştu"
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className={styles.error}>
        {error}
      </Alert>
    );
  }

  return (
    <Box className={styles.container}>
      <Paper elevation={0} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Kullanıcı
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  E-posta
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Rol
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Kayıt Tarihi
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  İşlemler
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell>
                  <div className={styles.userInfo}>
                    <Avatar
                      src={user.metadata?.avatar_url}
                      alt={user.name}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor:
                          user.role === "admin"
                            ? "primary.main"
                            : "secondary.main",
                      }}
                    >
                      {user.name?.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography variant="body2" fontWeight={500}>
                        {user.display_name || user.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {user.id}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.infoItem}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">{user.email}</Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={
                      user.role === "admin" ? (
                        <AdminIcon fontSize="small" />
                      ) : (
                        <UserIcon fontSize="small" />
                      )
                    }
                    label={user.role === "admin" ? "Admin" : "Kullanıcı"}
                    color={user.role === "admin" ? "primary" : "default"}
                    size="small"
                    onClick={() => handleStatusChange(user.id, user.role)}
                    sx={{
                      fontWeight: 500,
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.created_at &&
                      new Date(user.created_at).toLocaleDateString("tr-TR")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className={styles.actions}>
                    <IconButton
                      size="small"
                      onClick={() => handleStatusChange(user.id, user.role)}
                      disabled={user.id === currentUser?.id}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(user.id)}
                      disabled={user.id === currentUser?.id}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={styles.pagination}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="rounded"
          />
        </div>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Kullanıcıyı Sil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bu kullanıcıyı silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
