import axios from "axios";
import { AuthResponse, User } from "../../types/auth";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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

interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  private get headers() {
    return {
      "Content-Type": "application/json",
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/api/auth/login`,
        { email, password },
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Giriş yapılamadı");
      }
      throw new Error("Sunucuya bağlanılamadı");
    }
  }

  async register(
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/api/auth/register`,
        { email, password, ...metadata },
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Kayıt olunamadı");
      }
      throw new Error("Sunucuya bağlanılamadı");
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/auth/signout`,
        {},
        {
          headers: {
            ...this.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const { data } = await axios.get<User>(
        `${API_URL}/api/auth/current-user`,
        {
          headers: {
            ...this.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Kullanıcı bilgileri alınamadı"
        );
      }
      throw new Error("Sunucuya bağlanılamadı");
    }
  }

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
  }

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
  }

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
  }

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
  }
}

export const authService = new AuthService();
