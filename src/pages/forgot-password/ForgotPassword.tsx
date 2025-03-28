import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Paper,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { CloseOutlined, ArrowBack } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import styles from "./forgot-password.module.css";
import { ForgotPasswordFormData, ForgotPasswordProps } from "../../types/auth";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("E-posta adresinizi girin")
    .email("Geçerli bir e-posta adresi girin"),
});

const ForgotPassword = ({ onResetRequest }: ForgotPasswordProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    // API isteği gerçekleştirilecek
    console.log("Şifre sıfırlama isteği gönderildi:", data);

    // Form gönderildikten sonra
    onResetRequest(data.email);
    setIsSubmitted(true);
    setAlertOpen(true);
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const buttonAnimation = {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
  };

  return (
    <Box className={styles.container}>
      <Paper
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={formAnimation}
        elevation={3}
        className={styles.formContainer}
      >
        <div className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Şifremi Unuttum
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Şifrenizi sıfırlamak için e-posta adresinizi girin
          </Typography>
        </div>

        <Collapse in={alertOpen}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAlertOpen(false)}
              >
                <CloseOutlined fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 3 }}
          >
            {isSubmitted &&
              `${getValues(
                "email"
              )} adresine şifre sıfırlama bağlantısı gönderildi.`}
          </Alert>
        </Collapse>

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
                  disabled={isSubmitted}
                />
              )}
            />
          </div>

          <div className={styles.formActions}>
            <Button
              component={motion.button}
              variants={buttonAnimation}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={styles.submitButton}
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitted
                ? "Bağlantı Gönderildi"
                : "Şifre Sıfırlama Bağlantısı Gönder"}
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <MuiLink
            component={Link}
            to="/login"
            className={styles.backLink}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ArrowBack fontSize="small" />
            Giriş sayfasına dön
          </MuiLink>
        </div>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
