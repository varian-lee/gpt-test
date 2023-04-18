import json
from collections import namedtuple

from django.core.cache import cache
from django.urls import reverse_lazy
from django.test.client import Client

import pytest
from openai.error import RateLimitError

from chat.openai import OpenAI
from users.helpers import authenticate

GPT_API_URL = reverse_lazy("api:gpt")

@pytest.fixture
def access_token(settings) -> str:
    return authenticate('fakeuser', settings.AUTH_CODE)


@pytest.fixture
def user_client(access_token):
    client = Client(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    return client


def test_api_401_error_by_anonymous_user(client):
    payload = {"message": "Hello, world", "fromMe": True}
    resp = client.post(GPT_API_URL, [payload], content_type="application/json")
    assert resp.status_code == 401


def test_api_429_error_if_rate_limit_exceeded(user_client, monkeypatch):
    def rate_limiting(_):
        raise RateLimitError("not enough quota")
    monkeypatch.setattr(OpenAI, "send_message", rate_limiting)

    payload = {"message": "Hello, world", "fromMe": True}
    resp = user_client.post(GPT_API_URL, [payload], content_type="application/json")
    assert resp.status_code == 429


def test_api_gpt_chat_response_schema(user_client, monkeypatch):
    def mock_gpt_response(_):
        klass = namedtuple("MockResponse", ("id", "object", "created", "model", "choices"))
        choice_klass = namedtuple("MockChoice", ("finish_reason", "index", "logprobs", "text"))
        fakechoice = choice_klass("close", 0, None, "Fake Response Text")
        return klass("fakeid", "fakeobjectstring", 1231241, "fakemodelname", [fakechoice])

    monkeypatch.setattr(OpenAI, "send_message", mock_gpt_response)
    payload = {"message": "Hello, world", "fromMe": True}
    resp = user_client.post(GPT_API_URL, [payload], content_type="application/json")
    assert resp.status_code == 201
    body = json.loads(resp.content)
    assert body["chatId"] == "fakeid"
    assert isinstance(body["messages"], list)
    assert body["messages"][0] == "Fake Response Text"


def test_api_gpt_chat_like(user_client):
    chat_id = "fakechatid"
    url = reverse_lazy("api:gpt_like", args=(chat_id,))
    resp = user_client.post(url, content_type="application/json")
    assert resp.status_code == 201
    assert cache.get(f"chat:{chat_id}:like", 0) == 1
