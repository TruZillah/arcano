import json
from pathlib import Path
from typing import Optional
import time
from config.settings import settings

DB_FILE = settings.DATA_DIR / 'idea_hashes.json'

# Load or initialize the idea database
def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {}

# Save the idea database to disk
def save_db(db):
    DB_FILE.write_text(json.dumps(db, indent=2))

# Register a new idea hash and check for collisions (even from same user)
def register_and_check_collision(uid: str, idea_hash: str, timestamp: float) -> Optional[str]:
    """
    Register an idea and check for collisions.
    For development, we'll just return None.
    In production, this should check against a database.
    """
    # TODO: Implement actual collision detection
    return None 