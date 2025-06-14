# Arcano - AI-Powered Chat Interface

A modern chat interface powered by LLMs, built with FastAPI and SvelteKit.

## Features

- 🤖 Powered by Ollama LLMs (llama3, codellama)
- 🔐 Firebase Authentication
- 💾 Google Cloud Storage for file management
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 Real-time updates
- 🔒 Secure API access

## Prerequisites

- Python 3.10+
- Node.js 18+
- Ollama
- Google Cloud account
- Firebase account

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/arcano.git
cd arcano
```

2. Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

3. Update the `.env` file with your configuration values.

4. Start the application:
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start the backend
source venv/bin/activate
uvicorn backend.main:app --reload

# Terminal 3: Start the frontend
cd frontend
npm run dev
```

5. Open http://localhost:3000 in your browser.

## Project Structure

```
arcano/
├── backend/           # FastAPI backend
├── frontend/          # SvelteKit frontend
├── admin/            # Admin dashboard
├── config/           # Configuration files
├── docs/             # Documentation
└── data/             # Data storage
    ├── chat_logs/    # Chat history
    ├── user_memory/  # User state
    └── llm_cache/    # LLM cache
```

## Development

### Backend

The backend is built with FastAPI and includes:
- Authentication with Firebase
- File management with Google Cloud Storage
- LLM integration with Ollama
- WebSocket support for real-time updates

### Frontend

The frontend is built with SvelteKit and includes:
- Modern UI with Tailwind CSS
- Real-time chat interface
- Code syntax highlighting
- Markdown support
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 