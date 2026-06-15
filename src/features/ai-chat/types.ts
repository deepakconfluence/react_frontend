export type ChatRole = 'USER' | 'ASSISTANT';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string | null;
  messages: ChatMessage[];
}

export interface ChatStatus {
  configured: boolean;
  provider: string;
  model: string;
}
