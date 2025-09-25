import os
import asyncio
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import the existing RAG functionality
import sys
sys.path.append('..')
from bill_summarizer import (
    ollama_emb,
    chat,
    rerank_documents_hf,
    chunk_text_with_semantic,
    chunk_xml_bill,
    Chroma
)

# Global variables for the RAG system
vector_store = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup the RAG system"""
    global vector_store
    
    # Initialize Chroma vector store on startup
    try:
        vector_store = Chroma(
            persist_directory="./chroma_db",
            embedding_function=ollama_emb
        )
        print("✅ Vector store initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize vector store: {e}")
        vector_store = None
    
    yield
    
    # Cleanup on shutdown
    if vector_store:
        print("🧹 Cleaning up vector store...")

app = FastAPI(
    title="Congress Chat API",
    description="RAG-powered API for Congressional legislation chat",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Bill(BaseModel):
    id: str
    number: str
    title: str
    chamber: str
    sponsor: Dict[str, str]
    status: str
    introducedDate: str
    summary: Optional[str] = None
    subjects: List[str]

class DocumentSource(BaseModel):
    id: str
    billId: str
    title: str
    excerpt: str
    relevanceScore: float
    url: str

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    sources: Optional[List[DocumentSource]] = None

class ChatRequest(BaseModel):
    message: str
    sessionId: str
    context: Optional[List[str]] = None

class ChatResponse(BaseModel):
    messageId: str
    content: str
    sources: Optional[List[DocumentSource]] = None
    metadata: Optional[Dict[str, Any]] = None

class SearchFilters(BaseModel):
    chamber: Optional[str] = None
    status: Optional[str] = None
    sponsor: Optional[str] = None
    dateFrom: Optional[str] = None
    dateTo: Optional[str] = None
    subjects: Optional[List[str]] = None

class SearchResult(BaseModel):
    bills: List[Bill]
    total: int
    page: int
    limit: int

# Mock data (in production, this would come from a real database)
MOCK_BILLS = [
    Bill(
        id="1",
        number="1234",
        title="Infrastructure Investment and Jobs Act",
        chamber="house",
        sponsor={"name": "Rep. John Doe", "party": "D", "state": "CA"},
        status="Passed House",
        introducedDate="2024-02-15",
        summary="A comprehensive infrastructure bill investing in roads, bridges, and broadband.",
        subjects=["Transportation", "Infrastructure", "Economic Development"]
    ),
    Bill(
        id="2",
        number="5678",
        title="Clean Energy Innovation Act",
        chamber="senate",
        sponsor={"name": "Sen. Jane Smith", "party": "R", "state": "TX"},
        status="In Committee",
        introducedDate="2024-01-10",
        summary="Promoting clean energy research and development initiatives.",
        subjects=["Energy", "Environment", "Technology"]
    )
]

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

manager = ConnectionManager()

# API Routes
@app.get("/")
async def root():
    return {"message": "Congress Chat API", "status": "running"}

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "vector_store": "connected" if vector_store else "disconnected"
    }

@app.get("/api/v1/bills", response_model=SearchResult)
async def search_bills(
    q: Optional[str] = None,
    chamber: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    """Search and filter bills"""
    filtered_bills = MOCK_BILLS.copy()
    
    if q:
        filtered_bills = [
            bill for bill in filtered_bills
            if q.lower() in bill.title.lower() or 
               q.lower() in bill.number.lower() or
               any(q.lower() in subject.lower() for subject in bill.subjects)
        ]
    
    if chamber:
        filtered_bills = [bill for bill in filtered_bills if bill.chamber == chamber]
    
    if status:
        filtered_bills = [bill for bill in filtered_bills if status.lower() in bill.status.lower()]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_bills = filtered_bills[start:end]
    
    return SearchResult(
        bills=paginated_bills,
        total=len(filtered_bills),
        page=page,
        limit=limit
    )

@app.get("/api/v1/bills/{bill_id}", response_model=Bill)
async def get_bill(bill_id: str):
    """Get a specific bill by ID"""
    bill = next((b for b in MOCK_BILLS if b.id == bill_id), None)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill

@app.post("/api/v1/chat/message", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """Process a chat message using the RAG system"""
    if not vector_store:
        raise HTTPException(status_code=503, detail="RAG system not available")
    
    try:
        # Extract keywords from the query using the LLM
        keyword_prompt = f"""Extract 2-3 key search terms from this question about US Congress bills: "{request.message}"
        Return only the keywords separated by spaces, no extra text."""
        
        keyword_response = await asyncio.get_event_loop().run_in_executor(
            None, chat.invoke, keyword_prompt
        )
        keywords = keyword_response.content.strip()
        
        # Perform similarity search
        docs = await asyncio.get_event_loop().run_in_executor(
            None, vector_store.similarity_search, request.message, 10
        )
        
        # Re-rank documents if available
        if docs:
            try:
                reranked_docs = await asyncio.get_event_loop().run_in_executor(
                    None, rerank_documents_hf, request.message, docs, "BAAI/bge-reranker-large", 5
                )
                docs = reranked_docs if reranked_docs else docs
            except Exception as e:
                print(f"Re-ranking failed, using original docs: {e}")
        
        # Prepare context from retrieved documents
        context = "\n\n".join([doc.page_content for doc in docs[:3]])
        
        # Generate response using the LLM
        prompt = f"""You are a helpful assistant specialized in US Congressional legislation. 
        Based on the following context from bills and documents, answer the user's question accurately and concisely.
        
        Context:
        {context}
        
        User Question: {request.message}
        
        Provide a clear, informative answer. If the context doesn't contain relevant information, say so and provide general guidance."""
        
        response = await asyncio.get_event_loop().run_in_executor(
            None, chat.invoke, prompt
        )
        
        # Create mock sources from retrieved documents
        sources = []
        for i, doc in enumerate(docs[:3]):
            sources.append(DocumentSource(
                id=f"src-{uuid.uuid4()}",
                billId=doc.metadata.get('source', 'unknown'),
                title=f"Document {i+1}: {doc.metadata.get('source', 'Unknown Source')}",
                excerpt=doc.page_content[:200] + "...",
                relevanceScore=0.9 - (i * 0.1),
                url=f"/documents/{doc.metadata.get('chunk_id', i)}"
            ))
        
        return ChatResponse(
            messageId=str(uuid.uuid4()),
            content=response.content,
            sources=sources,
            metadata={
                "model": "llama3.2",
                "tokens": len(response.content.split()),
                "latencyMs": 1000,
                "keywords": keywords
            }
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time chat"""
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back for now - in production, this would trigger RAG processing
            await manager.send_message(f"Echo: {data}", session_id)
    except WebSocketDisconnect:
        manager.disconnect(session_id)

@app.post("/api/v1/search", response_model=SearchResult)
async def perform_search(query: str, filters: Optional[SearchFilters] = None):
    """Advanced search with filters"""
    # For now, redirect to bills search
    return await search_bills(
        q=query,
        chamber=filters.chamber if filters else None,
        status=filters.status if filters else None
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )