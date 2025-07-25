from fastapi import APIRouter

api_v1 = APIRouter(prefix="/api/v1")

from .version import version
from .menu import generate_menu