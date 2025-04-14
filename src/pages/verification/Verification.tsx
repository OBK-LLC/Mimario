import {
  Box,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MarkEmailRead } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { authService } from "../../services/auth/authService";
import { showToast } from "../../utils/toast";
import styles from "./verification.module.css";

const Verification = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          const response = await authService.verifyEmail(token);
          setIsVerified(true);
          // Doğrulama başarılı olduğunda temp_token'ı kaldır ve normal token'ı ayarla
          localStorage.removeItem("temp_token");
          localStorage.setItem("token", response.token);
          showToast.success("E-posta adresiniz başarıyla doğrulandı!");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } catch (error) {
          showToast.error(
            "E-posta doğrulama başarısız oldu. Lütfen tekrar deneyin."
          );
        }
      }
      setIsVerifying(false);
    };

    verifyEmail();
  }, [navigate]);

  const handleResendVerification = async () => {
    try {
      const tempToken = localStorage.getItem("temp_token");
      if (!tempToken) {
        showToast.error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      await authService.resendVerification(tempToken);
      showToast.success("Doğrulama e-postası tekrar gönderildi!");
    } catch (error) {
      showToast.error(
        "Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formContainer}>
        <div className={styles.header}>
          <Typography variant="h1" className={styles.title}>
            Mimario
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            E-posta Doğrulama
          </Typography>
        </div>

        <MarkEmailRead className={styles.icon} sx={{ fontSize: 64 }} />

        {isVerifying ? (
          <>
            <Typography variant="body1" className={styles.message}>
              E-posta doğrulaması kontrol ediliyor...
            </Typography>
            <CircularProgress size={24} sx={{ mb: 3 }} />
          </>
        ) : isVerified ? (
          <>
            <Typography variant="body1" className={styles.message}>
              E-posta adresiniz başarıyla doğrulandı! Ana sayfaya
              yönlendiriliyorsunuz...
            </Typography>
            <CircularProgress size={24} sx={{ mb: 3 }} />
          </>
        ) : (
          <>
            <Typography variant="body1" className={styles.message}>
              E-posta adresinize bir doğrulama bağlantısı gönderdik. Lütfen
              gelen kutunuzu kontrol edin ve hesabınızı doğrulamak için
              bağlantıya tıklayın.
            </Typography>

            <Typography variant="body2" className={styles.message}>
              E-posta almadıysanız spam klasörünü kontrol etmeyi unutmayın.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleResendVerification}
              sx={{ mb: 3 }}
            >
              Doğrulama E-postasını Tekrar Gönder
            </Button>

            <Typography variant="body2">
              <MuiLink component={Link} to="/login" className={styles.link}>
                Giriş sayfasına dön
              </MuiLink>
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Verification;
