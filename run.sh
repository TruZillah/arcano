#!/usr/bin/env bash
set -e

# Start Ollama in the background
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
until curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 1
done

# Pull required models if they don't exist
echo "Checking for required Ollama models..."
if ! ollama list | grep -q "llama3"; then
    echo "Pulling llama3 model..."
    ollama pull llama3
fi

if ! ollama list | grep -q "codellama"; then
    echo "Pulling codellama model..."
    ollama pull codellama
fi

# Build and start frontend
cd frontend
npm ci
npm run build
cd ..

# Start the FastAPI backend
echo "Starting FastAPI backend..."
uvicorn backend.main:app --host 0.0.0.0 --port 3000 &

# Wait for any process to exit
wait -n

# Kill the remaining processes
kill $OLLAMA_PID 