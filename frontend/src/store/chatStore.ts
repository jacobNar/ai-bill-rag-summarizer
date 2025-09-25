import { create } from 'zustand';
import { ChatMessage, DocumentSource } from '../components/organisms/ChatInterface';

interface ChatStore {
  messages: ChatMessage[];
  currentSessionId: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
  generateSessionId: () => string;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  currentSessionId: '',
  isLoading: false,
  error: null,
  
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  
  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearChat: () => set({
    messages: [],
    error: null,
    isLoading: false,
  }),
  
  generateSessionId: () => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set({ currentSessionId: sessionId });
    return sessionId;
  },
}));