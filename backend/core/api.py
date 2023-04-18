from django.core.handlers.wsgi import WSGIRequest

from openai.error import RateLimitError
from ninja import NinjaAPI

from users.views import router as user_router
from chat.views import router as chat_router

api = NinjaAPI(urls_namespace="api")
api.add_router("", router=user_router)
api.add_router("", router=chat_router)


@api.exception_handler(RateLimitError)
def openai_rate_limit(request: WSGIRequest, _):
    """exception handler for openai api throttling"""
    return api.create_response(
        request=request,
        data={"message": "You exceeded your current openai rate limit quota"},
        status=429,
    )
