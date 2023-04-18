import json

from django.core.cache import cache
from django.urls import reverse

LOGIN_URL = reverse("api:login")


def test_login_attempt_failed(client):
    resp = client.post(LOGIN_URL, data={"username": "foo", "password": "1234"}, content_type="application/json")
    assert resp.status_code == 401
    assert cache.get(f"login_attempts:foo") == 1


def test_login_success(client, settings):
    resp = client.post(LOGIN_URL, data={"username": "foo", "password": settings.AUTH_CODE},
                       content_type="application/json")
    assert resp.status_code == 201
    access_token = json.loads(resp.content)["access_token"]
    assert cache.get(access_token) == settings.AUTH_CODE
    assert cache.get("login_count:foo") == 1
