# AI Bill RAG Summarizer

Goal
----
This project aims to build a production-ready Retrieval-Augmented Generation (RAG) AI chatbot for interacting with legislation going through the U.S. Congress. The app downloads or ingests bill text and XML files (for example, files from congress.gov), chunks and embeds the documents, stores them in a vector database (Chroma), and provides a chat interface driven by an LLM (via Ollama) to answer general questions or deep-dive into specific bills.

What this repository contains
----------------------------
- `bill-summarizer.py` — the main Python script that:
  - loads or creates a Chroma vector store from text or XML bill documents,
  - chunks documents semantically (or uses a custom XML chunking flow),
  - embeds chunks using Ollama embeddings,
  - performs similarity search and optional re-ranking using a Hugging Face re-ranker,
  - drives a chat loop that refines queries into keyword searches and constructs context for the LLM.
- `text-docs/` — sample plain text documents (e.g., `bill.txt`, `article.txt`).
- `rag-docs/` — sample XML bills from congress.gov used for XML-aware chunking.

High-level flow
---------------
1. Ingest a document (plain text or XML).
2. Chunk the document into semantically meaningful pieces or XML elements.
3. Embed chunks using `OllamaEmbeddings` and persist them into a Chroma DB (`./chroma_db`).
4. On user question, do a similarity search in Chroma and optionally refine the query into keywords using the LLM.
5. Re-rank candidate chunks using a Hugging Face pairwise re-ranker model (optional) and assemble surrounding sibling chunks for context.
6. Call the LLM (via Ollama) with the assembled context + user query and return an answer.

Quick start
-----------
Prerequisites (assumptions made in the script):

- Ollama server running locally and reachable at `http://localhost:11434/` with the LLM and embedding models installed (`llama3.2`, `mxbai-embed-large` in the script). Adjust names in the script if you use different models.
- CUDA if you want to use GPU for the Hugging Face re-ranker (the script falls back to CPU).

Install Python dependencies
---------------------------
Create a virtual environment and install dependencies. Example PowerShell commands:

```powershell
pip install -r requirements.txt
```

Running the app
---------------
1. Make sure the Ollama server is running and the specified models are available.
2. Place bill text or XML files into `text-docs/` or `rag-docs/` respectively. The example script will chunk `text-docs/bill.txt` and create a `chroma_db` directory the first time it runs.
3. Run the script:

```powershell
python bill-summarizer.py
```

When run for the first time the script will create and persist a Chroma DB. On subsequent runs it will load the existing DB and start the chat loop.

Key implementation details
-------------------------
- Embeddings: `OllamaEmbeddings` is used to embed chunks. These are persisted to Chroma (`persist_dir = './chroma_db'`).
- Chunking:
  - For plain text files the script uses `SemanticChunker` (from `langchain_experimental`) to create semantically-informed chunks.
  - For XML bill files the script contains a custom `chunk_xml_bill` function which uses BeautifulSoup to recursively split the XML into element-based chunks, attach metadata (tag name, attributes, parent/child relationships), and respect a `max_chunk_size`.
- Re-ranking: `rerank_documents_hf` uses a Hugging Face sequence-classification model (default `BAAI/bge-reranker-large`) to score candidate query-document pairs and produce a top-k re-ranked list. The function loads HF tokenizer and model and runs on GPU if available. You can disable or change this model if you prefer a different re-ranker.
- Chat flow: The main loop uses the LLM to extract keywords from the user question and then combines keyword-based filtering with a Chroma similarity search. The script deduplicates results, reranks them, grabs sibling chunks (previous/next chunk IDs) for context, and sends the assembled context + query to the LLM.

Limitations and security
------------------------
- The script assumes local Ollama with the specified models; adjust model and host settings as needed.
- The script does not include authentication or rate-limiting for production deployment.
- XML chunking preserves element strings; for very large XML files you may need more sophisticated chunking or streaming to avoid memory pressure.
- No input sanitization is performed on arbitrary XML contents beyond parsing with BeautifulSoup.

Next steps / Production considerations
------------------------------------
- Build a UI to instead of a console loop.
- Finalize models.
- Refactor python script to production ready API.
- Design cloud infrastructure.

Files of interest
-----------------
- `bill-summarizer.py` — main script to read, chunk, embed, and chat.
- `text-docs/bill.txt` — sample plain text bill used by default when creating the DB.
- `rag-docs/*.xml` — sample XML bill files demonstrating `chunk_xml_bill` usage.

