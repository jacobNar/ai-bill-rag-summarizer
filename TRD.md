# Technical Requirements Document (TRD)
## Congress Legislation RAG Chat UI

**Version:** 1.1.0  
**Date:** 2025-09-25  
**Status:** Implemented  
**Authors:** Engineering Team  
**Repository:** https://github.com/easyalien/ai-bill-rag-summarizer/tree/poc-ui  

---

## 1. Executive Summary

### 1.1 Purpose
This document defines the technical requirements for implementing a production-ready web UI for the Congress Legislation RAG (Retrieval-Augmented Generation) chatbot. The system enables users to interact with U.S. Congressional legislation through an AI-powered chat interface with real-time document retrieval and contextual responses.

### 1.2 Scope
- Frontend React/TypeScript application
- Backend Python API service
- Real-time chat with streaming responses
- Document search and retrieval interface
- Bill browsing and filtering capabilities
- Responsive design for desktop, tablet, and mobile

### 1.3 Success Metrics
- Initial page load < 2s (LCP)
- Chat response initiation < 500ms
- 99.9% uptime for API services
- WCAG 2.1 AA accessibility compliance
- Support for 1000+ concurrent users

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React/TS)                  │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer  │  State Management  │  Service Layer   │
│  • Components        │  • Zustand/Redux   │  • API Client    │
│  • Design Tokens     │  • React Query     │  • WebSocket     │
│  • Styled Components │  • Context API     │  • Error Handler │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │      API Gateway       │
                    │    (Rate Limiting)     │
                    └───────────┬───────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI/Python)                  │
├─────────────────────────────────────────────────────────────┤
│  API Layer          │  Business Logic    │  Data Layer      │
│  • REST Endpoints   │  • RAG Pipeline    │  • ChromaDB      │
│  • WebSocket Server │  • Doc Processing  │  • Caching       │
│  • Auth Middleware  │  • Query Refinement│  • Session Store │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │    External Services   │
                    │  • Ollama (LLM)        │
                    │  • Congress.gov API    │
                    └───────────────────────┘
```

### 2.2 Frontend Architecture

#### Tech Stack
```typescript
{
  "core": {
    "framework": "React 18.3+",
    "language": "TypeScript 5.3+",
    "bundler": "Vite 5.0+",
    "routing": "React Router 6.20+"
  },
  "styling": {
    "primary": "styled-components 6.1+",
    "tokens": "style-dictionary 3.9+",
    "utilities": "clsx, polished"
  },
  "state": {
    "global": "Zustand 4.5+",
    "server": "TanStack Query 5.20+",
    "forms": "React Hook Form 7.50+"
  },
  "realtime": {
    "websocket": "socket.io-client 4.7+",
    "streaming": "EventSource polyfill"
  },
  "quality": {
    "testing": "Vitest + React Testing Library",
    "linting": "ESLint 8.56+",
    "formatting": "Prettier 3.2+"
  }
}
```

### 2.3 Backend Architecture

#### Tech Stack
```python
{
  "core": {
    "framework": "FastAPI 0.117+",
    "python": "3.9+",
    "server": "Uvicorn"
  },
  "ai_pipeline": {
    "embeddings": "OllamaEmbeddings (mxbai-embed-large)",
    "llm": "Ollama (llama3.1:8b)",
    "vector_db": "ChromaDB",
    "reranker": "HuggingFace BAAI/bge-reranker-large"
  },
  "realtime": {
    "websocket": "python-socketio",
    "async": "asyncio + aiohttp"
  },
  "data": {
    "cache": "Redis",
    "session": "Redis with TTL",
    "database": "PostgreSQL (future)"
  },
  "quality": {
    "testing": "pytest + pytest-asyncio",
    "validation": "Pydantic 2.5+",
    "logging": "structlog"
  }
}
```

---

## 3. Functional Requirements

### 3.1 Core Features

#### 3.1.1 Chat Interface
```typescript
interface ChatRequirements {
  features: {
    streaming: "Server-sent events for real-time token streaming";
    history: "Persistent chat history with session management";
    context: "Display source documents and citations inline";
    actions: {
      regenerate: "Re-generate last response";
      copy: "Copy message to clipboard";
      feedback: "Thumbs up/down rating";
      share: "Share conversation link";
    };
  };
  
