from typing import Optional, Any

from django.core.cache import cache
from django.conf import settings
from django.http.request import HttpRequest

from ninja.security import HttpBearer


class CodeAuthBearer(HttpBearer):

    def authenticate(self, request: HttpRequest, token: str) -> Optional[Any]:
        if cache.get(token, '') == settings.AUTH_CODE:
            return token



