# SvelteKit + FastAPI Project Template



## Project Structure
- **app**
  - **frontend/** - SvelteKit static build output directory
    - `Chat.svelte` - Main chat component
  - **backend/** - Python FastAPI server directory
    - `main.py` - Entry point, routes, collision logic
    - `llm.py` - LLM integration stub
    - `auth.py` - Firebase Auth verification
    - `idea_tracker.py` - Idea hash registry and collision detection
  - **admin/** - Admin-only FastAPI routes
    - `dashboard.py` - Instance control endpoints
  - `.env` - Environment variables file (not committed to VCS)
  - `Dockerfile` - Container build instructions
  - `run.sh` - Local launch script
  - `arcano-server.service` - systemd service unit file
  - `worker.js` - Cloudflare Worker proxy script
  - `requirements.txt` - Python dependencies

---

### File: `backend/main.py`
```python
from fastapi import FastAPI, Request, Header
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
from auth import verify_token
from llm import generate_llm_response
from idea_tracker import register_and_check_collision

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
    return JSONResponse(response)
```

---

### File: `backend/llm.py`
```python
def generate_llm_response(prompt: str, user_id: str) -> str:
    """
    Placeholder for real LLM integration.
    Replace this stub with actual model call.
    """
    return f"[User {user_id}] LLM says: You said '{prompt}'"
```

---

### File: `backend/auth.py`
```python
import os
import firebase_admin
from firebase_admin import auth, credentials

# Ensure FIREBASE_CREDENTIAL_PATH is set and points to a valid file
cred_path = os.getenv('FIREBASE_CREDENTIAL_PATH')
if not cred_path or not os.path.isfile(cred_path):
    raise RuntimeError('FIREBASE_CREDENTIAL_PATH is not set or the file does not exist')

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

def verify_token(id_token: str):
    return auth.verify_id_token(id_token)
```

---

### File: `backend/idea_tracker.py`
```python
import json
from pathlib import Path
from typing import Optional

DB_FILE = Path(__file__).parent / 'idea_hashes.json'

# Load or initialize the idea database
def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {}

# Save the idea database to disk
def save_db(db):
    DB_FILE.write_text(json.dumps(db, indent=2))

# Register a new idea hash and check for collisions (even from same user)
def register_and_check_collision(user_id: str, idea_hash: str, timestamp: str) -> Optional[str]:
    db = load_db()
    existing = db.get(idea_hash)
    if existing:
        return f"Idea collision: previously submitted by {existing['user_id']} at {existing['timestamp']}"
    db[idea_hash] = {'user_id': user_id, 'timestamp': timestamp}
    save_db(db)
    return None
```

---

### File: `Dockerfile`
```dockerfile
FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libssl-dev libffi-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/ backend/
COPY frontend/ frontend/
COPY .env .

RUN pip install --no-cache-dir fastapi uvicorn python-dotenv firebase-admin

EXPOSE 3000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "3000"]
```

---

### File: `run.sh`
```bash
#!/usr/bin/env bash
set -e
cd frontend
npm ci
npm run build
cd ..
uvicorn backend.main:app --host 0.0.0.0 --port 3000
```

---

### File: `arcano-server.service`
```ini
[Unit]
Description=Arcano LLM Server
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/env bash run.sh
Restart=always
User=ubuntu
Environment=FIREBASE_CREDENTIAL_PATH=/app/serviceAccountKey.json

[Install]
WantedBy=multi-user.target
```

---

### File: `worker.js`
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = `http://YOUR_RUNPOD_IP${url.pathname}`;
    const proxied = new Request(target, request);
    const response = await fetch(proxied);
    return new Response(response.body, {
      status: response.status,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
};
```

---

### File: `requirements.txt`
```
fastapi
uvicorn
python-dotenv
firebase-admin
```

---

## Next Steps

1. Make sure `serviceAccountKey.json` is mounted to `/app/serviceAccountKey.json`.
2. Build the container: `docker build -t arcano-chat .`
3. Run with volume: `docker run -p 3000:3000 -v /path/to/key.json:/app/serviceAccountKey.json arcano-chat`
4. Test locally or deploy with `arcano-server.service`.
