import { User } from "./auth";

export type FeedbackRating = "positive" | "negative" | "neutral";

export interface TargetMessage {
  id: string;
  content: string;
  role: string;
}

export interface FeedbackData {
  sessionId: string;
  messageId: string;
  rating: FeedbackRating;
  comment?: string;
  targetMessage: TargetMessage;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    sessionId: string;
    messageId: string;
    rating: FeedbackRating;
    comment?: string;
    createdAt: number;
  };
}

// Admin panel için response tipleri
export interface AdminFeedback {
  id: string;
  sessionId: string;
  messageId: string;
  rating: FeedbackRating;
  comment?: string;
  targetMessage: TargetMessage;
  createdAt: string;
  userId?: string;
  user?: User;
}

export interface AdminFeedbackListResponse {
  feedbacks: AdminFeedback[];
  total: number;
  page: number;
  limit: number;
}
