import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/shared/api/client';
import { useAuthStore } from '@/shared/stores/auth-store';
import type { ChatConversation, ChatConversationSummary, ChatStatus } from '../types';

const CHAT_QUERY_KEY = 'chat';
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function useChatStatus() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: [CHAT_QUERY_KEY, 'status'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ChatStatus>>('/chat/status');
      return response.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useConversations() {
  return useQuery({
    queryKey: [CHAT_QUERY_KEY, 'conversations'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ChatConversationSummary[]>>(
        '/chat/conversations'
      );
      return response.data.data;
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/chat/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHAT_QUERY_KEY, 'conversations'] });
    },
  });
}

/** Loads a full conversation with its messages (used when selecting from history). */
export async function fetchConversation(id: string): Promise<ChatConversation> {
  const response = await apiClient.get<ApiResponse<ChatConversation>>(
    `/chat/conversations/${id}`
  );
  return response.data.data;
}

// ── Agent streaming (NDJSON event protocol) ─────────────────────────────────

export interface ApprovalRequest {
  approvalId: string;
  tool: string;
  summary: string;
}

export interface AgentStreamHandlers {
  /** Called with each text delta (append to the current bubble). */
  onText: (delta: string) => void;
  /** Tool activity for chips. phase is "start" | "done". */
  onTool: (name: string, phase: string, summary: string | null) => void;
  /** The agent paused awaiting approval of a write action. */
  onApproval: (req: ApprovalRequest) => void;
  onConversationId?: (id: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function consumeStream(response: Response, handlers: AgentStreamHandlers): Promise<void> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body */
    }
    handlers.onError?.(message);
    return;
  }

  const conversationId = response.headers.get('X-Conversation-Id');
  if (conversationId) handlers.onConversationId?.(conversationId);

  const reader = response.body?.getReader();
  if (!reader) {
    handlers.onError?.('Streaming is not supported in this environment.');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  const dispatch = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let evt: Record<string, unknown>;
    try {
      evt = JSON.parse(trimmed);
    } catch {
      return;
    }
    switch (evt.type) {
      case 'text':
        handlers.onText(String(evt.value ?? ''));
        break;
      case 'tool':
        handlers.onTool(String(evt.name), String(evt.phase), (evt.summary as string) ?? null);
        break;
      case 'approval':
        handlers.onApproval({
          approvalId: String(evt.approvalId),
          tool: String(evt.tool),
          summary: String(evt.summary),
        });
        break;
      case 'error':
        handlers.onError?.(String(evt.value ?? 'Something went wrong.'));
        break;
      case 'done':
        handlers.onDone?.();
        break;
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      dispatch(buffer.slice(0, newline));
      buffer = buffer.slice(newline + 1);
    }
  }
  if (buffer) dispatch(buffer);
}

export async function streamChat(
  args: { message: string; conversationId: string | null; signal?: AbortSignal } & AgentStreamHandlers
): Promise<void> {
  const { message, conversationId, signal, ...handlers } = args;
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message, conversationId }),
    signal,
  });
  await consumeStream(response, handlers);
}

export async function approveAction(
  args: {
    conversationId: string;
    approvalId: string;
    approved: boolean;
    signal?: AbortSignal;
  } & AgentStreamHandlers
): Promise<void> {
  const { conversationId, approvalId, approved, signal, ...handlers } = args;
  const response = await fetch(`${API_BASE_URL}/chat/approve`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ conversationId, approvalId, approved }),
    signal,
  });
  await consumeStream(response, handlers);
}
