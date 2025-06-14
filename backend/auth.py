import os
from typing import Dict

import firebase_admin
from firebase_admin import auth, credentials
from config.settings import settings

# Initialize Firebase with credentials from settings
cred = credentials.Certificate(settings.FIREBASE_CREDENTIAL_PATH)
firebase_admin.initialize_app(cred)

def verify_token(token: str) -> Dict:
    """
    Verify the Firebase ID token.
    For development, we'll just return a mock user.
    In production, this should verify against Firebase.
    """
    # TODO: Implement actual Firebase token verification
    return {
        'uid': 'test-user',
        'email': 'test@example.com'
    } 