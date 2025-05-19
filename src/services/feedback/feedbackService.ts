import axios from "axios";
import {
  FeedbackData,
  FeedbackResponse,
  AdminFeedbackListResponse,
  AdminFeedback,
} from "../../types/feedback";
import { tokenStorage } from "../../utils/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class FeedbackService {
  private get headers() {
    const tokens = tokenStorage.getTokens();
    return {
      Authorization: tokens?.token ? `Bearer ${tokens.token}` : "",
      "Content-Type": "application/json",
    };
  }

  async submitFeedback(feedback: FeedbackData): Promise<FeedbackResponse> {
    try {
      const tokens = tokenStorage.getTokens();
      if (!tokens?.token) {
        throw new Error("Geri bildirim göndermek için giriş yapmalısınız");
      }

      const response = await axios.post<FeedbackResponse>(
        `${API_URL}/api/v1/feedback`,
        feedback,
        {
          headers: this.headers,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Feedback error:", error.response?.data);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Feedback gönderilemedi"
        );
      }
      throw new Error("Sunucuya bağlanılamadı");
    }
  }

  // Admin panel için feedback listesi
  async getFeedbackList(
    page = 1,
    limit = 10
  ): Promise<AdminFeedbackListResponse> {
    try {
      const response = await axios.get<{
        success: boolean;
        data: AdminFeedback[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(
        `${API_URL}/api/v1/admin/feedback?page=${page}&limit=${limit}&relations=user,targetMessage`,
        {
          headers: {
            ...this.headers,
            Authorization: `Bearer ${tokenStorage.getTokens()?.token}`,
          },
        }
      );

      return {
        feedbacks: response.data.data.map((feedback: any) => ({
          ...feedback,
          user: feedback.user || undefined,
          targetMessage:
            typeof feedback.target_message === "string"
              ? JSON.parse(feedback.target_message)
              : feedback.target_message,
          createdAt: feedback.created_at,
          sessionId: feedback.session_id,
          messageId: feedback.message_id,
          userId: feedback.user_id,
        })),
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
      };
    } catch (error: any) {
      console.error("Feedback list error:", error.response?.data);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Geri bildirimler alınamadı"
        );
      }
      throw new Error("Sunucuya bağlanılamadı");
    }
  }
}

export const feedbackService = new FeedbackService();
