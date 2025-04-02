import {
  Box,
  Typography,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MarkEmailRead } from "@mui/icons-material";
import styles from "./verification.module.css";

const Verification = () => {
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

        <Typography variant="body1" className={styles.message}>
          E-posta adresinize bir doğrulama bağlantısı gönderdik. Lütfen gelen
          kutunuzu kontrol edin ve hesabınızı doğrulamak için bağlantıya
          tıklayın.
        </Typography>

        <Typography variant="body2" className={styles.message}>
          E-posta almadıysanız spam klasörünü kontrol etmeyi unutmayın.
        </Typography>

        <CircularProgress size={24} sx={{ mb: 3 }} />

        <Typography variant="body2">
          <MuiLink component={Link} to="/login" className={styles.link}>
            Giriş sayfasına dön
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Verification;
