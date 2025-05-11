import axios from "axios";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const tokens = tokenStorage.getTokens();
  if (tokens?.token && config.headers) {
    config.headers["Authorization"] = `Bearer ${tokens.token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const tokens = tokenStorage.getTokens();
      if (tokens?.refresh_token) {
        try {
          const authService = (await import("../auth/authService")).authService;
          const response = await authService.refreshToken(tokens.refresh_token);
          tokenStorage.setTokens(response.token, response.refresh_token);

          // Retry the original request with new token
          const config = error.config;
          config.headers["Authorization"] = `Bearer ${response.token}`;
          return axios(config);
        } catch (refreshError) {
          tokenStorage.clearTokens();
          window.location.href = "/login";
        }
      } else {
        tokenStorage.clearTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  display_name: string;
  role: "user" | "editor" | "admin" | "superadmin";
  created_at: string;
  metadata?: {
    avatar_url?: string;
    email_verified?: boolean;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export const userService = {
  async fetchUsers(page = 1, limit = 10): Promise<UsersResponse> {
    try {
      const { data } = await api.get<UsersResponse>(`/api/users`, {
        params: { page, limit },
      });
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Kullanıcılar yüklenemedi"
      );
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      // If we're updating the role, use the specific role update endpoint
      if ('role' in userData) {
        const { data } = await api.put<User>(
          `/api/v1/admin/users/${userId}/role`,
          { role: userData.role }
        );
        return data;
      }

      // For other user data updates, use the general update endpoint
      const { data } = await api.put<User>(`/api/v1/users/${userId}`, userData);
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Kullanıcı güncellenemedi"
      );
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/api/users/${userId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Kullanıcı silinemedi");
    }
  },

  async updateProfile(data: {
    display_name?: string;
    email?: string;
    phone?: string;
  }): Promise<User> {
    const tokens = tokenStorage.getTokens();
    if (!tokens?.token) {
      throw new Error("No token found");
    }

    try {
      const response = await axios.put<User>(
        `${API_URL}/api/user/profile`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Profil güncellenemedi");
      }
      throw new Error("Sunucuya bağlanılamadı");
    }
  },
};

export default userService;
