import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/authService";
import { tokenStorage } from "../utils/tokenStorage";
import { showToast } from "../utils/toast";

interface User {
  id: string;
  email: string;
  role: string;
  metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
}

interface StoredToken {
  token: string;
  refresh_token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth.token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const getStoredToken = (): StoredToken | null => {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return null;
    try {
      return JSON.parse(tokenData);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  };

  const checkUser = async () => {
    try {
      const tokens = tokenStorage.getTokens();
      if (tokens?.token) {
        const userData = await authService.getCurrentUser(tokens.token);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      tokenStorage.setTokens(response.token, response.refresh_token);
      setUser(response.user);
      showToast.success("Hoş geldiniz! Başarıyla giriş yaptınız.");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message) {
        showToast.error(error.message);
      } else {
        showToast.error("Giriş yapılamadı. Lütfen daha sonra tekrar deneyin.");
      }
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await authService.register(email, password);
      showToast.success(
        "Kayıt işleminiz başarıyla tamamlandı! Lütfen e-posta adresinize gönderilen doğrulama bağlantısına tıklayın."
      );
      navigate("/verification");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message) {
        showToast.error(error.message);
      } else {
        showToast.error(
          "Kayıt işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      tokenStorage.clearTokens();
      setUser(null);
      showToast.success(
        "Güvenli bir şekilde çıkış yaptınız. Tekrar görüşmek üzere!"
      );
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showToast.error(
        "Çıkış yaparken bir sorun oluştu. Ancak güvenliğiniz için oturumunuz sonlandırıldı."
      );
      tokenStorage.clearTokens();
      setUser(null);
      navigate("/");
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        changePassword,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
