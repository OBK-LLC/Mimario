import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/authService";

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
  changePassword: (newPassword: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const tokenData = localStorage.getItem("supabase.auth.token");
      if (tokenData) {
        const { token } = JSON.parse(tokenData);
        const userData = await authService.getCurrentUser(token);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      localStorage.removeItem("supabase.auth.token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem(
        "supabase.auth.token",
        JSON.stringify({ token: response.token })
      );
      setUser(response.user);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await authService.register(email, password);
      localStorage.setItem(
        "supabase.auth.token",
        JSON.stringify({ token: response.token })
      );
      setUser(response.user);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const tokenData = localStorage.getItem("supabase.auth.token");
      console.log("Attempting logout with token data:", tokenData);

      if (tokenData) {
        const { token } = JSON.parse(tokenData);
        console.log("Sending logout request to backend...");
        await authService.logout(token);
        console.log("Logout request successful");
      }

      console.log("Removing token from localStorage...");
      localStorage.removeItem("supabase.auth.token");

      console.log("Clearing user state...");
      setUser(null);

      console.log("Navigating to homepage...");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the backend request fails, we should still clear the local state
      localStorage.removeItem("supabase.auth.token");
      setUser(null);
      navigate("/");
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const tokenData = localStorage.getItem("supabase.auth.token");
      if (!tokenData) {
        throw new Error("No authentication token found");
      }
      const { token } = JSON.parse(tokenData);
      await authService.changePassword(newPassword, token);
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const { url } = await authService.googleSignIn();
      window.location.href = url;
    } catch (error) {
      console.error("Google sign-in error:", error);
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
