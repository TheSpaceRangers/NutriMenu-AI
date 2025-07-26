from os import getenv

from google.cloud import firestore
from google.api_core.exceptions import GoogleAPIError

import firebase_admin
from firebase_admin import credentials, firestore, auth
from firebase_admin._auth_utils import InvalidIdTokenError

from schemas import Menus, Menu

_database = None

class SaveMenuError(Exception):
    pass

def initialize_firebase():
    global _database
    if not firebase_admin._apps:
        credentials_path = getenv("FIREBASE_CREDENTIALS")
        if not credentials_path:
            raise ValueError("FIREBASE_CREDENTIALS not set")
        cred = credentials.Certificate(credentials_path)
        firebase_admin.initialize_app(cred)
    _database = firestore.client()

def get_database():
    global _database
    if _database is None:
        initialize_firebase()
    return _database

def verify_token(id_token: str) -> str:
    """
    Vérifie le token d'authentification Firebase et retourne le uid de l'utilisateur.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except (InvalidIdTokenError, ValueError) as e:
        raise ValueError(f"Token invalide: {e}")

def _save_menu(to_save: Menu, user_uid: str) -> str:
    try:
        data = to_save.dict()
        data["user_uid"] = user_uid
        _, ref_doc = _database.collection("menus").add(data)
        return ref_doc.id
    except GoogleAPIError as e:
        raise SaveMenuError(f"Failed to save menu: {e}")
    except Exception as e:
        raise SaveMenuError(f"Unexpected error when saving menu: {e}")

def save_menus(to_save: Menus, id_token: str):
    """
    Vérifie le token utilisateur, puis enregistre chaque menu en y ajoutant le uid.
    """
    user_uid = verify_token(id_token)
    doc_ids = []
    for menu in to_save.menus:
        try:
            doc_id = _save_menu(menu, user_uid)
            doc_ids.append(doc_id)
        except SaveMenuError as e:
            raise SaveMenuError(f"Failed to save menus batch: {e}")
    return doc_ids
