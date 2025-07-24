from pydantic import BaseModel, Field

from typing import Annotated

class GetVersionResponse(BaseModel):
    version: Annotated[str, Field(max_length=15), Field(min_length=5)]