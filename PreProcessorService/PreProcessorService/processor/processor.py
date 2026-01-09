from tiffslide import TiffSlide
from PreProcessorService.minio.minioClient import MinIOManager
import asyncio
import concurrent.futures
from functools import partial
import multiprocessing
import logging
import os
import tempfile
from typing import List, Tuple

# Настройка логирования
logger = logging.getLogger(__name__)


class Processor:
    def __init__(self, chunk_size: int = 512) -> None:
        """
        Инициализация процессора слайдов.
        :param chunk_size: Размер блока для обработки (по умолчанию 2048x2048).
        """
        self.chunk_size = chunk_size

    def _process_slide_region(self, slide_path: str, x: int, y: int, width: int, height: int):
        """
        Обработка региона слайда.
        :param slide_path: Путь к слайду.
        :param x: Координата X региона.
        :param y: Координата Y региона.
        :param width: Ширина слайда.
        :param height: Высота слайда.
        :return: Обработанный регион.
        """
        slide = TiffSlide(slide_path)  # Открываем слайд
        region_width = min(self.chunk_size, width - x)
        region_height = min(self.chunk_size, height - y)
        region = slide.read_region((x, y), 0, (region_width, region_height), as_array=True)

        return region, (x, y)


    async def _split_media_parallel(self, slide_path: str) -> list[str]:
        """
        Параллельная обработка слайдов.
        :param slide_paths: Список путей к слайдам.
        :return: Список обработанных регионов.
        """
        slide = TiffSlide(slide_path)
        width, height = slide.level_dimensions[0]

        tasks = []
        regions = [(x, y) for y in range(0, height, self.chunk_size) for x in range(0, width, self.chunk_size)]
        process_func = partial(self._process_slide_region, slide_path, width=width, height=height)

        with concurrent.futures.ProcessPoolExecutor(max_workers=max(1, multiprocessing.cpu_count() - 1)) as executor:
            loop = asyncio.get_event_loop()
            tasks.extend([loop.run_in_executor(executor, process_func, x, y) for x, y in regions])

        return await asyncio.gather(*tasks)

    async def process(self, message: str) -> List[Tuple]:
        """
        Основной метод обработки: скачивает файл из MinIO, разбивает на чанки.
        :param message: Имя файла в MinIO.
        :return: Список кортежей: (чанк, (x, y))
        """
        logger.info(f"Обработка сообщения: {message}")
        temp_file_path = None
        async with MinIOManager() as minio:
            try:
               
                response = await minio.download_data("svs.bucket", message)
                
                with tempfile.NamedTemporaryFile(suffix='.svs', delete=False) as tmp:
                    tmp.write(response)
                    temp_file_path = tmp.name

                logger.debug(f"Файл сохранён во временный файл: {temp_file_path}")

                # Обрабатываем слайд
                result = await self._split_media_parallel(temp_file_path)
                logger.info(f"Слайд '{message}' разбит на {len(result)} чанков.")
                return result

            except Exception as e:
                logger.error(f"Ошибка при обработке слайда '{message}': {e}", exc_info=True)
                raise

            finally:
                # Удаляем временный файл
                if temp_file_path and os.path.exists(temp_file_path):
                    try:
                        os.remove(temp_file_path)
                        logger.debug(f"Временный файл удалён: {temp_file_path}")
                    except Exception as e:
                        logger.warning(f"Не удалось удалить временный файл {temp_file_path}: {e}")
