import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  Avatar,
  Snackbar,
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  ArrowBack,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Message as MessageIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { showToast } from "../../utils/toast";
import { userService } from "../../services/user/userService";
import type { UserUsageResponse } from "../../types/usage";
import styles from "./profile.module.css";

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordData {
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<string>("/default-avatar.png");
  const [profileMessage, setProfileMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [usageData, setUsageData] = useState<UserUsageResponse | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.display_name || user.name || "",
        email: user.email,
        phoneNumber: "",
      });

      if (user.metadata?.avatar_url) {
        setAvatar(user.metadata.avatar_url);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await userService.getUserUsage();
        setUsageData(data);
      } catch (error) {
        console.error("Usage data fetch error:", error);
      }
    };
    fetchUsage();
  }, []);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${
          process.env.VITE_API_URL || "http://localhost:3000"
        }/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            display_name: profileData.fullName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Profil güncellenirken bir hata oluştu");
      }

      setProfileMessage({
        text: "Profil başarıyla güncellendi!",
        type: "success",
      });
    } catch (error) {
      setProfileMessage({
        text: "Profil güncellenirken bir hata oluştu",
        type: "error",
      });
    }
  };

  const handleSubmitPassword = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword.length < 8) {
      showToast.error("Yeni şifre en az 8 karakter olmalıdır.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error("Şifreler eşleşmiyor.");
      return;
    }

    try {
      await changePassword(passwordData.newPassword);

      // Başarılı olduğunda formu temizle
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password change error:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await userService.updateProfile({
        display_name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phoneNumber,
      });
      setSuccessMessage("Profil başarıyla güncellendi");
      // Kullanıcı bilgilerini güncelle
    } catch (error: any) {
      setErrorMessage(error.message || "Profil güncellenemedi");
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.profileContainer}>
        <Paper className={styles.sidebar} elevation={0}>
          <div className={styles.header}>
            <Typography variant="h4" className={styles.title}>
              Profil Ayarları
            </Typography>
            <Typography variant="body1" className={styles.subtitle}>
              Hesap ayarlarınızı ve tercihlerinizi yönetin
            </Typography>
          </div>
          <div className={styles.avatarContainer}>
            <img src={avatar} alt="Profil" className={styles.avatar} />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              className={styles.uploadButton}
            >
              Fotoğraf Değiştir
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </Button>
          </div>
          <div className={styles.sidebarFooter}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              variant="contained"
              fullWidth
              className={styles.backButton}
            >
              Geri Dön
            </Button>
          </div>
        </Paper>

        <Box className={styles.mainContent}>
          <Paper className={styles.section} elevation={0}>
            <Typography variant="h5" className={styles.sectionTitle}>
              Kullanım Limitleri
            </Typography>
            {usageData ? (
              <Box className={styles.usageInfo}>
                <Paper
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 1
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        mb: 0.5,
                        color: 'text.secondary'
                      }}
                    >
                      Paket Bilgisi
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'text.primary'
                      }}
                    >
                      {usageData.limits.package_name === 'free' ? 'Ücretsiz' : 
                       usageData.limits.package_name === 'pro' ? 'Profesyonel' : 
                       usageData.limits.package_name === 'enterprise' ? 'Kurumsal' : 
                       usageData.limits.package_name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 3 }}>
                    {/* Günlük Oturum */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ mr: 1.5 }}>
                          <AccessTimeIcon sx={{ color: 'text.primary' }} />
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          Günlük Oturum
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          sx={{
                            height: 4,
                            bgcolor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                              width: `${Math.min((usageData.current_usage.daily_sessions_created / usageData.limits.max_daily_sessions) * 100, 100)}%`,
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: '8px',
                            color: 'text.secondary'
                          }}
                        >
                          {usageData.current_usage.daily_sessions_created} / {usageData.limits.max_daily_sessions}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Aylık Oturum */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ mr: 1.5 }}>
                          <CalendarTodayIcon sx={{ color: 'text.primary' }} />
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          Aylık Oturum
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          sx={{
                            height: 4,
                            bgcolor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                              width: `${Math.min((usageData.current_usage.monthly_sessions_created / usageData.limits.max_monthly_sessions) * 100, 100)}%`,
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: '8px',
                            color: 'text.secondary'
                          }}
                        >
                          {usageData.current_usage.monthly_sessions_created} / {usageData.limits.max_monthly_sessions}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Oturum Başına Mesaj */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ mr: 1.5 }}>
                          <MessageIcon sx={{ color: 'text.primary' }} />
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          Oturum Başına Mesaj
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          sx={{
                            height: 4,
                            bgcolor: 'divider',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                              width: '100%',
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: '8px',
                            color: 'text.secondary'
                          }}
                        >
                          {usageData.limits.max_messages_per_session} / {usageData.limits.max_messages_per_session}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Box className={styles.loadingContainer}>
                <Box className={styles.loadingAnimation}></Box>
                <Typography variant="body2" className={styles.loadingText}>
                  Kullanım bilgileri yükleniyor...
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper className={styles.section} elevation={0}>
            <Typography variant="h5" className={styles.sectionTitle}>
              Kişisel Bilgiler
            </Typography>
            <form onSubmit={handleProfileSubmit} className={styles.form}>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="İsim Soyisim"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  variant="outlined"
                />
              </div>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  variant="outlined"
                />
              </div>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="Telefon Numarası"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  disabled
                  variant="outlined"
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={styles.button}
              >
                Değişiklikleri Kaydet
              </Button>
              <Collapse in={!!profileMessage}>
                <Alert severity={profileMessage?.type || "info"} sx={{ mt: 2 }}>
                  {profileMessage?.text}
                </Alert>
              </Collapse>
            </form>
          </Paper>

          <Paper className={styles.section} elevation={0}>
            <Typography variant="h5" className={styles.sectionTitle}>
              Şifre Değiştir
            </Typography>
            <form onSubmit={handleSubmitPassword} className={styles.form}>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="Yeni Şifre"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="Yeni Şifre (Tekrar)"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={styles.submitButton}
              >
                Şifreyi Değiştir
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
