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