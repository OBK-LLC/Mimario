import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./signup.module.css";
import { SignupFormData } from "../../types/auth";
import { toast } from "react-toastify";

const validationSchema: yup.ObjectSchema<SignupFormData> = yup.object().shape({
  fullName: yup
    .string()
    .required("Ad ve soyadınızı girin")
    .min(2, "Ad soyad en az 2 karakter olmalıdır")
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Ad soyad sadece harf içerebilir"),
  email: yup
    .string()
    .required("E-posta adresinizi girin")
    .email("Geçerli bir e-posta adresi girin")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      "Geçerli bir e-posta adresi girin"
    ),
  password: yup
    .string()
    .required("Şifrenizi girin")
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/,
      "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
    ),
  confirmPassword: yup
    .string()
    .required("Şifrenizi tekrar girin")
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor"),
  agreeToTerms: yup
    .boolean()
    .required()
    .oneOf([true], "Kullanım koşullarını kabul etmelisiniz"),
});

const resolver: Resolver<SignupFormData> = yupResolver(validationSchema);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 25) return "#f44336";
    if (strength <= 50) return "#ff9800";
    if (strength <= 75) return "#ffc107";
    return "#4caf50";
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await register(data.email, data.password, { full_name: data.fullName });
      toast.success("Kayıt işlemi başarılı! Hoş geldiniz.");
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formField}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Ad Soyad"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  variant="outlined"
                  disabled={isSubmitting}
                />
              )}
            />
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
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          <div className={styles.formField}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    fullWidth
                    label="Şifre"
                    type={showPassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    variant="outlined"
                    disabled={isSubmitting}
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
                  {password && (
                    <Box className={styles.passwordStrength}>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          backgroundColor: "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: getPasswordStrengthColor(passwordStrength),
                          },
                        }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        Şifre güvenliği: {passwordStrength}%
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            />
          </div>

          <div className={styles.formField}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Şifre Tekrar"
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  variant="outlined"
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className={styles.formField}>
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
                      disabled={isSubmitting}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      <MuiLink href="/terms" className={styles.link}>
                        Kullanım koşullarını
                      </MuiLink>{" "}
                      kabul ediyorum
                    </Typography>
                  }
                />
              )}
            />
            {errors.agreeToTerms && (
              <Typography variant="caption" color="error">
                {errors.agreeToTerms.message}
              </Typography>
            )}
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
              {isSubmitting ? "Kayıt Olunuyor..." : "Kayıt Ol"}
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
