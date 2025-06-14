#!/bin/bash

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Ollama if not already installed
if ! command -v ollama &> /dev/null; then
    echo "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Pull required Ollama models
echo "Pulling required Ollama models..."
ollama pull llama3
ollama pull codellama

# Install frontend dependencies
cd frontend
npm install
cd ..

# Create necessary directories
mkdir -p data/chat_logs
mkdir -p data/user_memory
mkdir -p data/llm_cache

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# Firebase Configuration
FIREBASE_CREDENTIAL_PATH=serviceAccountKey.json

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json

# Application Configuration
APP_ENV=development
APP_PORT=3000
OLLAMA_HOST=localhost
OLLAMA_PORT=11434

# Security
JWT_SECRET=your-secret-key
EOL
    echo "Please update the .env file with your actual configuration values."
fi

echo "Setup complete! Please update the .env file with your configuration values."
echo "To start the application:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Start Ollama: ollama serve"
echo "3. Start the backend: uvicorn backend.main:app --reload"
echo "4. In another terminal, start the frontend: cd frontend && npm run dev" 