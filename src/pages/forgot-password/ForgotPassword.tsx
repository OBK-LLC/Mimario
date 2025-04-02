import {
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./forgot-password.module.css";
import { ForgotPasswordFormData } from "../../types/auth";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("E-posta adresinizi girin")
    .email("Geçerli bir e-posta adresi girin"),
});

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      // TODO: Show success notification
    } catch (error) {
      console.error("Password reset error:", error);
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
            Şifrenizi sıfırlayın
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

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
              fullWidth
            >
              Şifre Sıfırlama Bağlantısı Gönder
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <Typography variant="body2">
            <MuiLink component={Link} to="/login" className={styles.link}>
              Giriş sayfasına dön
            </MuiLink>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
