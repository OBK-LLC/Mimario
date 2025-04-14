import { Message as SessionMessage, Session } from "./session";

export interface Message extends SessionMessage {
  sender: "user" | "ai";
}

export interface ChatHistory extends Omit<Session, "messages"> {
  messages: Message[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export interface MessageProps {
  message: Message;
  previousMessage?: Message;
  sessionId: string;
}

export interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isGenerating?: boolean;
  sessionId: string;
}

export interface SidebarProps {
  chatHistories: ChatHistory[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}
