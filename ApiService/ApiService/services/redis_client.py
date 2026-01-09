import os
import redis.asyncio as redis
from dotenv import load_dotenv
import logging


load_dotenv()
logger = logging.getLogger(__name__)


class RedisClient:
    def __init__(self):
        self.redis = redis.from_url(os.getenv("REDIS_URL"), decode_responses=False)

    async def add_to_list(self, key: str, value: str):
        """
        Добавляет строку в список по ключу.
        """
        try:
            if not isinstance(value, str):
                raise ValueError("Value must be a string")
            await self.redis.rpush(key, value.encode('utf-8'))
            logger.info(f"Добавлено значение {value} в список {key}")
        except Exception as e:
            logger.error(f"Ошибка при добавлении значения в список: {e}")
            raise e

    async def remove_from_list(self, key: str, value: str):
        """
        Удаляет все вхождения строки из списка.
        """
        if not isinstance(value, str):
            raise ValueError("Value must be a string")
        # count=0 — удаляем все совпадения
        await self.redis.lrem(key, 0, value.encode('utf-8'))
        logger.info(f"Удалено значение {value} из списка {key}")

    async def get_list(self, key: str):
        """
        Получает весь список по ключу и возвращает элементы как строки.
        """
        raw_items = await self.redis.lrange(key, 0, -1)
        return [item.decode('utf-8') for item in raw_items]

    async def close(self):
        await self.redis.close()


    async def set_key(self, key: str, value: str, expire: int = None):
        """
        Устанавливает значение по ключу.
        :param key: ключ
        :param value: значение (строка)
        :param expire: TTL в секундах (опционально)
        """
        if not isinstance(value, str):
            raise ValueError("Value must be a string")
        try:
            if expire:
                await self.redis.setex(key, expire, value)
            else:
                await self.redis.set(key, value)
            logger.info(f"🔑 Установлено значение для ключа '{key}' (expire={expire})")
        except Exception as e:
            logger.error(f"❌ Ошибка при установке ключа {key}: {e}")
            raise

    async def get_key(self, key: str) -> str | None:
        """
        Возвращает значение по ключу. Если ключ не существует — возвращает None.
        """
        try:
            value = await self.redis.get(key)
            if value is not None:
                logger.info(f"🔍 Найдено значение для ключа '{key}': '{value}'")
            else:
                logger.info(f"🔍 Ключ '{key}' не найден")
            return value.decode('utf-8') if value else None
        except Exception as e:
            logger.error(f"❌ Ошибка при получении ключа {key}: {e}")
            raise

    async def delete_key(self, *keys: str) -> int:
        """
        Удаляет один или несколько ключей.
        Возвращает количество удалённых ключей.
        """
        try:
            deleted_count = await self.redis.delete(*keys)
            if deleted_count > 0:
                logger.info(f"💥 Удалено {deleted_count} ключей: {keys}")
            return deleted_count
        except Exception as e:
            logger.error(f"❌ Ошибка при удалении ключей {keys}: {e}")
            raise

    async def key_exists(self, key: str) -> bool:
        """
        Проверяет, существует ли ключ.
        """
        try:
            return await self.redis.exists(key) == 1
        except Exception as e:
            logger.error(f"❌ Ошибка при проверке существования ключа {key}: {e}")
            raise