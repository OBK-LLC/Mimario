import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import styles from "./login.module.css";
import { LoginFormData } from "../../types/auth";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("E-posta adresinizi girin")
    .email("Geçerli bir e-posta adresi girin"),
  password: yup
    .string()
    .required("Şifrenizi girin")
    .min(8, "Şifre en az 8 karakter olmalıdır"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      await login(data.email, data.password);
      toast.success("Başarıyla giriş yaptınız!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      
      // API'den gelen özel hata durumları
      if (error.message.includes("E-posta adresi veya şifre hatalı")) {
        setLoginError("E-posta adresi veya şifre hatalı");
        setError("password", { message: "Şifrenizi kontrol edin" });
      } else if (error.message.includes("hesap kilitlendi")) {
        setLoginError("Çok fazla başarısız giriş denemesi. Lütfen bir süre bekleyin.");
      } else if (error.message.includes("doğrulanmamış")) {
        setLoginError("E-posta adresinizi doğrulamanız gerekiyor. Lütfen e-postanızı kontrol edin.");
      } else {
        setLoginError(error.message || "Giriş yapılırken bir hata oluştu");
      }
      
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
            Hesabınıza giriş yapın
          </Typography>
        </div>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formField}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="E-posta Adresi"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              )}
            />
          </div>

          <div className={styles.formField}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Şifre"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  variant="outlined"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isSubmitting}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className={styles.forgotPassword}>
            <MuiLink
              component={Link}
              to="/forgot-password"
              className={styles.link}
              tabIndex={isSubmitting ? -1 : 0}
            >
              Şifremi unuttum
            </MuiLink>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Giriş Yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <Typography variant="body2">
            Hesabınız yok mu?{" "}
            <MuiLink 
              component={Link} 
              to="/signup" 
              className={styles.link}
              tabIndex={isSubmitting ? -1 : 0}
            >
              Kayıt Olun
            </MuiLink>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Login;
