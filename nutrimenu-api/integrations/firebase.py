from os import getenv
from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from asyncio import to_thread, wait_for, TimeoutError
from collections import defaultdict

import firebase_admin
from firebase_admin import credentials, firestore, auth
from google.cloud.firestore_v1.base_query import FieldFilter

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
    except ValueError as e:
        raise ValueError(f"Token invalide: {e}")

def _save_menu(to_save: Menu, user_uid: str) -> str:
    try:
        data = to_save.model_dump()
        data["user_uid"] = user_uid
        _, ref_doc = _database.collection("menus").add(data)
        return ref_doc.id
    except GoogleAPIError as e:
        raise SaveMenuError(f"Failed to save menu: {e}")
    except Exception as e:
        raise SaveMenuError(f"Unexpected error when saving menu: {e}")

def save_menus(to_save: Menus, id_token: str):
    """
    Vérifie le token utilisateur, puis enregistre chaque menu en y ajoutant l'uid.
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

async def get_menus_for_month(month: list[str], id_token: str):
    try:
        user_uid = verify_token(id_token)
    except Exception as e:
        raise ValueError("Invalid Firebase token") from e

    def _fetch():
        years_months = [tuple(map(int, m.split("-"))) for m in month]
        years_months.sort()

        start_year, start_month = years_months[0]
        end_year, end_month = years_months[-1]

        start_date = datetime(start_year, start_month, 1, tzinfo=timezone.utc)
        end_date = datetime(end_year, end_month, 1, tzinfo=timezone.utc) + relativedelta(months=1)

        docs = (
            _database.collection("menus")
            .where(filter=FieldFilter("user_uid", "==", user_uid))
            .where(filter=FieldFilter("date", ">=", start_date))
            .where(filter=FieldFilter("date", "<", end_date))
            .stream()
        )

        results = defaultdict(list)
        for doc in docs:
            data = doc.to_dict()

            if not data or "date" not in data:
                continue

            date_val  = data["date"]
            if isinstance(date_val , datetime):
                month_str = data["date"].strftime("%Y-%m")
            elif isinstance(date_val , str):
                month_str = data["date"][:7]
            else:
                continue

            results[month_str].append({
                "date": data.get("date"),
                "lunch": data.get("lunch", {}).get("name"),
                "dinner": data.get("diner", {}).get("name"),
                # "id": doc.id,  # optionnel
            })

        return results

    try:
        result = await wait_for(to_thread(_fetch), timeout=5)
        return dict(result)
    except TimeoutError as e:
        raise Exception("Firestore timeout (too slow or quota exceeded)")