  performance: {
    firstToken: "< 500ms from request to first token";
    throughput: "30+ tokens/second streaming rate";
    maxLength: "8192 token context window";
  };
}
```

#### 3.1.2 Bill Search & Browse
```typescript
interface BillBrowserRequirements {
  search: {
    fullText: "Search across bill text and metadata";
    filters: {
      chamber: ["House", "Senate"];
      status: ["Introduced", "Committee", "Passed", "Enacted"];
      dateRange: "Custom date picker";
      sponsor: "Autocomplete from member list";
      subject: "Multi-select topic tags";
    };
    sorting: ["Relevance", "Date", "Bill Number", "Status"];
  };
  
  display: {
    view: ["Grid", "List", "Compact"];
    pagination: "20 items per page with infinite scroll option";
    preview: "Expandable summary on hover";
  };
}
```

#### 3.1.3 Document Viewer
```typescript
interface DocumentViewerRequirements {
  formats: {
    text: "Plain text with syntax highlighting";
    xml: "Formatted XML with collapsible sections";
    pdf: "Embedded viewer with download option";
  };
  
  features: {
    search: "In-document search with highlighting";
    navigation: "Table of contents / section jumper";
    annotations: "Highlight and note capabilities";
    compare: "Side-by-side version comparison";
  };
}
```

### 3.2 Component Hierarchy

```typescript
// Root Component Structure
interface AppStructure {
  layout: {
    Header: {
      Logo: Component;
      SearchBar: Component;
      Navigation: Component;
      UserMenu: Component;
    };
    
    Main: {
      ChatView: {
        MessageList: Component;
        MessageInput: Component;
        SourcePanel: Component;
      };
      
      BrowseView: {
        FilterSidebar: Component;
        BillGrid: Component;
        Pagination: Component;
      };
      
      DetailView: {
        BillHeader: Component;
        TabNavigation: Component;
        ContentArea: Component;
        RelatedBills: Component;
      };
    };
    
    Footer: Component;
  };
  
  overlays: {
    Modal: Component;
    Toast: Component;
    Drawer: Component;
  };
}
```

---

## 4. API Specifications

### 4.1 RESTful Endpoints

```typescript
// API Contract Definitions
interface APIEndpoints {
  // Chat Operations
  "POST /api/v1/chat/message": {
    request: {
      message: string;
      sessionId: string;
      context?: string[];
    };
    response: {
      messageId: string;
      streamUrl: string;
    };
  };
  
  // Bill Operations
  "GET /api/v1/bills": {
    params: {
      q?: string;
      chamber?: "house" | "senate";
      status?: string;
      page?: number;
      limit?: number;
    };
    response: {
      bills: Bill[];
      total: number;
      page: number;
    };
  };
  
  "GET /api/v1/bills/:billId": {
    response: Bill;
  };
  
  // Search Operations
  "POST /api/v1/search": {
    request: {
      query: string;
      filters?: SearchFilters;
      limit?: number;
    };
    response: {
      results: SearchResult[];
      facets: Facet[];
    };
  };
}
```

### 4.2 WebSocket Events

```typescript
interface WebSocketEvents {
  // Client → Server
  "chat:message": {
    text: string;
    sessionId: string;
  };
  
  "chat:stop": {
    messageId: string;
  };
  
  // Server → Client
  "chat:token": {
    token: string;
    messageId: string;
  };
  
  "chat:complete": {
    messageId: string;
    sources: Document[];
  };
  
