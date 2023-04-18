from ninja import Schema, Router
from pydantic import Field

from django.conf import settings

from chat.helpers import incr_like
from chat.openai import OpenAI
from core.schema import ErrorResponse
from core.auth import CodeAuthBearer

import dns.name

import os
os.environ["NEW_RELIC_LICENSE_KEY"] = "02fa85457d1af9f2267207f63bb23a63e320NRAL"

from nr_openai_observability import monitor
monitor.initialization()


router = Router()


class GptAPIIn(Schema):
    message: str
    from_me: bool = Field(..., alias="fromMe")

class GptAPIOut(Schema):
    messages: list[str]
    chatId: str


class ChatLikeIn(Schema):
    chat_id: str = Field(..., alias="chatId")


class ChatLikeOut(Schema):
    message: str


gpt_api_response_schema = {201: GptAPIOut, 429: ErrorResponse, 401: ErrorResponse}
gpt_like_api_response_schema = {201: ChatLikeOut, 401: ErrorResponse}


@router.post("/gpt", auth=CodeAuthBearer(), response=gpt_api_response_schema, url_name="gpt")
def gpt_api(request, body: list[GptAPIIn]):
    """Parse messages and return fetched GPT reply"""
    
    name = dns.name.from_text('www.dnspython.org.') # 필요없는 한줄. VM 설명 위해 존재

    messages = []
    for row in body:
        prefix = settings.OPENAI_STOP_HUMAN if row.from_me else settings.OPENAI_STOP_AI
        messages.append("%s:%s" % (prefix, row.message))
    messages.append(f"{settings.OPENAI_STOP_AI}:")
    resp = OpenAI.send_message("\n".join(messages))
    return 201, {"messages": [choice.text.strip() for choice in resp.choices], "chatId": resp.id}


@router.post("/gpt/{chat_id}", auth=CodeAuthBearer(), response=gpt_like_api_response_schema, url_name="gpt_like")
def gpt_like(request, chat_id: str):
    incr_like(chat_id)
    return 201, {"message": "OK"}
