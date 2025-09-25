// Shared types for the application

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: DocumentSource[];
  isStreaming?: boolean;
}

export interface DocumentSource {
  id: string;
  billId: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
  url: string;
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  chamber: 'house' | 'senate';
  sponsor: {
    name: string;
    party: string;
    state: string;
  };
  status: string;
  introducedDate: string;
  summary?: string;
  subjects: string[];
}