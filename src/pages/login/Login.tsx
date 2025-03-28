import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./login.module.css";
import { LoginFormData, LoginProps } from "../../types/auth";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("E-posta adresinizi girin")
    .email("Geçerli bir e-posta adresi girin"),
  password: yup
    .string()
    .required("Şifrenizi girin")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
});

const Login = ({ onLogin }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = (data: LoginFormData) => {
    // TODO: Implement actual login logic
    console.log("Login form submitted:", data);
    onLogin();
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
