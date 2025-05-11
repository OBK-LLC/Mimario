import axios from "axios";
import { AuthResponse, User } from "../../types/auth";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

interface ErrorResponse {
  message?: string;
  error?: string;
  details?: {
    field?: string;
    code?: string;
  }[];
}

class AuthService {
  private get headers() {
    return {
      "Content-Type": "application/json",
    };
  }

  private getLocalizedErrorMessage(error: any): string {
    if (!error.response) {
      return "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.";
    }

    const data = error.response.data as ErrorResponse;
    const status = error.response.status;

    // HTTP durum kodlarına göre özel mesajlar
    switch (status) {
      case 401:
        return "E-posta adresi veya şifre hatalı.";
      case 403:
        return "Bu işlem için yetkiniz bulunmuyor.";
      case 404:
        return "Hesap bulunamadı.";
      case 429:
        return "Çok fazla başarısız deneme. Lütfen bir süre bekleyin.";
    }

    // API'den gelen özel hata mesajları
    if (data.error === "InvalidCredentials") {
      return "E-posta adresi veya şifre hatalı.";
    }
    if (data.error === "EmailAlreadyExists") {
      return "Bu e-posta adresi zaten kullanılıyor.";
    }
    if (data.error === "WeakPassword") {
      return "Şifre çok zayıf. En az 8 karakter uzunluğunda, bir büyük harf, bir küçük harf ve bir rakam içermelidir.";
    }
    if (data.error === "InvalidEmail") {
      return "Geçersiz e-posta adresi.";
    }
    if (data.error === "AccountLocked") {
      return "Hesabınız kilitlendi. Lütfen daha sonra tekrar deneyin.";
    }
    if (data.error === "EmailNotVerified") {
      return "E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.";
    }

    return data.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
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
      throw new Error(this.getLocalizedErrorMessage(error));
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
        {
          email,
          password,
          name: metadata?.full_name,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.getLocalizedErrorMessage(error));
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
      throw new Error(this.getLocalizedErrorMessage(error));
    }
  }

  async getCurrentUser(): Promise<User> {
    const tokens = tokenStorage.getTokens();
    if (!tokens?.token) {
      throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
    }

    try {
      const { data } = await axios.get<User>(
        `${API_URL}/api/auth/current-user`,
        {
          headers: {
            ...this.headers,
            Authorization: `Bearer ${tokens.token}`,
          },
        }
      );
      return {
        ...data,
        display_name: data.display_name || data.name || "",
      };
    } catch (error: any) {
      throw new Error(this.getLocalizedErrorMessage(error));
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/auth/reset-password`,
        { email },
        { headers: this.headers }
      );
    } catch (error: any) {
      throw new Error(this.getLocalizedErrorMessage(error));
    }
  }

  async changePassword(password: string): Promise<void> {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        { password },
        {
          headers: {
            ...this.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      throw new Error(this.getLocalizedErrorMessage(error));
    }
  }

  async refreshToken(refresh_token: string): Promise<AuthResponse> {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/token`,
        { refresh_token },
        { headers: this.headers }
      );
      return data;
    } catch (error: any) {
      throw new Error(this.getLocalizedErrorMessage(error));
    }
  }
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = new AuthService();
