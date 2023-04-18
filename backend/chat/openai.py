from typing import Optional

import openai

from django.conf import settings
from ninja import Schema

openai.organization = settings.OPENAI_ORG_ID
openai.api_key = settings.OPENAI_SECRET_KEY


class CompletionSchema(Schema):
    id: str
    object: str
    created: int
    model: str
    choices: list['CompletionChoiceSchema']


class CompletionChoiceSchema(Schema):
    finish_reason: str
    index: int
    logprobs: Optional[float]
    text: str


class OpenAI:

    @staticmethod
    def send_message(message: str) -> CompletionSchema:
        result = openai.Completion.create(
            prompt=message,
            **settings.OPENAI_SETTINGS,
        )
        return result
