from datetime import datetime

from pydantic import BaseModel, RootModel
from typing import List, Optional

class _Ingredient(BaseModel):
    name: str
    quantity: str

class _Meal(BaseModel):
    name: str
    ingredients: List[_Ingredient]

class Menu(BaseModel):
    date: datetime
    lunch: _Meal
    dinner: _Meal
    diet: str

class Menus(BaseModel):
    menus: List[Menu]

class _MenuSlim(BaseModel):
    date: datetime
    lunch: Optional[str]
    dinner: Optional[str]

class MenuSlimByMonth(RootModel[dict[str, list[_MenuSlim]]]):
   pass