  "chat:error": {
    error: string;
    messageId: string;
  };
}
```

### 4.3 Data Models

```typescript
// Core Data Types
interface Bill {
  id: string;
  number: string;
  title: string;
  chamber: "house" | "senate";
  sponsor: {
    name: string;
    party: string;
    state: string;
  };
  status: BillStatus;
  introducedDate: string;
  summary: string;
  subjects: string[];
  versions: BillVersion[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: DocumentSource[];
  metadata?: {
    tokens: number;
    model: string;
    latency: number;
  };
}

interface DocumentSource {
  id: string;
  billId: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
  pageNumber?: number;
  url: string;
}
```

---

## 5. State Management

### 5.1 Global State Structure

```typescript
// Zustand Store Definition
interface AppStore {
  // Chat State
  chat: {
    messages: ChatMessage[];
    isLoading: boolean;
    currentSessionId: string;
    actions: {
      sendMessage: (text: string) => Promise<void>;
      regenerateLastMessage: () => Promise<void>;
      clearChat: () => void;
    };
  };
  
  // UI State
  ui: {
    theme: "light" | "dark";
    sidebarOpen: boolean;
    modalStack: Modal[];
    toasts: Toast[];
    actions: {
      toggleTheme: () => void;
      showToast: (toast: Toast) => void;
      openModal: (modal: Modal) => void;
    };
  };
  
  // Search State
  search: {
    query: string;
    filters: SearchFilters;
    results: SearchResult[];
    isSearching: boolean;
    actions: {
      setQuery: (query: string) => void;
      updateFilters: (filters: Partial<SearchFilters>) => void;
      executeSearch: () => Promise<void>;
    };
  };
}
```

### 5.2 React Query Configuration

```typescript
// Query Client Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys Factory
const queryKeys = {
  bills: {
    all: ["bills"] as const,
    list: (filters: SearchFilters) => ["bills", "list", filters] as const,
    detail: (id: string) => ["bills", "detail", id] as const,
  },
  chat: {
    history: (sessionId: string) => ["chat", "history", sessionId] as const,
  },
  search: {
    results: (query: string) => ["search", "results", query] as const,
  },
};
```

---

## 6. Performance Requirements

### 6.1 Frontend Performance

```typescript
interface PerformanceTargets {
  metrics: {
    LCP: "< 2.0s"; // Largest Contentful Paint
    FID: "< 100ms"; // First Input Delay
    CLS: "< 0.1"; // Cumulative Layout Shift
    TTI: "< 3.5s"; // Time to Interactive
  };
  
  bundleSize: {
    initial: "< 200KB gzipped";
    lazy: "< 50KB per chunk";
  };
  
  runtime: {
    fps: "60fps for animations";
    memoryLimit: "< 50MB heap growth per hour";
    renderTime: "< 16ms per frame";
  };
}
```

### 6.2 Backend Performance

```python
performance_requirements = {
    "api_latency": {
        "p50": "< 100ms",
        "p95": "< 500ms",
        "p99": "< 1000ms"
    },
    "throughput": {
        "requests_per_second": 1000,
        "concurrent_connections": 5000,
        "websocket_connections": 1000
    },
    "rag_pipeline": {
        "embedding_time": "< 200ms",
        "search_time": "< 300ms",
        "rerank_time": "< 500ms",
        "generation_start": "< 1000ms"
    }
}
```

### 6.3 Optimization Strategies

```typescript
interface OptimizationStrategies {
  frontend: {
    codeSpitting: "Route-based and component-based splitting";
    lazyLoading: "React.lazy() for non-critical components";
    memoization: "React.memo, useMemo, useCallback";
    virtualScrolling: "For large lists (tanstack/virtual)";
    imageOptimization: "WebP with fallbacks, lazy loading";
  };
  
  backend: {
    caching: {
      redis: "Session data, frequent queries";
      memory: "LRU cache for embeddings";
      cdn: "Static assets and API responses";
    };
    database: {
      indexing: "Optimize vector similarity search";
      pooling: "Connection pooling for PostgreSQL";
    };
  };
}
```

---

## 7. Security Requirements

### 7.1 Authentication & Authorization

```typescript
interface SecurityRequirements {
  authentication: {
    method: "JWT with refresh tokens";
    storage: "HttpOnly secure cookies";
    expiry: "15min access, 7d refresh";
  };
  
