import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { authService } from "../services/auth/authService";
import { tokenStorage } from "../utils/tokenStorage";
import { showToast } from "../utils/toast";
import { User, AuthResponse } from "../types/auth";

const LoadingScreen = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: theme.zIndex.modal + 1,
        gap: 2,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      <Box
        sx={{
          color: theme.palette.text.secondary,
          typography: "body2",
          fontWeight: 500,
        }}
      >
        Yönlendiriliyor...
      </Box>
    </Box>
  );
};

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    tokenStorage.getTokens()?.token || null
  );
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      const tokens = tokenStorage.getTokens();
      if (!tokens?.token) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setToken(tokens.token);
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
      setToken(null);
      tokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Eğer loading durumundaysa ve token varsa, loading ekranı göster
  if (isLoading && token) {
    return <LoadingScreen />;
  }

  const login = async (email: string, password: string) => {
    try {
      const response = (await authService.login(
        email,
        password
      )) as AuthResponse;

      // Email doğrulaması kontrolü
      if (!response.user.metadata?.email_verified) {
        // Token'ı geçici olarak saklayalım ki verification sayfasında kullanabilelim
        tokenStorage.setTokens(response.token, response.refresh_token);
        navigate("/verification");
        throw new Error("Lütfen e-posta adresinizi doğrulayın.");
      }

      tokenStorage.setTokens(response.token, response.refresh_token);
      setToken(response.token);
      setUser(response.user);
      navigate("/");
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    try {
      const response = (await authService.register(
        email,
        password,
        metadata
      )) as AuthResponse;
      // Kayıt sonrası sadece temp_token'ı saklayalım
      tokenStorage.setTokens(response.token, response.refresh_token);
      navigate("/verification");
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenStorage.clearTokens();
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      showToast.success(
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin."
      );
    } catch (error: any) {
      console.error("Forgot password error:", error);
      if (error.message) {
        showToast.error(error.message);
      } else {
        showToast.error(
          "Şifre sıfırlama işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  };

  const changePassword = async (password: string) => {
    try {
      await authService.changePassword(password);
      showToast.success(
        "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz."
      );
    } catch (error: any) {
      console.error("Change password error:", error);
      if (error.message) {
        showToast.error(error.message);
      } else {
        showToast.error(
          "Şifre değiştirme işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      await authService.googleSignIn();
    } catch (error) {
      console.error("Google sign-in error:", error);
      showToast.error("Google ile giriş yapılamadı.");
      throw error;
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    changePassword,
    googleSignIn,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
