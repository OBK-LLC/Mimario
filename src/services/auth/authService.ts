import { AuthResponse } from "../../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Login attempt with:", { email });
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data (full):", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Transform the response to match AuthResponse type
      const authResponse = {
        user: {
          id: data.user?.id || "",
          email: data.user?.email || "",
          role: "",
          metadata: data.user?.metadata || {},
        },
        token: data.session?.access_token || "",
        refresh_token: data.session?.refresh_token || "",
      };

      console.log(
        "Transformed auth response:",
        JSON.stringify(authResponse, null, 2)
      );
      return authResponse;
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Transform the response to match AuthResponse type
      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: "",
          metadata: data.user.metadata,
        },
        token: data.session?.access_token || "",
        refresh_token: data.session?.refresh_token || "",
      };
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
        throw new Error(data.error || "Password reset request failed");
      }
    } catch (error) {
      throw error;
    }
  },

  async changePassword(newPassword: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Password change failed");
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
        throw new Error(data.error || "Failed to get current user");
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        role: data.role,
        metadata: data.metadata,
      };
    } catch (error) {
      throw error;
    }
  },

  async logout(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }
    } catch (error) {
      throw error;
    }
  },

  async googleSignIn(): Promise<{ url: string }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin/google`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Google sign-in failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
