# Build stage for frontend
FROM node:18-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build stage for Python dependencies
FROM python:3.10-slim AS python-builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage - using minimal CUDA runtime
FROM nvidia/cuda:12.1.0-base-ubuntu22.04

# Install only necessary system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    python3.10 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s /usr/bin/python3.10 /usr/bin/python

# Install Ollama (without models)
RUN curl -fsSL https://ollama.com/install.sh | sh \
    && mkdir -p /root/.ollama

WORKDIR /app

# Copy only necessary files from build stages
COPY --from=frontend-builder /app/build ./frontend/build
COPY --from=python-builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY backend/ backend/
COPY run.sh .

EXPOSE 3000 11434

RUN chmod +x /app/run.sh

# Update run.sh to handle model downloading
RUN echo '#!/bin/bash\n\
# Start Ollama in the background\n\
ollama serve &\n\
OLLAMA_PID=$!\n\
\n\
# Wait for Ollama to be ready\n\
echo "Waiting for Ollama to start..."\n\
until curl -s http://localhost:11434/api/tags > /dev/null; do\n\
    sleep 1\n\
done\n\
\n\
# Pull required models if they don'\''t exist\n\
echo "Checking for required Ollama models..."\n\
if ! ollama list | grep -q "llama3"; then\n\
    echo "Pulling llama3 model..."\n\
    ollama pull llama3\n\
fi\n\
\n\
if ! ollama list | grep -q "codellama"; then\n\
    echo "Pulling codellama model..."\n\
    ollama pull codellama\n\
fi\n\
\n\
# Start the FastAPI backend\n\
echo "Starting FastAPI backend..."\n\
uvicorn backend.main:app --host 0.0.0.0 --port 3000 &\n\
\n\
# Wait for any process to exit\n\
wait -n\n\
\n\
# Kill the remaining processes\n\
kill $OLLAMA_PID' > /app/run.sh

CMD ["/app/run.sh"] 