  authorization: {
    rbac: {
      roles: ["anonymous", "user", "premium", "admin"];
      permissions: ["read", "chat", "export", "admin"];
    };
  };
  
  rateLimiting: {
    anonymous: "10 requests/min";
    authenticated: "60 requests/min";
    chat: "20 messages/hour";
  };
}
```

### 7.2 Data Protection

```python
security_measures = {
    "input_validation": {
        "sanitization": "XSS protection via DOMPurify",
        "sql_injection": "Parameterized queries only",
        "prompt_injection": "Input filtering and sandboxing"
    },
    
    "data_encryption": {
        "in_transit": "TLS 1.3 minimum",
        "at_rest": "AES-256-GCM",
        "pii_handling": "No storage of user PII"
    },
    
    "headers": {
        "CSP": "strict Content Security Policy",
        "HSTS": "max-age=31536000; includeSubDomains",
        "X_Frame_Options": "DENY",
        "X_Content_Type_Options": "nosniff"
    }
}
```

---

## 8. Accessibility Requirements

### 8.1 WCAG 2.1 AA Compliance

```typescript
interface AccessibilityRequirements {
  standards: {
    level: "WCAG 2.1 AA";
    testing: "axe-core automated + manual testing";
  };
  
  features: {
    keyboard: {
      navigation: "Full keyboard accessibility";
      shortcuts: "Customizable with ? help modal";
      focusManagement: "Trap in modals, restore on close";
    };
    
    screenReader: {
      landmarks: "Proper ARIA landmarks";
      liveRegions: "Chat updates announced";
      altText: "All images and icons";
    };
    
    visual: {
      contrast: "4.5:1 minimum for normal text";
      fontSize: "User scalable to 200%";
      animations: "Respect prefers-reduced-motion";
    };
  };
}
```

---

## 9. Testing Strategy

### 9.1 Frontend Testing

```typescript
interface TestingStrategy {
  unit: {
    framework: "Vitest";
    coverage: "> 80%";
    focus: "Business logic, utilities, hooks";
  };
  
  integration: {
    framework: "React Testing Library";
    coverage: "> 70%";
    focus: "Component interactions, API mocking";
  };
  
  e2e: {
    framework: "Playwright";
    coverage: "Critical user paths";
    environments: ["Chrome", "Firefox", "Safari", "Mobile"];
  };
  
  visual: {
    framework: "Storybook + Chromatic";
    coverage: "All components in style guide";
  };
}
```

### 9.2 Backend Testing

```python
testing_requirements = {
    "unit": {
        "framework": "pytest",
        "coverage": "> 85%",
        "focus": ["Business logic", "RAG pipeline", "Utilities"]
    },
    
    "integration": {
        "framework": "pytest-asyncio",
        "coverage": "> 75%",
        "focus": ["API endpoints", "WebSocket events", "Database"]
    },
    
    "load": {
        "framework": "locust",
        "scenarios": [
            "1000 concurrent users",
            "100 msgs/sec chat load",
            "Sustained 24h operation"
        ]
    }
}
```

---

## 10. Deployment & DevOps

### 10.1 Infrastructure

```yaml
infrastructure:
  hosting:
    frontend: "Vercel / Cloudflare Pages"
    backend: "AWS ECS / Google Cloud Run"
    database: "AWS RDS / Google Cloud SQL"
    
  ci_cd:
    pipeline: "GitHub Actions"
    stages:
      - lint_and_typecheck
      - unit_tests
      - build
      - integration_tests
      - deploy_staging
      - e2e_tests
      - deploy_production
      
  monitoring:
    apm: "DataDog / New Relic"
    logging: "CloudWatch / Stackdriver"
    errors: "Sentry"
    analytics: "PostHog / Mixpanel"
```

### 10.2 Environment Configuration

```typescript
interface EnvironmentConfig {
  development: {
    apiUrl: "http://localhost:8000";
    wsUrl: "ws://localhost:8000";
    mockData: true;
  };
  
