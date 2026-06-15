import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatUIState {
  isOpen: boolean;
  conversationId: string | null;

  open: () => void;
  close: () => void;
  toggle: () => void;
  setConversationId: (id: string | null) => void;
  startNewConversation: () => void;
}

export const useChatUIStore = create<ChatUIState>()(
  persist(
    (set) => ({
      isOpen: false,
      conversationId: null,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setConversationId: (conversationId) => set({ conversationId }),
      startNewConversation: () => set({ conversationId: null }),
    }),
    {
      name: 'chat-ui-store',
      partialize: (state) => ({ conversationId: state.conversationId }),
    }
  )
);
