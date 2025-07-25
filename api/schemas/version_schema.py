from pydantic import BaseModel, Field

from typing import Annotated

class Version(BaseModel):
    version: Annotated[str, Field(min_length=5, max_length=15)]