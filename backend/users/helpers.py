from uuid import uuid4

from django.conf import settings
from django.core.cache import cache

from django_redis import get_redis_connection


def generate_access_token() -> str:
    """generate random access token string"""
    return str(uuid4())


def incr_cache(cache_key: str) -> int:
    """
    increase the number stored at key in cache server
    if the key does not exist, set 1

    Returns:
        the number stored at key
    """
    if not cache.has_key(cache_key):
        cache.set(cache_key, 0)
    return cache.incr(cache_key)


def incr_login_count(username: str) -> None:
    """increase the login count"""
    incr_cache(f"login_count:{username}")


def incr_login_attempts(username: str):
    """increase the count of failed login attempt"""
    incr_cache(f"login_attempts:{username}")


def clear_login_attempts(username: str):
    """delete the count of failed login attempt"""
    cache.delete(f"login_attempts:{username}")


def authenticate(username: str, password: str) -> str:
    """
    Authenticate with username & password.

    Args:
        username (str): can be any string with length range 1~20
        password (str): must be same as AUTH_CODE of settings.

    Returns:
        str: access token
    """
    access_token = generate_access_token()
    cache.set(access_token, password, timeout=settings.AUTH_EXPIRATION)
    incr_login_count(username)
    clear_login_attempts(username)
    return access_token