  staging: {
    apiUrl: "https://api-staging.congress-chat.com";
    wsUrl: "wss://api-staging.congress-chat.com";
    mockData: false;
  };
  
  production: {
    apiUrl: "https://api.congress-chat.com";
    wsUrl: "wss://api.congress-chat.com";
    mockData: false;
  };
}
```

---

## 11. Implementation Status

### 11.1 ✅ Completed Features
- **Frontend Setup**: React/TypeScript with Vite
- **Design System**: Full token implementation from style guide
- **Core Components**: Button, Input, BillCard, ChatInterface
- **State Management**: Zustand store with chat functionality
- **Backend Integration**: FastAPI wrapper for RAG system
- **Ollama Integration**: Working with llama3.1:8b and mxbai-embed-large
- **API Endpoints**: Chat, bills, search, health check
- **Responsive Layout**: Mobile-first design implementation

### 11.2 🚧 In Progress
- WebSocket streaming for real-time responses
- Document chunking and vector store population
- Advanced bill filtering UI

### 11.3 📋 Future Enhancements
- User authentication and sessions
- Bill comparison feature
- Export functionality
- Dark mode theme
- Production deployment configuration

---

## 12. Risk Assessment

### 12.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| LLM latency spikes | High | Medium | Implement response caching, fallback models |
| WebSocket connection drops | Medium | High | Auto-reconnect, message queue persistence |
| Vector DB scaling issues | High | Low | Pre-compute embeddings, horizontal scaling |
| Browser compatibility | Medium | Low | Progressive enhancement, polyfills |

### 12.2 Dependencies

```typescript
interface CriticalDependencies {
  external: {
    ollama: "Must be running and accessible";
    chromaDB: "Required for vector search";
    congressAPI: "Fallback to cached data if unavailable";
  };
  
  internal: {
    designSystem: "Must be completed before component development";
    apiContracts: "Must be finalized before integration";
    authentication: "Required for user features";
  };
}
```

---

## 13. Success Criteria

### 13.1 Launch Requirements
- [ ] All WCAG 2.1 AA tests passing
- [ ] Performance metrics meeting targets
- [ ] 95% test coverage on critical paths
- [ ] Security audit completed
- [ ] Load testing supporting 1000 concurrent users
- [ ] Documentation complete

### 13.2 Post-Launch Metrics
- User engagement: > 5 min average session
- Chat completion rate: > 80%
- Error rate: < 0.1%
- User satisfaction: > 4.5/5 rating

---

## Appendices

### A. Component Library Structure
```
src/
├── components/
│   ├── atoms/           # Button, Input, Badge
│   ├── molecules/       # SearchBar, Card, Toast
│   ├── organisms/       # Header, ChatInterface, BillGrid
│   ├── templates/       # PageLayout, ChatLayout
│   └── pages/          # HomePage, ChatPage, BillPage
├── hooks/              # Custom React hooks
├── services/           # API clients, WebSocket
├── store/             # Zustand stores
├── styles/            # Global styles, tokens
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

### B. API Response Examples

```json
// Chat Message Response
{
  "messageId": "msg_123",
  "role": "assistant",
  "content": "Based on H.R. 1234...",
  "sources": [
    {
      "billId": "hr1234-117",
      "title": "H.R. 1234 - Infrastructure Act",
      "excerpt": "Section 2 establishes...",
      "relevanceScore": 0.92
    }
  ],
  "metadata": {
    "model": "llama3.2",
    "tokens": 256,
    "latencyMs": 1234
  }
}
```

### C. References
- Style Guide: `STYLE_GUIDE.md`
- Original Implementation: `bill-summarizer.py`
- Design Tokens: `@congress-chat/tokens`
- Component Library: `@congress-chat/ui`

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-09-25  
**Next Review:** 2025-10-02