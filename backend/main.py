import os

from auth import verify_token
from dotenv import load_dotenv
from fastapi import FastAPI, Header, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from idea_tracker import register_and_check_collision
from llm import generate_llm_response

# Load environment variables from project root .env
env_file = os.path.join(os.path.dirname(__file__), os.pardir, '.env')
load_dotenv(env_file)

app = FastAPI()

# Serve SvelteKit static files
def get_static_dir():
    return os.path.join(os.path.dirname(__file__), os.pardir, 'frontend')
app.mount('/', StaticFiles(directory=get_static_dir(), html=True), name='static')

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
    reply = generate_llm_response(prompt, uid)

    response = {'reply': reply}
    if collision_notice:
        response['collision_notice'] = collision_notice
    return JSONResponse(response)     return JSONResponse(response) 