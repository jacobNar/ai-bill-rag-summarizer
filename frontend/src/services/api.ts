import axios from 'axios';
import { Bill } from '../components/molecules/BillCard';
import { ChatMessage, DocumentSource } from '../components/organisms/ChatInterface';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface SearchFilters {
  chamber?: 'house' | 'senate';
  status?: string;
  sponsor?: string;
  dateFrom?: string;
  dateTo?: string;
  subjects?: string[];
}

export interface SearchResult {
  bills: Bill[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  context?: string[];
}

export interface ChatResponse {
  messageId: string;
  content: string;
  sources?: DocumentSource[];
  metadata?: {
    tokens: number;
    model: string;
    latencyMs: number;
  };
}

// API Functions
export const api = {
  // Bills API
  async searchBills(query?: string, filters?: SearchFilters, page = 1, limit = 20): Promise<SearchResult> {
    const response = await apiClient.get('/bills', {
      params: {
        q: query,
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },
  
  async getBill(billId: string): Promise<Bill> {
    const response = await apiClient.get(`/bills/${billId}`);
    return response.data;
  },
  
  // Chat API
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post('/chat/message', request);
    return response.data;
  },
  
  // Search API
  async performSearch(query: string, filters?: SearchFilters): Promise<SearchResult> {
    const response = await apiClient.post('/search', {
      query,
      filters,
    });
    return response.data;
  },
  
  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Mock data for development
export const mockData = {
  bills: [
    {
      id: '1',
      number: '1234',
      title: 'Infrastructure Investment and Jobs Act',
      chamber: 'house' as const,
      sponsor: {
        name: 'Rep. John Doe',
        party: 'D',
        state: 'CA',
      },
      status: 'Passed House',
      introducedDate: '2024-02-15',
      summary: 'A comprehensive infrastructure bill...',
      subjects: ['Transportation', 'Infrastructure', 'Economic Development'],
    },
    {
      id: '2',
      number: '5678',
      title: 'Clean Energy Innovation Act',
      chamber: 'senate' as const,
      sponsor: {
        name: 'Sen. Jane Smith',
        party: 'R',
        state: 'TX',
      },
      status: 'In Committee',
      introducedDate: '2024-01-10',
      summary: 'Promoting clean energy research and development...',
      subjects: ['Energy', 'Environment', 'Technology'],
    },
    {
      id: '3',
      number: '9012',
      title: 'Healthcare Accessibility Enhancement Act',
      chamber: 'house' as const,
      sponsor: {
        name: 'Rep. Michael Johnson',
        party: 'D',
        state: 'NY',
      },
      status: 'Introduced',
      introducedDate: '2024-03-01',
      summary: 'Improving healthcare access for rural communities...',
      subjects: ['Healthcare', 'Rural Development'],
    },
  ] as Bill[],
  
  chatMessages: [
    {
      id: '1',
      role: 'user' as const,
      content: 'What is the Infrastructure Investment and Jobs Act about?',
      timestamp: '2024-09-25T10:00:00Z',
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'The Infrastructure Investment and Jobs Act (H.R. 1234) is a comprehensive legislation that focuses on rebuilding and modernizing America\'s infrastructure. Key provisions include:\n\n• $550 billion in new federal investment\n• Road and bridge repairs\n• Broadband expansion\n• Clean energy infrastructure\n• Public transit improvements',
      timestamp: '2024-09-25T10:00:30Z',
      sources: [
        {
          id: 'src1',
          billId: '1',
          title: 'H.R. 1234 - Infrastructure Investment and Jobs Act',
          excerpt: 'Section 1: This Act provides funding for critical infrastructure...',
          relevanceScore: 0.95,
          url: '/bills/1',
        },
      ],
    },
  ] as ChatMessage[],
};