from pydantic import BaseModel, Field

from typing import Annotated, Optional

class GenerateTripRequest(BaseModel):
    days: Annotated[int, Field(gt=0), Field(description="Number of days")]
    people: Annotated[int, Field(gt=0), Field(description="Number of people")]
    diet: Annotated[Optional[str], Field(default="no preference"), Field(description="Diet type (vegan, vegetarian, gluten-free, etc.)")]
