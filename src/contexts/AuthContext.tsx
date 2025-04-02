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
      showToast.success("Başarıyla giriş yaptınız!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await authService.register(email, password);
      showToast.success("Kayıt başarılı! Lütfen e-postanızı doğrulayın.");
      navigate("/verification");
    } catch (error) {
      console.error("Registration error:", error);
      showToast.error("Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      tokenStorage.clearTokens();
      setUser(null);
      showToast.success("Başarıyla çıkış yaptınız!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showToast.error("Çıkış yapılırken bir hata oluştu!");
      tokenStorage.clearTokens();
      setUser(null);
      navigate("/");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      showToast.success(
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      showToast.error("Şifre sıfırlama bağlantısı gönderilemedi.");
      throw error;
    }
  };

  const changePassword = async (password: string) => {
    try {
      await authService.changePassword(password);
      showToast.success("Şifreniz başarıyla değiştirildi.");
    } catch (error) {
      console.error("Change password error:", error);
      showToast.error("Şifre değiştirilemedi.");
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
