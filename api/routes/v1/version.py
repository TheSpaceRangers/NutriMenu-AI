from os import getenv

from dto import GetVersionResponse

from . import api_v1

@api_v1.get('/version')
def version() -> GetVersionResponse:
    """
    This route return the current version of the api
    """
    return GetVersionResponse(version=getenv("VERSION", "0.0.0"))