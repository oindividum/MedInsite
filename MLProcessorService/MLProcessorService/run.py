import asyncio
import logging
from PIL import Image
from dotenv import load_dotenv
import os
import io
from MLProcessorService.minio.minioClient import MinIOManager
from MLProcessorService.processor.processor import Processor
from MLProcessorService.kafka.kafka import KafkaConsumerManager, KafkaProducerManager

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

async def save_image(result, name: str):
    """
    Сохраняет numpy-массив в MinIO и отправляет имя файла в Kafka.

    :param res: numpy.ndarray
    :param name: Имя файла (включая расширение)
    """
    try:
        # Сериализуем массив
        image = Image.fromarray(result)
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
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
            async with KafkaConsumerManager(group_id='mlprocessor_group') as consumer:
                async for message in consumer:
                    logger.info(f"Получено сообщение: {message} -- {message.value}")

                    result = await Processor().process(message.value)
                    if result is None:
                        logger.info("Нет данных для обработки.")
                        return
                    # Генерация безопасного имени файла
                    file_name = f'{''.join(message.value.split('.')[:-1])}.png'

                    if await save_image(result, file_name):
                        logger.info(f"✅ Файл '{file_name}' успешно сохранён.")
    
                        async with KafkaProducerManager() as producer:
                            await producer.send(os.getenv('WRITE_TOPIC'), file_name)
                await consumer.commit()
            await asyncio.sleep(1)

    except KeyboardInterrupt:
        logger.info("Получен сигнал остановки (Ctrl+C)...")

    except Exception as e:
        logger.error(f"Неожиданная ошибка в основном цикле: {e}", exc_info=True)
