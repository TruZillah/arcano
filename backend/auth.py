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
    return auth.verify_id_token(id_token)     return auth.verify_id_token(id_token) 