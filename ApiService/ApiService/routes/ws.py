from fastapi import WebSocket
from fastapi import APIRouter
import logging
import asyncio
from ApiService.services.kafka_client import KafkaConsumerManager
from ApiService.services.redis_client import RedisClient
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix='/ws')
active_connections = {}

@router.websocket("")
async def websocket_endpoint(websocket: WebSocket):
    """
    Сооединение websocket
    """
    # Получаем user_id из cookies
    user_id = websocket.cookies.get("user_id")

    if not user_id:
        logger.warning("Пользователь не авторизован: отсутствует user_id в cookies")
        await websocket.accept()
        await websocket.send_text("Ошибка: отсутствует user_id в cookies")
        await websocket.close(code=4000)  # Кастомный код ошибки
        return

    logger.info(f"Подключение от пользователя: {user_id}")

    await websocket.accept()
    active_connections[user_id] = websocket
    try:
        while True:
            await asyncio.sleep(0.1)  # Чтобы не блокировать
    except Exception as e:
        logger.warning(f"WebSocket error: {e}")
        del active_connections[user_id]


async def kafka_listener():
    try:
        global active_connections
        while True:
            async with KafkaConsumerManager(group_id='ws_group') as consumer:
                async for message in consumer:
                    logger.info(f"Получено сообщение: {message} -- {message.value}")
                    user_id = await RedisClient().get_key(''.join(''.join(message.value.split('_')[2:]).split('.')[:-1]))
                    logger.info(f"Получен user_id: {user_id}")
                    user = active_connections.get(user_id)
                    if user:
                        # Формируем JSON-сообщение для отправки клиенту
                        response = {
                            "event": "new_file",
                            "filename": message.value,
                        }
                        await user.send_text(json.dumps(response))
            await asyncio.sleep(5)
    except Exception as e:
        logger.warning(f"kafka_listener error: {e}")
        return False