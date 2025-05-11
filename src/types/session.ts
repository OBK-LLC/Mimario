export interface Session {
  id: string;
  userId: string;
  name: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  userMetadata: {
    topic?: string;
    [key: string]: any;
  };
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  sender: "user" | "ai";
  sources?: Source[];
}

export interface Source {
  id: string;
  title: string;
  content: string;
  relevance: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationInfo;
}
