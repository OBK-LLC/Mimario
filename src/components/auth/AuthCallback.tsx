import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authService } from "../../services/auth/authService";
import { tokenStorage } from "../../utils/tokenStorage";
import { showToast } from "../../utils/toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // E-posta doğrulama için
        if (location.search.includes("type=verify_email")) {
          const token = new URLSearchParams(location.search).get("token");
          if (!token) {
            showToast.error("Doğrulama token'ı bulunamadı");
            throw new Error("Doğrulama token'ı bulunamadı");
          }

          const response = await authService.verifyEmail(token);

          // Doğrulama başarılı, otomatik giriş yap
          tokenStorage.setTokens(response.token, response.refresh_token);
          showToast.success("E-posta adresiniz başarıyla doğrulandı!");

          // Ana sayfaya yönlendir
          window.location.href = "/";
          return;
        }

        // Google OAuth için
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/callback${location.search}`
        );

        if (!response.ok) {
          showToast.error("Google ile giriş başarısız oldu");
          throw new Error("Authentication failed");
        }

        const data = await response.json();
        tokenStorage.setTokens(data.token, data.refresh_token);
        showToast.success("Google ile giriş başarılı!");

        window.location.href = "/";
      } catch (error) {
        console.error("Error in auth callback:", error);
        showToast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">İşleminiz tamamlanıyor...</Typography>
    </Box>
  );
};

export default AuthCallback;
