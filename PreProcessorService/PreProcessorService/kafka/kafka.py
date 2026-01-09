
import logging
import os
from typing import Optional, Any
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class KafkaProducerManager:
    """Контекстный менеджер для AIOKafkaProducer"""
    
    def __init__(
        self,
        bootstrap_servers: Optional[str] = None,
        **producer_config: Any
    ):
        # Конфигурация по умолчанию с Production-ready параметрами
        default_config = {
            'acks': 'all',  # Гарантирует запись сообщения на всех репликах
            'request_timeout_ms': 30000,  # Таймаут запроса (30 секунд)
            'value_serializer': lambda v: v.encode('utf-8'),  # Сериализация сообщений в байты
            'retry_backoff_ms': 100,  # Задержка между повторными попытками
        }
        
        self.bootstrap_servers = bootstrap_servers or os.getenv("KAFKA_BROKER")
        # Объединяем дефолтную конфигурацию с пользовательской
        self.producer_config = {**default_config, **producer_config}
        self.producer: Optional[AIOKafkaProducer] = None
    
    async def __aenter__(self) -> AIOKafkaProducer:
        """Инициализация и запуск producer"""
        try:
            self.producer = AIOKafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                **self.producer_config
            )
            await self.producer.start()
            logger.info("AIOKafkaProducer успешно запущен")
            return self.producer
        except Exception as e:
            logger.error(f"Ошибка при запуске producer: {e}")
            raise
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Остановка producer"""
        if self.producer:
            try:
                await self.producer.stop()
                logger.info("AIOKafkaProducer успешно остановлен")
            except Exception as e:
                logger.error(f"Ошибка при остановке producer: {e}")


class KafkaConsumerManager:
    """Контекстный менеджер для AIOKafkaConsumer"""
    
    def __init__(
        self,
        topics: str = None,
        bootstrap_servers: Optional[str] = None,
        group_id: Optional[str] = None,
        **consumer_config: Any
    ):
        # Конфигурация по умолчанию с Production-ready параметрами
        default_config = {
            'auto_offset_reset': 'earliest',  # Начинать чтение с самого раннего сообщения
            'enable_auto_commit': False,  # Отключаем автокоммит для контроля над обработкой
            'max_poll_records': 500,  # Максимальное количество записей за один poll
            'session_timeout_ms': 300000,  # Таймаут сессии (30 секунд)
            'heartbeat_interval_ms': 3000,  # Интервал heartbeat (3 секунды)
            'fetch_max_wait_ms': 500,  # Максимальное время ожидания fetch
            'fetch_min_bytes': 1,  # Минимальный размер данных для возврата
            'fetch_max_bytes': 52428800,  # Максимальный размер данных (50MB)
            'value_deserializer': lambda v: v.decode('utf-8'),  # Десериализация сообщений в байты
        }
        
        # Если топики не указаны, используем переменную окружения
        self.topics = topics if topics else (os.getenv('READ_TOPIC'),)
        self.topics = tuple(filter(None, self.topics))  # Убираем None значения
        
        self.bootstrap_servers = bootstrap_servers or os.getenv("KAFKA_BROKER")
        self.group_id = group_id
        # Объединяем дефолтную конфигурацию с пользовательской
        self.consumer_config = {**default_config, **consumer_config}
        self.consumer: Optional[AIOKafkaConsumer] = None
    
    async def __aenter__(self) -> AIOKafkaConsumer:
        """Инициализация и запуск consumer"""
        if not self.topics:
            raise ValueError("Необходимо указать хотя бы один топик для consumer")
            
        try:
            self.consumer = AIOKafkaConsumer(
                *self.topics,
                bootstrap_servers=self.bootstrap_servers,
                group_id=self.group_id,
                **self.consumer_config
            )
            await self.consumer.start()
            logger.info(f"AIOKafkaConsumer запущен для топиков: {self.topics}")
            return self.consumer
        except Exception as e:
            logger.error(f"Ошибка при запуске consumer: {e}")
            raise
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Остановка consumer"""
        if self.consumer:
            try:
                await self.consumer.stop()
                logger.info("AIOKafkaConsumer успешно остановлен")
            except Exception as e:
                logger.error(f"Ошибка при остановке consumer: {e}")
