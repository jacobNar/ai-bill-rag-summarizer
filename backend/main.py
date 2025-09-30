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
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_experimental.text_splitter import SemanticChunker
import re
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import List, Dict, Any
from bs4 import BeautifulSoup
import logging

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize components directly
ollama_emb = OllamaEmbeddings(
    model="mxbai-embed-large",
)

chat = ChatOllama(
    base_url="http://localhost:11434/",
    model="llama3.1:8b",
    num_predict=2048,
    num_ctx=16384,
)


def rerank_documents_hf(
    query: str,
    documents: List[Document],
    model_name: str = "BAAI/bge-reranker-large",
    top_k: int = 10
) -> List[Dict[str, Any]]:
    if not documents:
        return []

    document_texts = [doc.page_content for doc in documents]
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    pairs = [[query, doc] for doc in document_texts]
    inputs = tokenizer(pairs, padding=True, truncation=True,
                       return_tensors="pt").to(device)

    with torch.no_grad():
        scores = model(**inputs).logits.squeeze().tolist()

    scored_documents = []
    for i, doc in enumerate(documents):
        scored_documents.append(
            {"context": doc.page_content, "score": scores[i], "chunk_id": doc.metadata['chunk_id']})

    scored_documents.sort(key=lambda x: x["score"], reverse=True)
    top_scored_documents = scored_documents[:top_k]

    reranked_documents = [
        next(doc for doc in documents if doc.page_content == item["context"])
        for item in top_scored_documents
    ]

    return reranked_documents


def chunk_text_with_semantic(document_path, ollama_embeddings_model):
    documents = []
    with open(document_path, 'r', encoding='utf-8') as file:
        full_document_content = file.read()

    text_splitter = SemanticChunker(
        embeddings=ollama_embeddings_model,
        breakpoint_threshold_type="percentile",
        breakpoint_threshold_amount=95
    )

    semantically_chunked_docs = text_splitter.create_documents(
        [full_document_content])

    for i, doc in enumerate(semantically_chunked_docs):
        doc.metadata["source"] = document_path
        doc.metadata["chunk_id"] = i
        documents.append(doc)

    return documents


