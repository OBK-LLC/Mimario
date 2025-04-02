import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Divider,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
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
  const { login, googleSignIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
      // TODO: Show error notification
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Google login error:", error);
      // TODO: Show error notification
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
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
            >
              Giriş Yap
            </Button>
          </div>
        </form>

        <div className={styles.dividerContainer}>
          <Divider className={styles.divider}>
            <Typography variant="body2" color="textSecondary">
              veya
            </Typography>
          </Divider>
        </div>

        <div className={styles.socialLogin}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            className={styles.googleButton}
          >
            Google ile giriş yap
          </Button>
        </div>

        <div className={styles.footer}>
          <Typography variant="body2">
            Hesabınız yok mu?{" "}
            <MuiLink component={Link} to="/signup" className={styles.link}>
              Kayıt Olun
            </MuiLink>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Login;
