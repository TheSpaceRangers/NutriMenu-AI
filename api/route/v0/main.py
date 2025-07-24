from os import getenv
from json import loads
from datetime import date

from fastapi import APIRouter
from pydantic import Field
from typing import Annotated, Optional

from dto import GetVersionResponse

from gemini_ai import gemini_trip_v1

api_v0 = APIRouter(prefix='/api/v0')

@api_v0.get('/version')
def version() -> GetVersionResponse:
    """
    This route return the current version of the api
    """
    return GetVersionResponse(version=getenv("VERSION", "0.0.0"))

@api_v0.get('/generate_trip_v1')
def generate_trip_v1(
    days: Annotated[int, Field(gt=0), Field(description="Number of days")],
    people: Annotated[int, Field(gt=0), Field(description="Number of people")],
    diet: Annotated[Optional[str], Field(default="Tous les régimes"), Field(description="Diet type (vegan, vegetarian, gluten-free, etc.)")] = None,
    start_date: Annotated[Optional[str], Field(default=date.today().isoformat()), Field(description="Start date for the plan (YYYY-MM-DD)")] = None,
):
    response = gemini_trip_v1(days, people, diet)

    try:
        return json.loads(response)
    except Exception:
        return {"raw_response": response}