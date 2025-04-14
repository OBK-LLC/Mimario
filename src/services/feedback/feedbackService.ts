import axios from "axios";
import { FeedbackData, FeedbackResponse } from "../../types/feedback";
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
      const response = await axios.post<FeedbackResponse>(
        `${API_URL}/api/v1/feedback`,
        feedback,
        { headers: this.headers }
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
}

export const feedbackService = new FeedbackService();
