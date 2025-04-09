import axios from "axios";
import { AuthResponse } from "../../types/auth";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL;
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || window.location.origin;

// Axios instance oluşturuyoruz
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - her istekte token varsa ekliyor
api.interceptors.request.use((config) => {
  const tokens = tokenStorage.getTokens();
  if (tokens?.token) {
    config.headers.Authorization = `Bearer ${tokens.token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || "user",
          name: data.user.name,
          metadata: data.user.metadata || {},
        },
        token: data.token,
        refresh_token: data.refresh_token,
      };
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        if (data.error === "Invalid login credentials") {
          throw new Error("E-posta veya şifre hatalı.");
        }
        if (data.error === "Email not verified") {
          throw new Error(
            "E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin."
          );
        }
        throw new Error(
          data.error || "Giriş yapılamadı. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  },

  async register(
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ): Promise<void> {
    try {
      await api.post("/api/auth/register", {
        email,
        password,
        name: metadata?.full_name || "",
      });
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        if (data.error === "Email already exists") {
          throw new Error(
            "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapmayı deneyin veya farklı bir e-posta adresi kullanın."
          );
        }
        if (data.error?.includes("password")) {
          throw new Error(
            "Şifreniz güvenli değil. Lütfen en az 8 karakter uzunluğunda, bir büyük harf, bir küçük harf ve bir rakam içeren bir şifre belirleyin."
          );
        }
        if (data.error?.includes("email")) {
          throw new Error("Lütfen geçerli bir e-posta adresi girin.");
        }
        throw new Error(
          data.error ||
            "Kayıt işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/api/auth/reset-password", { email });
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        if (data.error === "User not found") {
          throw new Error("Bu e-posta adresine kayıtlı bir hesap bulunamadı.");
        }
        throw new Error(
          data.error ||
            "Şifre sıfırlama işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  },

  async changePassword(password: string): Promise<void> {
    try {
      await api.put("/api/auth/change-password", { password });
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        if (
          data.error ===
          "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character"
        ) {
          throw new Error(
            "Şifreniz en az bir rakam, bir küçük harf, bir büyük harf ve bir özel karakter içermelidir."
          );
        }
        if (data.error?.includes("password")) {
          throw new Error(
            "Şifreniz güvenli değil. Lütfen en az 8 karakter uzunluğunda, bir büyük harf, bir küçük harf ve bir rakam içeren bir şifre belirleyin."
          );
        }
        throw new Error(
          data.error ||
            "Şifre değiştirme işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    try {
      const { data } = await api.get("/api/auth/current-user");
      return {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
        metadata: data.metadata,
      };
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        throw new Error(data.error || "Kullanıcı bilgileri alınamadı");
      }
      throw error;
    }
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const { data } = await api.post(`/api/auth/verify-email?token=${token}`);
      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || "user",
          name: data.user.name,
          metadata: data.user.metadata || {},
        },
        token: data.token,
        refresh_token: data.refresh_token,
      };
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        throw new Error(data.error || "E-posta doğrulama başarısız");
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/signout");
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        throw new Error(data.error || "Çıkış yapılamadı");
      }
      throw error;
    }
  },

  async googleSignIn(): Promise<void> {
    try {
      const { data } = await api.get("/api/auth/signin/google");
      window.location.href = data.url;
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        throw new Error(data.error || "Google ile giriş başarısız");
      }
      throw error;
    }
  },
};

export default authService;