# Global variables for the RAG system
db = None
collection = None
documents = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup the RAG system"""
    global db
    global collection
    global documents
    print("initializing...")
    # Initialize Chroma vector store on startup
    try:
        # Loop through files in text-docs and create a separate collection for each
        text_docs_dir = os.path.join('.', 'text-docs')
        if os.path.exists(text_docs_dir):
            for fname in os.listdir(text_docs_dir):
                print(f"Processing file: {fname}")
                fpath = os.path.join(text_docs_dir, fname)
                if not os.path.isfile(fpath):
                    continue

                try:
                    collection_name = os.path.splitext(fname)[0]
                    # Create a new collection for each file
                    db = Chroma(
                        collection_name=collection_name,
                        persist_directory="./chroma_db",
                        embedding_function=ollama_emb
                    )

                    # Only add documents if collection is empty
                    if db._collection.count() == 0:
                        docs = chunk_text_with_semantic(fpath, ollama_emb)
                        if docs:
                            db.add_documents(docs)
                            print(
                                f"Created collection '{collection_name}' with {len(docs)} docs")
                    else:
                        print(f"Collection '{collection_name}' already exists")

                except Exception as fe:
                    print(f"Failed to process {fpath}: {fe}")

        print("✅ Vector store initialized successfully with per-file collections")
        # Set the default collection to the first one for compatibility
        db = Chroma(
            persist_directory="./chroma_db",
            embedding_function=ollama_emb
        )
        collection = db.get()
        documents = collection["documents"]

    except Exception as e:
        print(f"❌ Failed to initialize vector store: {e}")
        db = None

    yield

    # Cleanup on shutdown
    if db:
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
    allow_origins=["http://localhost:5173",
                   "http://localhost:3000"],  # Vite dev server
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
    bills: List[str]
    total: int
    page: int
    limit: int

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
        "db": "connected" if db else "disconnected"
    }


@app.get("/api/v1/bills", response_model=SearchResult)
async def search_bills(
    q: Optional[str] = None,
    chamber: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 100
):
    """Search and filter bills"""
    try:
        collections = db._client.list_collections()
        collection_names = [col.name for col in collections]
        print(collections)
        return SearchResult(
            bills=collection_names,
            total=len(collection_names),
            page=page,
            limit=limit
        )
    except Exception as e:
        logging.error(f"Error in search_bills: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/bill/{collection_name}", response_model=Bill)
async def get_bill(collection_name: str):
    """Get a specific collection by name and set it as active"""
    global db, collection
    try:
        # Create Chroma instance for the specified collection
        db = Chroma(
            collection_name=collection_name,
            persist_directory="./chroma_db",
            embedding_function=ollama_emb
        )
        # Update the collection after switching db
        collection = db.get()

        return Bill(
            id=collection_name,
            number=collection_name,
            title=f"Bill {collection_name}",
            chamber="unknown",
            sponsor={"name": "unknown", "id": "unknown"},
            status="unknown",
            introducedDate="unknown",
            summary="No summary available.",
            subjects=[]
        )

    except Exception as e:
        logging.error(f"Error getting collection {collection_name}: {e}")
        raise HTTPException(
            status_code=404, detail=f"Collection not found: {str(e)}")


@app.post("/api/v1/chat/message", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """Process a chat message using the RAG system"""
    global db, collection

    if not db:
        raise HTTPException(status_code=503, detail="RAG system not available")

    if not collection:
        collection = db.get()  # Ensure collection is set
        if not collection:
            raise HTTPException(
                status_code=400, detail="No collection loaded. Please select a document first.")
    try:
        # Extract keywords from the query using the LLM
        keyword_prompt = f"""Extract 2-3 key search terms from this question about US Congress bills: "{request.message}"
        Return only the keywords separated by spaces, no extra text."""

        keyword_response = await asyncio.get_event_loop().run_in_executor(
            None, chat.invoke, keyword_prompt
        )
        keywords = keyword_response.content.strip()
        keyword_results = []

        print(f"Extracted keywords: {keywords}")

        # Ensure 'documents' and 'metadatas' keys exist
        if 'documents' in collection and 'metadatas' in collection:
            documents_content = collection['documents']
            documents_metadata = collection['metadatas']

            # Iterate through the documents and their metadata
            for i, doc_content in enumerate(documents_content):
                if any(re.search(rf"\b{re.escape(kw)}\b", doc_content, re.IGNORECASE) for kw in keywords):
                    # Create a Document object with content and metadata
                    doc = Document(page_content=doc_content,
                                   metadata=documents_metadata[i])
                    keyword_results.append(doc)
        else:
            print("Error: 'documents' or 'metadatas' key missing in Chroma DB retrieval.")

        # Perform similarity search
        search_results = await asyncio.get_event_loop().run_in_executor(
            None, db.similarity_search, request.message, 10
        )

        combined_results = search_results + keyword_results[0:10]

        seen = set()
        unique_results = []
        for doc in combined_results:
            identifier = doc.page_content  # or use another unique field if available
            if identifier not in seen:
                unique_results.append(doc)
                seen.add(identifier)

        reranked_docs = await asyncio.get_event_loop().run_in_executor(
            None, rerank_documents_hf, request.message, unique_results, "BAAI/bge-reranker-large", 10
        )

        top_k_results_with_siblings = reranked_docs[:6]

        final_context = []
        for i, result in enumerate(top_k_results_with_siblings):
            current_chunk_id = result.metadata['chunk_id']
            previous_chunk_id = current_chunk_id - 1
            next_chunk_id = current_chunk_id + 1
            print(
                f"Processing Result {i} with chunk_id: {current_chunk_id}, previous_chunk_id: {previous_chunk_id}, next_chunk_id: {next_chunk_id}")
            # Fetch the previous, current, and next chunks
            # previous_chunks = db.get(where={"chunk_id": previous_chunk_id})[
            #     'documents']
            current_chunks = db.get(where={"chunk_id": current_chunk_id})[
                'documents']
            # next_chunks = db.get(where={"chunk_id": next_chunk_id})[
            #     'documents']
            # print(previous_chunks[0], current_chunks[0], next_chunks[0])

            # Add the chunks to final_context in order
            # if previous_chunks:
            #     final_context.extend(previous_chunks)
            if current_chunks:
                final_context.extend(current_chunks)
            # if next_chunks:
            #     final_context.extend(next_chunks)

        context = ""
        for i, result in enumerate(final_context, 0):
            context += f"Result {i}\n{result}\n\n"

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

        return ChatResponse(
            messageId=str(uuid.uuid4()),
            content=response.content,
            sources=None,
            metadata={
                "model": "llama3.1:8b",
                "tokens": len(response.content.split()),
                "latencyMs": 1000,
                "keywords": keywords
            }
        )

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process message: {str(e)}")


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


# @app.post("/api/v1/search", response_model=SearchResult)
# async def perform_search(query: str, filters: Optional[SearchFilters] = None):
#     """Advanced search with filters"""
#     # For now, redirect to bills search
#     return await search_bills(
#         q=query,
#         chamber=filters.chamber if filters else None,
#         status=filters.status if filters else None
#     )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
