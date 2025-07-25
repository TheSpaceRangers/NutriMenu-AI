from datetime import datetime

from pydantic import BaseModel
from typing import List

class _Ingredient(BaseModel):
    name: str
    quantity: str

class _Meal(BaseModel):
    name: str
    ingredients: List[_Ingredient]

class Menu(BaseModel):
    date: datetime
    lunch: _Meal
    diner: _Meal
    diet: str

class Menus(BaseModel):
    menus: List[Menu]
