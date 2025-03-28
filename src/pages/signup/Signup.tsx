import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  FormHelperText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PasswordStrengthBar from "react-password-strength-bar-with-style-item";
import styles from "./signup.module.css";
import { SignupFormData, SignupProps } from "../../types/auth";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Adınızı girin"),
  lastName: yup.string().required("Soyadınızı girin"),
  email: yup
    .string()
    .required("E-posta adresinizi girin")
    .email("Geçerli bir e-posta adresi girin"),
  password: yup
    .string()
    .required("Şifre girin")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: yup
    .string()
    .required("Şifreyi tekrar girin")
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor"),
  agreeToTerms: yup
    .boolean()
    .required()
    .oneOf([true], "Devam etmek için kabul etmelisiniz"),
});

const Signup = ({ onSignup }: SignupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    // TODO: Implement actual signup logic
    console.log("Signup form submitted:", data);
    onSignup();
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.formContainer}>
        <div className={styles.header}>
          <Typography variant="h1" className={styles.title}>
            Mimario
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Yeni hesap oluşturun
          </Typography>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ad"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div className={styles.formField}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Soyad"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    variant="outlined"
                  />
                )}
              />
            </div>
          </div>

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
            {password && (
              <div className={styles.passwordStrength}>
                <PasswordStrengthBar
                  password={password}
                  scoreWords={[
                    "Çok Zayıf",
                    "Zayıf",
                    "Orta",
                    "Güçlü",
                    "Çok Güçlü",
                  ]}
                  minLength={6}
                  shortScoreWord="Çok Kısa"
                />
              </div>
            )}
          </div>

          <div className={styles.formField}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Şifreyi Tekrar Girin"
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
              )}
            />
          </div>

          <div className={styles.termsContainer}>
            <Controller
              name="agreeToTerms"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      <MuiLink
                        component={Link}
                        to="/terms"
                        className={styles.link}
                      >
                        Kullanım Şartları
                      </MuiLink>{" "}
                      ve{" "}
                      <MuiLink
                        component={Link}
                        to="/privacy"
                        className={styles.link}
                      >
                        Gizlilik Politikası
                      </MuiLink>
                      'nı kabul ediyorum
                    </Typography>
                  }
                />
              )}
            />
            {errors.agreeToTerms && (
              <FormHelperText error>
                {errors.agreeToTerms.message}
              </FormHelperText>
            )}
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
              fullWidth
            >
              Kayıt Ol
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <Typography variant="body2">
            Zaten hesabınız var mı?{" "}
            <MuiLink component={Link} to="/login" className={styles.link}>
              Giriş Yapın
            </MuiLink>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Signup;
