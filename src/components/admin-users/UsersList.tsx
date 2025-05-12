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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  WorkspacePremium as PackageIcon,
} from "@mui/icons-material";
import styles from "./users-list.module.css";
import userService, { User } from "../../services/user/userService";
import { useAuth } from "../../contexts/AuthContext";

const ITEMS_PER_PAGE = 10;
const PACKAGE_OPTIONS = [
  { value: "free", label: "Ücretsiz" },
  { value: "basic", label: "Temel" },
  { value: "pro", label: "Profesyonel" },
];

interface PackageDialogState {
  open: boolean;
  userId: string | null;
  userData: {
    package_name: string;
    max_daily_sessions: number;
    max_monthly_sessions: number;
    max_messages_per_session: number;
  };
}

interface EditUserDialogState {
  open: boolean;
  userId: string | null;
  userData: {
    role: "user" | "editor" | "admin" | "superadmin";
    package_name: string;
    max_daily_sessions: number;
    max_monthly_sessions: number;
    max_messages_per_session: number;
  };
}

const UsersList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [packageDialog, setPackageDialog] = useState<PackageDialogState>({
    open: false,
    userId: null,
    userData: {
      package_name: "free",
      max_daily_sessions: 10,
      max_monthly_sessions: 100,
      max_messages_per_session: 10,
    },
  });
  const [editUserDialog, setEditUserDialog] = useState<EditUserDialogState>({
    open: false,
    userId: null,
    userData: {
      role: "user",
      package_name: "free",
      max_daily_sessions: 10,
      max_monthly_sessions: 100,
      max_messages_per_session: 10,
    },
  });

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

  const handlePackageClick = (user: User) => {
    setPackageDialog({
      open: true,
      userId: user.id,
      userData: {
        package_name: user.package_name || "free",
        max_daily_sessions: user.max_daily_sessions || 10,
        max_monthly_sessions: user.max_monthly_sessions || 100,
        max_messages_per_session: user.max_messages_per_session || 10,
      },
    });
  };

  const handlePackageChange = async () => {
    if (!packageDialog.userId) return;

    try {
      await userService.updateUser(packageDialog.userId, packageDialog.userData);
      await loadUsers();
      setPackageDialog((prev) => ({ ...prev, open: false }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Paket bilgileri güncellenirken bir hata oluştu"
      );
    }
  };

  const handleEditClick = (user: User) => {
    setEditUserDialog({
      open: true,
      userId: user.id,
      userData: {
        role: user.role,
        package_name: user.package_name || "free",
        max_daily_sessions: user.max_daily_sessions || 10,
        max_monthly_sessions: user.max_monthly_sessions || 100,
        max_messages_per_session: user.max_messages_per_session || 10,
      },
    });
  };

  const handleEditDialogSave = async () => {
    if (!editUserDialog.userId) return;

    try {
      await userService.updateUser(editUserDialog.userId, editUserDialog.userData);
      await loadUsers();
      setEditUserDialog((prev) => ({ ...prev, open: false }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kullanıcı bilgileri güncellenirken bir hata oluştu"
      );
    }
  };

  const getPackageLabel = (packageName?: string) => {
    return PACKAGE_OPTIONS.find((p) => p.value === packageName)?.label || "Ücretsiz";
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
                  Paket
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
                      user.role === "superadmin" ? (
                        <AdminIcon fontSize="small" />
                      ) : user.role === "admin" ? (
                        <AdminIcon fontSize="small" />
                      ) : user.role === "editor" ? (
                        <EditIcon fontSize="small" />
                      ) : (
                        <UserIcon fontSize="small" />
                      )
                    }
                    label={
                      user.role === "superadmin"
                        ? "Super Admin"
                        : user.role === "admin"
                        ? "Admin"
                        : user.role === "editor"
                        ? "Editör"
                        : "Kullanıcı"
                    }
                    color={
                      user.role === "superadmin"
                        ? "error"
                        : user.role === "admin"
                        ? "primary"
                        : user.role === "editor"
                        ? "info"
                        : "default"
                    }
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<PackageIcon fontSize="small" />}
                    label={getPackageLabel(user.package_name)}
                    color={
                      user.package_name === "pro"
                        ? "success"
                        : user.package_name === "basic"
                        ? "info"
                        : "default"
                    }
                    size="small"
                    sx={{ fontWeight: 500 }}
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
                    <Tooltip title="Düzenle">
                      {user.id === currentUser?.id && currentUser.role !== "superadmin" ? (
                        <span>
                          <IconButton
                            size="small"
                            disabled
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(user)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Tooltip>
                    <Tooltip title="Sil">
                      {user.id === currentUser?.id ? (
                        <span>
                          <IconButton
                            size="small"
                            disabled
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      ) : (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Tooltip>
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

      <Dialog
        open={packageDialog.open}
        onClose={() => setPackageDialog((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
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
            Paket ve Limit Ayarları
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="package-select-label">Paket</InputLabel>
                <Select
                  labelId="package-select-label"
                  value={packageDialog.userData.package_name}
                  label="Paket"
                  onChange={(e) =>
                    setPackageDialog((prev) => ({
                      ...prev,
                      userData: { ...prev.userData, package_name: e.target.value },
                    }))
                  }
                >
                  {PACKAGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Günlük Oturum Limiti"
                type="number"
                value={packageDialog.userData.max_daily_sessions}
                onChange={(e) =>
                  setPackageDialog((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      max_daily_sessions: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                InputProps={{ inputProps: { min: -1 } }}
                helperText="-1 = Limitsiz"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Aylık Oturum Limiti"
                type="number"
                value={packageDialog.userData.max_monthly_sessions}
                onChange={(e) =>
                  setPackageDialog((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      max_monthly_sessions: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                InputProps={{ inputProps: { min: -1 } }}
                helperText="-1 = Limitsiz"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Oturum Başı Mesaj Limiti"
                type="number"
                value={packageDialog.userData.max_messages_per_session}
                onChange={(e) =>
                  setPackageDialog((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      max_messages_per_session: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                InputProps={{ inputProps: { min: -1 } }}
                helperText="-1 = Limitsiz"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPackageDialog((prev) => ({ ...prev, open: false }))}
            sx={{ textTransform: "none" }}
          >
            İptal
          </Button>
          <Button
            onClick={handlePackageChange}
            color="primary"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editUserDialog.open}
        onClose={() => setEditUserDialog((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
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
            Kullanıcı Düzenle
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={editUserDialog.userData.role}
                  label="Rol"
                  onChange={(e) =>
                    setEditUserDialog((prev) => ({
                      ...prev,
                      userData: { ...prev.userData, role: e.target.value as "user" | "editor" | "admin" | "superadmin" },
                    }))
                  }
                >
                  <MenuItem value="user">Kullanıcı</MenuItem>
                  <MenuItem value="editor">Editör</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="package-select-label">Paket</InputLabel>
                <Select
                  labelId="package-select-label"
                  value={editUserDialog.userData.package_name}
                  label="Paket"
                  onChange={(e) =>
                    setEditUserDialog((prev) => ({
                      ...prev,
                      userData: { ...prev.userData, package_name: e.target.value },
                    }))
                  }
                >
                  {PACKAGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Günlük Oturum Limiti"
                type="number"
                value={editUserDialog.userData.max_daily_sessions}
                onChange={(e) =>
                  setEditUserDialog((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      max_daily_sessions: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                InputProps={{ inputProps: { min: -1 } }}
                helperText="-1 = Limitsiz"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Aylık Oturum Limiti"
                type="number"
                value={editUserDialog.userData.max_monthly_sessions}
                onChange={(e) =>
                  setEditUserDialog((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      max_monthly_sessions: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                InputProps={{ inputProps: { min: -1 } }}
                helperText="-1 = Limitsiz"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Oturum Başı Mesaj Limiti"
                type="number"
                value={editUserDialog.userData.max_messages_per_session}
                onChange={(e) =>
                  setEditUserDialog((prev) => ({
                    ...prev,
                    userData: {
                      ...prev.userData,
                      max_messages_per_session: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                InputProps={{ inputProps: { min: -1 } }}
                helperText="-1 = Limitsiz"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditUserDialog((prev) => ({ ...prev, open: false }))}
            sx={{ textTransform: "none" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleEditDialogSave}
            color="primary"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
