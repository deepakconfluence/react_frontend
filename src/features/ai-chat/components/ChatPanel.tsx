import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bot, History, Plus, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useChatUIStore } from '../stores/chat-ui-store';
import {
  approveAction,
  fetchConversation,
  streamChat,
  type AgentStreamHandlers,
  type ApprovalRequest,
} from '../api/chat-api';
import type { ChatRole } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatComposer } from './ChatComposer';
import { ConversationHistory } from './ConversationHistory';
import { ToolActivity, type ToolActivityItem } from './ToolActivity';
import { ApprovalPrompt } from './ApprovalPrompt';

interface Turn {
  role: ChatRole;
  content: string;
}

const SUGGESTED_PROMPTS = [
  'How many users are there?',
  'List all the roles in the system',
  'What roles and permissions do I have?',
  'Create a user for Jane Doe (jane@acme.com) with the Manager role',
];

export function ChatPanel() {
  const queryClient = useQueryClient();
  const conversationId = useChatUIStore((s) => s.conversationId);
  const setConversationId = useChatUIStore((s) => s.setConversationId);
  const startNewConversation = useChatUIStore((s) => s.startNewConversation);
  const close = useChatUIStore((s) => s.close);

  const [messages, setMessages] = useState<Turn[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [toolActivity, setToolActivity] = useState<ToolActivityItem[]>([]);
  const [pendingApproval, setPendingApproval] = useState<ApprovalRequest | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef('');

  // Load a persisted/selected conversation when there's an id but no transcript yet.
  useEffect(() => {
    if (!conversationId || messages.length > 0 || isStreaming) return;
    let cancelled = false;
    fetchConversation(conversationId)
      .then((c) => {
        if (!cancelled) setMessages(c.messages.map((m) => ({ role: m.role, content: m.content })));
      })
      .catch(() => setConversationId(null));
    return () => {
      cancelled = true;
    };
  }, [conversationId, messages.length, isStreaming, setConversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamingText, toolActivity, pendingApproval]);

  const finalize = () => {
    const text = streamingRef.current;
    if (text) setMessages((prev) => [...prev, { role: 'ASSISTANT', content: text }]);
    streamingRef.current = '';
    setStreamingText('');
    setToolActivity([]);
    setIsStreaming(false);
    queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
  };

  const handlers: AgentStreamHandlers = {
    onText: (delta) => {
      streamingRef.current += delta;
      setStreamingText(streamingRef.current);
    },
    onTool: (name, phase, summary) =>
      setToolActivity((prev) => {
        if (phase === 'done') {
          const idx = [...prev].reverse().findIndex((t) => t.name === name && t.phase === 'start');
          if (idx >= 0) {
            const realIdx = prev.length - 1 - idx;
            const next = [...prev];
            next[realIdx] = { name, phase, summary };
            return next;
          }
        }
        return [...prev, { name, phase, summary }];
      }),
    onApproval: (req) => {
      setPendingApproval(req);
      setIsStreaming(false);
    },
    onConversationId: (id) => setConversationId(id),
    onDone: finalize,
    onError: (msg) => {
      setError(msg);
      setIsStreaming(false);
    },
  };

  const handleSend = async (text: string) => {
    setError(null);
    setShowHistory(false);
    setToolActivity([]);
    setPendingApproval(null);
    streamingRef.current = '';
    setStreamingText('');
    setMessages((prev) => [...prev, { role: 'USER', content: text }]);
    setIsStreaming(true);
    await streamChat({ message: text, conversationId, ...handlers });
  };

  const handleDecision = async (approved: boolean) => {
    if (!pendingApproval || !conversationId) return;
    const { approvalId } = pendingApproval;
    setPendingApproval(null);
    setIsStreaming(true);
    await approveAction({ conversationId, approvalId, approved, ...handlers });
  };

  const handleNewChat = () => {
    startNewConversation();
    setMessages([]);
    setError(null);
    setToolActivity([]);
    setPendingApproval(null);
    streamingRef.current = '';
    setStreamingText('');
    setShowHistory(false);
  };

  const handleSelectConversation = async (id: string) => {
    setShowHistory(false);
    setMessages([]);
    setConversationId(id);
  };

  const busy = isStreaming || pendingApproval !== null;
  const isEmpty = messages.length === 0 && !busy;

  return (
    <div className="flex h-[560px] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      <header className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNewChat} aria-label="New chat">
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowHistory((v) => !v)}
            aria-label="Conversation history"
          >
            <History className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={close} aria-label="Close chat">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto">
          <ConversationHistory activeId={conversationId} onSelect={handleSelectConversation} />
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
          {isEmpty && (
            <div className="flex flex-col gap-2 pt-4">
              <p className="px-1 text-sm text-muted-foreground">
                Hi! I can answer questions and take actions using live data. Try:
              </p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <ChatMessageBubble key={i} role={m.role} content={m.content} />
          ))}

          <ToolActivity items={toolActivity} />

          {streamingText && <ChatMessageBubble role="ASSISTANT" content={streamingText} streaming={isStreaming} />}

          {pendingApproval && (
            <ApprovalPrompt request={pendingApproval} busy={false} onDecision={handleDecision} />
          )}

          {isStreaming && !streamingText && toolActivity.length === 0 && (
            <div className="flex gap-1 px-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          )}

          {error && <p className="px-1 text-sm text-destructive">{error}</p>}
        </div>
      )}

      {!showHistory && <ChatComposer disabled={busy} onSend={handleSend} />}
    </div>
  );
}
