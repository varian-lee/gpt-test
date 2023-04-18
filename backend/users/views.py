from django.conf import settings

from ninja import Router, Schema

from core.schema import ErrorResponse
from users.helpers import authenticate, incr_login_attempts
from users.models import User

router = Router()


class LoginSuccessResponse(Schema):
    access_token: str


@router.post("/login", url_name="login", response={201: LoginSuccessResponse, 401: ErrorResponse})
def login(request, user: User):
    if user.password.strip() != settings.AUTH_CODE:
        incr_login_attempts(user.username)
        return 401, {"message": "Authentication failed"}
    access_token = authenticate(user.username, user.password)
    return 201, {"access_token": access_token}
