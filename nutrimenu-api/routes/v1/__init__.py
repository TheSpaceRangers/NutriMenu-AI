from fastapi import APIRouter
from fastapi.security import HTTPBearer

api_v1 = APIRouter(prefix="/api/v1")

security = HTTPBearer()

from .version import version
from .menu import generate_menu