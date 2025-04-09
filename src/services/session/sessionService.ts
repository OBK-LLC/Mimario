import axios from "axios";
import { Session, ApiResponse } from "../../types/session";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class SessionService {
  private token: string;

  constructor() {
    this.token = localStorage.getItem("token") || "";
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
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

  setToken(token: string) {
    this.token = token;
  }
}

export const sessionService = new SessionService();
