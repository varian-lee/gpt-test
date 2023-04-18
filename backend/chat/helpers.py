from users.helpers import incr_cache


def incr_like(chat_id: str):
    incr_cache(f"chat:{chat_id}:like")
