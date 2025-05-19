import axios, { AxiosError } from "axios";
import { Session, ApiResponse } from "../../types/session";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: {
    current?: number;
    limit?: number;
    type?: string;
  };
}

function normalizeMessage(msg: any) {
  return {
    ...msg,
    timestamp: msg.timestamp
      ? typeof msg.timestamp === "string"
        ? new Date(msg.timestamp).getTime()
        : msg.timestamp
      : msg.createdAt
      ? new Date(msg.createdAt).getTime()
      : Date.now(),
    sender: msg.role === "assistant" ? "ai" : "user",
  };
}

class SessionService {
  private get headers() {
    const tokens = tokenStorage.getTokens();
    return {
      Authorization: tokens?.token ? `Bearer ${tokens.token}` : "",
      "Content-Type": "application/json",
    };
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        let message = this.getLocalizedErrorMessage(errorData.message);

        // Limit detayları varsa mesaja ekle
        if (
          errorData.details?.current !== undefined &&
          errorData.details?.limit !== undefined
        ) {
          const { current, limit, type } = errorData.details;
          if (type === "daily") {
            message += ` (${current}/${limit} günlük limit)`;
          } else if (type === "monthly") {
            message += ` (${current}/${limit} aylık limit)`;
          }
        }

        throw new Error(message);
      }
    }
    throw new Error(
      "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    );
  }

  private getLocalizedErrorMessage(message: string): string {
    const errorMessages: Record<string, string> = {
      "Daily session limit of X reached.": "Günlük oturum limitinize ulaştınız",
      "Monthly session limit of X reached.":
        "Aylık oturum limitinize ulaştınız",
      "Cannot create session: User profile not found...":
        "Oturum oluşturulamadı: Kullanıcı profili bulunamadı",
      "Could not verify daily/monthly session limit...":
        "Oturum limiti kontrol edilemedi",
      "Cannot send message. Adding this interaction...would exceed your session message limit":
        "Bu mesajı gönderemezsiniz. Oturum mesaj limitine ulaştınız",
      "Cannot process message: User profile could not be retrieved...":
        "Mesaj işlenemedi: Kullanıcı profili alınamadı",
      "Message limit per session would be exceeded...":
        "Bu oturum için mesaj limitine ulaştınız",
      "Session not found": "Oturum bulunamadı",
      "Invalid session ID": "Geçersiz oturum ID'si",
      "Session expired": "Oturum süresi doldu",
      Unauthorized: "Oturum yetkisiz",
      "Rate limit exceeded":
        "Çok fazla istek gönderdiniz. Lütfen biraz bekleyin",
    };

    return errorMessages[message] || message;
  }

  async listSessions(page = 1, limit = 10) {
    try {
      const response = await axios.get<ApiResponse<Session[]>>(
        `${API_URL}/api/v1/sessions?page=${page}&limit=${limit}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createSession(name: string, metadata?: Record<string, any>) {
    try {
      const response = await axios.post<ApiResponse<Session>>(
        `${API_URL}/api/v1/sessions`,
        {
          name: name,
          title: name,
          userMetadata: metadata,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSessionName(sessionId: string, name: string) {
    try {
      const response = await axios.put<ApiResponse<Session>>(
        `${API_URL}/api/v1/sessions/${sessionId}`,
        {
          name: name,
          title: name,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteSession(sessionId: string) {
    try {
      const response = await axios.delete<ApiResponse<void>>(
        `${API_URL}/api/v1/sessions/${sessionId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSessionMessages(sessionId: string) {
    try {
      const response = await axios.get<ApiResponse<any[]>>(
        `${API_URL}/api/v1/sessions/${sessionId}/messages`,
        { headers: this.headers }
      );
      // Mesajları normalize et
      const messages = (response.data?.data || []).map(normalizeMessage);
      return { ...response.data, data: messages };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSessionMessages(sessionId: string, userQuery: string) {
    try {
      const response = await axios.put<
        ApiResponse<{ answer: string; sources: any[] }>
      >(
        `${API_URL}/api/v1/sessions/${sessionId}/messages`,
        { userQuery },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSessionUsage(): Promise<{
    daily: { current: number; limit: number };
    monthly: { current: number; limit: number };
  }> {
    try {
      const response = await axios.get(`${API_URL}/api/users/me/usage`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const sessionService = new SessionService();
