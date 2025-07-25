from os import getenv

from google.cloud import firestore
from google.api_core.exceptions import GoogleAPIError

from schemas import Menus, Menu

_database = None

class SaveMenuError(Exception):
    pass

def get_database():
    global _database
    if _database is None:
        credentials_path = getenv("FIREBASE_CREDENTIALS")
        if not credentials_path:
            raise ValueError("FIREBASE_CREDENTIALS not set")
        _database = firestore.Client.from_service_account_json(credentials_path)
    return _database

def _save_menu(to_save: Menu) -> str:
    try:
        db = get_database()
        _, ref_doc = db.collection("menus").add(to_save.dict())
        return ref_doc.id
    except GoogleAPIError as e:
        raise SaveMenuError(f"Failed to save menu: {e}")
    except Exception as e:
        raise SaveMenuError(f"Unexpected error when saving menu: {e}")

def save_menus(to_save: Menus):
    doc_ids = []
    for menu in to_save.menus:
        try:
            doc_id = _save_menu(menu)
            doc_ids.append(doc_id)
        except SaveMenuError as e:
            raise SaveMenuError(f"Failed to save menus batch: {e}")
    return doc_ids
