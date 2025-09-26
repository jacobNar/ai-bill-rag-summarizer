#!/bin/bash

# Start the FastAPI backend server
echo "Starting Congress Chat API server..."
echo "Make sure Ollama is running: ollama serve"
echo "Required models: ollama pull llama3.2 && ollama pull mxbai-embed-large"

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting server on http://localhost:8000"
python main.py