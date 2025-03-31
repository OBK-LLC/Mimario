import React, { useState, ChangeEvent, FormEvent } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+90 555 123 4567",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
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

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // API call to update profile would go here
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

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: "Şifreler eşleşmiyor", type: "error" });
      return;
    }
    try {
      // API call to change password would go here
      setPasswordMessage({
        text: "Şifre başarıyla değiştirildi!",
        type: "success",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage({
        text: "Şifre değiştirilirken bir hata oluştu",
        type: "error",
      });
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
              Kişisel Bilgiler
            </Typography>
            <form onSubmit={handleProfileSubmit} className={styles.form}>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
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
                  onChange={handleProfileChange}
                  variant="outlined"
                />
              </div>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="Telefon Numarası"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
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
            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <div className={styles.formField}>
                <TextField
                  fullWidth
                  label="Mevcut Şifre"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
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
                className={styles.button}
              >
                Şifreyi Değiştir
              </Button>
              <Collapse in={!!passwordMessage}>
                <Alert
                  severity={passwordMessage?.type || "info"}
                  sx={{ mt: 2 }}
                >
                  {passwordMessage?.text}
                </Alert>
              </Collapse>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
