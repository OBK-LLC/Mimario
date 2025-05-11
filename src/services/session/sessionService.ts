import axios from "axios";
import { Session, ApiResponse } from "../../types/session";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class SessionService {
  private get headers() {
    const tokens = tokenStorage.getTokens();
    return {
      Authorization: tokens?.token ? `Bearer ${tokens.token}` : "",
      "Content-Type": "application/json",
    };
  }

  async listSessions(page = 1, limit = 10) {
    const response = await axios.get<ApiResponse<Session[]>>(
      `${API_URL}/api/v1/sessions?page=${page}&limit=${limit}`,
      { headers: this.headers }
    );
    return response.data;
  }

  async createSession(name: string, metadata?: Record<string, any>) {
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
  }

  async updateSessionName(sessionId: string, name: string) {
    const response = await axios.put<ApiResponse<Session>>(
      `${API_URL}/api/v1/sessions/${sessionId}`,
      {
        name: name,
        title: name,
      },
      { headers: this.headers }
    );
    return response.data;
  }

  async deleteSession(sessionId: string) {
    const response = await axios.delete<ApiResponse<void>>(
      `${API_URL}/api/v1/sessions/${sessionId}`,
      { headers: this.headers }
    );
    return response.data;
  }

  async getSessionMessages(sessionId: string) {
    const response = await axios.get<ApiResponse<any[]>>(
      `${API_URL}/api/v1/sessions/${sessionId}/messages`,
      { headers: this.headers }
    );
    return response.data;
  }

  async updateSessionMessages(sessionId: string, userQuery: string) {
    const response = await axios.put<ApiResponse<{answer: string; sources: any[]}>>(
      `${API_URL}/api/v1/sessions/${sessionId}/messages`,
      { userQuery },
      { headers: this.headers }
    );
    return response.data;
  }
}

export const sessionService = new SessionService();
