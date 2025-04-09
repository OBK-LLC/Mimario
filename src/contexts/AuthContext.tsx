import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/authService";
import { tokenStorage } from "../utils/tokenStorage";
import { showToast } from "../utils/toast";
import { User } from "../types/auth";

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
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setUser(null);
        setToken(null);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setToken(storedToken);
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem("token", response.token);
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
      const response = await authService.register(email, password, metadata);
      localStorage.setItem("token", response.token);
      setToken(response.token);
      setUser(response.user);
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
      localStorage.removeItem("token");
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
