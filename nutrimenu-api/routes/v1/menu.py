from pydantic import Field
from typing import Annotated, Optional
from datetime import date

from fastapi import HTTPException, status

from integrations import generate, save_menus, SaveMenuError
from schemas import Menus

from . import api_v1

@api_v1.get('/generate_menu', response_model=Menus)
def generate_menu(
    days: Annotated[int, Field(gt=0)],
    people: Annotated[int, Field(gt=0)],
    diet: Annotated[Optional[str], Field(default="Tous les régimes")] = None,
    start_date: Annotated[Optional[str], Field(default=date.today().isoformat())] = None,
):
    menus = generate(days, people, diet)

    try:
        save_menus(menus)
    except SaveMenuError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Database save failed",
                "message": str(e)
            }
        )

    return menus
