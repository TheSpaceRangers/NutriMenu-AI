from os import getenv
from json import loads
from datetime import date

from pydantic import Field
from typing import Annotated, Optional

from integrations import generate

from . import api_v1

@api_v1.get('/generate_menu')
def generate_menu(
    days: Annotated[int, Field(gt=0), Field(description="Number of days")],
    people: Annotated[int, Field(gt=0), Field(description="Number of people")],
    diet: Annotated[Optional[str], Field(default="Tous les régimes"), Field(description="Diet type (vegan, vegetarian, gluten-free, etc.)")] = None,
    start_date: Annotated[Optional[str], Field(default=date.today().isoformat()), Field(description="Start date for the plan (YYYY-MM-DD)")] = None,
):
    return generate(days, people, diet)