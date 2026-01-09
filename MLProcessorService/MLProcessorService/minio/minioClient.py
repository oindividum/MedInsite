import asyncio
import logging
import os
from typing import Optional, Dict, Any, BinaryIO, Union
import io

from minio import Minio
from minio.error import S3Error
from urllib3.poolmanager import PoolManager


logger = logging.getLogger(__name__)


class MinIOManager:
    """Контекстный менеджер для MinIO клиента"""
    
    def __init__(
        self,
        endpoint: Optional[str] = None,
        access_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        secure: bool = False,
        region: Optional[str] = None,
        http_client: Optional[PoolManager] = None,
        **client_config: Any
    ):
        """
        Инициализация MinIO менеджера
        
        Args:
            endpoint: MinIO server endpoint (по умолчанию из MINIO_ENDPOINT)
            access_key: Access key (по умолчанию из MINIO_ACCESS_KEY)
            secret_key: Secret key (по умолчанию из MINIO_SECRET_KEY)
            secure: Использовать HTTPS (по умолчанию из MINIO_SECURE)
            region: Регион (по умолчанию из MINIO_REGION)
        """
        self.endpoint = endpoint or os.getenv("MINIO_ENDPOINT", "localhost:9000")
        self.access_key = access_key or os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = secret_key or os.getenv("MINIO_SECRET_KEY", "minioadmin")
        self.secure = secure or os.getenv("MINIO_SECURE", "false").lower() == "true"
        self.region = region or os.getenv("MINIO_REGION")
        self.http_client = http_client
        self.client_config = client_config
        
        self.client: Optional[Minio] = None
    
    async def __aenter__(self) -> 'MinIOManager':
        """Инициализация MinIO клиента"""
        try:
            self.client = Minio(
                endpoint=self.endpoint,
                access_key=self.access_key,
                secret_key=self.secret_key,
                secure=self.secure,
                region=self.region,
                http_client=self.http_client,
                **self.client_config
            )
            
            # Проверяем подключение
            await self._check_connection()
            logger.info(f"MinIO клиент успешно подключен к {self.endpoint}")
            return self
        except Exception as e:
            logger.error(f"Ошибка при подключении к MinIO: {e}")
            raise
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Очистка ресурсов"""
        if self.client and hasattr(self.client, '_http'):
            try:
                # Закрываем HTTP соединения
                if hasattr(self.client._http, 'clear'):
                    self.client._http.clear()
                logger.info("MinIO клиент успешно отключен")
            except Exception as e:
                logger.error(f"Ошибка при отключении MinIO клиента: {e}")
    
    async def _check_connection(self):
        """Проверка подключения к MinIO"""
        try:
            # Выполняем простую операцию для проверки подключения
            await asyncio.get_event_loop().run_in_executor(
                None, list, self.client.list_buckets()
            )
        except Exception as e:
            raise ConnectionError(f"Не удалось подключиться к MinIO: {e}")
    
    # Основные операции с bucket'ами
    async def create_bucket(self, bucket_name: str, location: Optional[str] = None) -> bool:
        """Создание bucket'а"""
        try:
            exists = await self.bucket_exists(bucket_name)
            if exists:
                logger.info(f"Bucket '{bucket_name}' уже существует")
                return True
                
            await asyncio.get_event_loop().run_in_executor(
                None, self.client.make_bucket, bucket_name, location or self.region
            )
            logger.info(f"Bucket '{bucket_name}' успешно создан")
            return True
        except S3Error as e:
            logger.error(f"Ошибка при создании bucket '{bucket_name}': {e}")
            return False
    
    async def bucket_exists(self, bucket_name: str) -> bool:
        """Проверка существования bucket'а"""
        try:
            result = await asyncio.get_event_loop().run_in_executor(
                None, self.client.bucket_exists, bucket_name
            )
            return result
        except Exception as e:
            logger.error(f"Ошибка при проверке существования bucket '{bucket_name}': {e}")
            return False
        

    async def upload_data(
        self,
        bucket_name: str,
        object_name: str,
        data: Union[bytes, str, BinaryIO],
        content_type: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None
    ) -> bool:
        """Загрузка данных в MinIO"""
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            
            if isinstance(data, bytes):
                data = io.BytesIO(data)
            
            # Получаем размер данных
            if hasattr(data, 'seek') and hasattr(data, 'tell'):
                data.seek(0, 2)  # Перемещаемся в конец
                length = data.tell()
                data.seek(0)  # Возвращаемся в начало
            else:
                length = len(data)
            
            await asyncio.get_event_loop().run_in_executor(
                None,
                self.client.put_object,
                bucket_name,
                object_name,
                data,
                length,
                content_type,
                metadata
            )
            logger.info(f"Данные загружены как '{object_name}' в bucket '{bucket_name}'")
            return True
        except Exception as e:
            logger.error(f"Ошибка при загрузке данных: {e}")
            return False
    
    async def download_data(self, bucket_name: str, object_name: str) -> Optional[bytes]:
        """Скачивание данных из MinIO"""
        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None, self.client.get_object, bucket_name, object_name
            )
            data = response.read()
            response.close()
            response.release_conn()
            logger.info(f"Данные объекта '{object_name}' успешно получены")
            return data
        except Exception as e:
            logger.error(f"Ошибка при получении данных: {e}")
            return None

    async def remove_object(self, bucket_name: str, object_name: str) -> bool:
        """Удаление объекта"""
        try:
            await asyncio.get_event_loop().run_in_executor(
                None, self.client.remove_object, bucket_name, object_name
            )
            logger.info(f"Объект '{object_name}' удален из bucket '{bucket_name}'")
            return True
        except Exception as e:
            logger.error(f"Ошибка при удалении объекта: {e}")
            return False
