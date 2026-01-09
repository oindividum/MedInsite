import io
import os
from dotenv import load_dotenv
import asyncio
import logging
import numpy as np
from PreProcessorService.minio.minioClient import MinIOManager
from PreProcessorService.kafka.kafka import KafkaProducerManager, KafkaConsumerManager
from PreProcessorService.processor.processor import Processor

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

async def save_array(res, name: str):
    """
    Сохраняет numpy-массив в MinIO и отправляет имя файла в Kafka.

    :param res: numpy.ndarray
    :param name: Имя файла (включая расширение)
    """
    try:
        # Сериализуем массив
        buffer = io.BytesIO()
        np.save(buffer, res, allow_pickle=False)
        buffer.seek(0)

        async with MinIOManager() as minio:
            await minio.create_bucket("svs.bucket")
            await minio.upload_data("svs.bucket", name, buffer)
        return True
    except Exception as e:
        logger.error(f"❌ Ошибка при сохранении массива '{name}': {e}", exc_info=True)
        return False
    finally:
        if buffer:
            buffer.close()

async def run():
    try:
        while True:
            async with KafkaConsumerManager(group_id='processor_group') as consumer:
                async for message in consumer:
                    logger.info(f"Получено сообщение: {message} -- {message.value}")

                    result = await Processor().process(message.value)
                    if result is None:
                        logger.info("Нет данных для обработки.")
                        return

                    for (res, (x, y)) in result:
                        # Генерация безопасного имени файла
                        file_name = f"{x}_{y}_{''.join(message.value.split('.')[:-1])}.npy"

                        if await save_array(res, file_name):
                            logger.info(f"✅ Файл '{file_name}' успешно сохранён.")
        
                            async with KafkaProducerManager() as producer:
                                await producer.send(os.getenv('WRITE_TOPIC'), file_name)
                await consumer.commit()
            await asyncio.sleep(1)

    except KeyboardInterrupt:
        logger.info("Получен сигнал остановки (Ctrl+C)...")

    except Exception as e:
        logger.error(f"Неожиданная ошибка в основном цикле: {e}", exc_info=True)
