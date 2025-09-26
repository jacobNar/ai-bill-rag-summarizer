# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Retrieval-Augmented Generation (RAG) AI chatbot for interacting with U.S. Congress legislation. The application:
- Ingests bill text and XML files from congress.gov
- Chunks documents semantically or using XML-aware chunking
- Embeds chunks using Ollama embeddings and stores them in Chroma vector database
- Provides a chat interface using LLMs via Ollama to answer questions about bills

## Key Commands

### Running the Application
```bash
python bill-summarizer.py
```

### Installing Dependencies
```bash
pip install -r requirements.txt
```

## Architecture and Key Components

### Core Script
- `bill-summarizer.py`: Main application containing all RAG logic
  - Document ingestion and chunking
  - Chroma vector store management
  - Similarity search with optional HuggingFace re-ranking
  - LLM chat loop for Q&A

### Document Processing
- **Plain Text**: Uses `SemanticChunker` from langchain_experimental for semantically-informed chunking
- **XML Bills**: Custom `chunk_xml_bill` function using BeautifulSoup for element-based chunking with metadata preservation

### Key Dependencies
- **Ollama**: Local LLM server (requires models: `llama3.2`, `mxbai-embed-large`)
- **Chroma**: Vector database stored in `./chroma_db`
- **HuggingFace Transformers**: Re-ranking model (`BAAI/bge-reranker-large`)
- **LangChain**: Core framework for embeddings, document handling, and LLM integration

### Data Directories
- `text-docs/`: Plain text documents (e.g., `bill.txt`)
- `rag-docs/`: XML bill files from congress.gov

## Important Technical Details

### Prerequisites
- Ollama server must be running locally at `http://localhost:11434/`
- Models `llama3.2` and `mxbai-embed-large` must be installed in Ollama
- CUDA recommended for GPU acceleration of HuggingFace re-ranker (falls back to CPU)

### Persistence
- Chroma DB persists to `./chroma_db` directory
- On first run: creates and populates the database
- Subsequent runs: loads existing database

### Document Flow
1. Documents are chunked based on type (semantic for text, XML-aware for bills)
2. Chunks get unique IDs and metadata (source, chunk_id, parent/child relationships for XML)
3. Embeddings created via OllamaEmbeddings and stored in Chroma
4. Query processing extracts keywords, performs similarity search, re-ranks results
5. Context assembly includes sibling chunks for better coherence
6. Final LLM call generates response with assembled context