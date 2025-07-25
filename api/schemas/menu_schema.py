from datetime import datetime

from pydantic import BaseModel
from typing import List

class Ingredient(BaseModel):
    name: str
    quantity: str

class Meal(BaseModel):
    name: str
    ingredients: List[Ingredient]

class Menu(BaseModel):
    date: datetime
    lunch: Meal
    diner: Meal
    diet: str

class Menus(BaseModel):
    menus: List[Menu]
