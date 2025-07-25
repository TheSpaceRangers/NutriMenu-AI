from os import getenv

from google.cloud import firestore

_database = None

def get_database():
    global _database
    if _database is None:
        credentials_path = getenv("FIREBASE_CREDENTIALS")
        if not credentials_path:
            raise ValueError("FIREBASE_CREDENTIALS not set")
        _database = firestore.Client.from_service_account_json(credentials_path)
    return _database
