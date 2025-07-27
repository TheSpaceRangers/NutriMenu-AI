from pydantic import Field
from typing import Annotated, Optional
from datetime import date

from fastapi import Depends, HTTPException, status, Query
from fastapi.security import HTTPAuthorizationCredentials

from integrations import generate, save_menus, SaveMenuError, get_menus_for_month
from schemas import Menus, MenuSlimByMonth

from . import api_v1, security

@api_v1.get('/generate_menu', response_model=Menus)
def generate_menu(
        days: Annotated[int, Field(gt=0)],
        people: Annotated[int, Field(gt=0)],
        diet: Annotated[Optional[str], Field(default="Tous les régimes")] = None,
        start_date: Annotated[Optional[str], Field(default=date.today().isoformat())] = None,
        credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    menus = generate(days, people, diet, start_date)

    try:
        save_menus(menus, token)
    except SaveMenuError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Database save failed",
                "message": str(e)
            }
        )

    return menus

@api_v1.get("/menus", response_model=MenuSlimByMonth)
async def get_menus(
    month: Annotated[str, Query(..., description="Comma separated months yyyy-mm,yyyy-mm,yyyy-mm")],
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    fake_data = {
        "2025-06": [
            {"date": "2025-06-01", "lunch": "Poulet rôti", "dinner": "Salade César"},
            {"date": "2025-06-02", "lunch": "Spaghetti", "dinner": "Soupe de légumes"},
        ],
        "2025-07": [
            {"date": "2025-07-01", "lunch": "Tacos", "dinner": "Quiche Lorraine"},
            {"date": "2025-07-02", "lunch": "Couscous", "dinner": "Gratin dauphinois"},
        ],
        "2025-08": [
            {"date": "2025-08-01", "lunch": "Bœuf bourguignon", "dinner": "Pâtes au pesto"},
            {"date": "2025-08-02", "lunch": "Risotto", "dinner": "Ratatouille"},
        ],
    }
    return fake_data

    # token = credentials.credentials
    # months_list = [m.strip() for m in month.split(",")]

    # try:
    #     menus_by_month = await get_menus_for_month(months_list, token)
    #     return menus_by_month
    # except Exception as e:
    #     print(f"🔥 ERROR get_menus: {e}")
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail={"error": "Database query failed", "message": str(e)},
    #     )