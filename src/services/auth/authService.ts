import { AuthResponse } from "../../types/auth";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL;
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || window.location.origin;

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Giriş başarısız");
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || "user",
          metadata: data.user.metadata || {},
        },
        token: data.token,
        refresh_token: data.refresh_token,
      };
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  async register(email: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kayıt başarısız");
      }
    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Şifre sıfırlama isteği başarısız");
      }
    } catch (error) {
      throw error;
    }
  },

  async changePassword(password: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStorage.getTokens()?.token}`,
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Şifre değiştirme başarısız");
      }
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(token: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Kullanıcı bilgileri alınamadı");
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        role: data.role || "user",
        metadata: data.metadata || {},
      };
    } catch (error) {
      throw error;
    }
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/verify-email?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "E-posta doğrulama başarısız");
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || "user",
          metadata: data.user.metadata || {},
        },
        token: data.token,
        refresh_token: data.refresh_token,
      };
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const token = tokenStorage.getTokens()?.token;
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Çıkış yapılamadı");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async googleSignIn(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin/google`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google ile giriş başarısız");
      }

      window.location.href = data.url;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
