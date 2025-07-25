from os import getenv

from schemas import Version

from . import api_v1

@api_v1.get('/version')
def version() -> Version:
    """
    This route return the current version of the nutrimenu-api
    """
    return Version(version=getenv("VERSION", "0.0.0"))