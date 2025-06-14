import os
from pathlib import Path

from fastapi import FastAPI, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from config.settings import settings
from .auth import verify_token
from .idea_tracker import register_and_check_collision
from .llm import generate_llm_response, initialize_llm, cleanup_llm

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else ["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve SvelteKit static files
def get_static_dir():
    return str(Path(__file__).parent.parent / "frontend" / "build")
# Mount static files AFTER API routes, not at root
# app.mount('/', StaticFiles(directory=get_static_dir(), html=True), name='static')

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    try:
        await initialize_llm()
        print("LLM initialized successfully")
        
        # Pre-warm the model by making a simple request
        print("Pre-warming Ollama model...")
        try:
            # Import here to avoid circular imports
            from backend.llm import generate_llm_response
            response = await generate_llm_response("Hello", "system")
            print(f"Model pre-warming result: {response[:50]}...")
        except Exception as e:
            print(f"Model pre-warming failed (this is normal): {e}")
            
    except Exception as e:
        print(f"Warning: LLM initialization failed: {e}")
        # Continue without LLM

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup services on shutdown."""
    await cleanup_llm()

@app.post('/api/chat')
async def chat(request: Request, authorization: str = Header(None)):
    # Validate Firebase ID token
    if not authorization or not authorization.startswith('Bearer '):
        return JSONResponse({'error': 'Missing or invalid Authorization header'}, status_code=401)
    token = authorization.split()[1]
    try:
        user = verify_token(token)
        uid = user['uid']
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=403)

    data = await request.json()
    prompt = data.get('message', '')
    idea_hash = data.get('idea_hash')
    timestamp = data.get('timestamp')

    # Check for idea collisions (even if same user)
    collision_notice = None
    if idea_hash and timestamp:
        collision_notice = register_and_check_collision(uid, idea_hash, timestamp)

    # Generate LLM response
    reply = await generate_llm_response(prompt, uid)

    response = {'reply': reply}
    if collision_notice:
        response['collision_notice'] = collision_notice
    return JSONResponse(response)

@app.get('/api/health')
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "environment": settings.APP_ENV}

@app.get('/test')
async def test():
    return {"message": "FastAPI is working"}