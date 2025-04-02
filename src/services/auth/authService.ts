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
        if (data.error === "Email already exists") {
          throw new Error(
            "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapmayı deneyin veya farklı bir e-posta adresi kullanın."
          );
        }
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
        if (data.error?.includes("email")) {
          throw new Error("Lütfen geçerli bir e-posta adresi girin.");
        }
        throw new Error(
          data.error ||
            "Kayıt işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (error) {
      console.error("Registration error details:", error);
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
        if (data.error === "User not found") {
          throw new Error("Bu e-posta adresine kayıtlı bir hesap bulunamadı.");
        }
        throw new Error(
          data.error ||
            "Şifre sıfırlama işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin."
        );
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
