import os
import cv2
import numpy as np
from PIL import Image
import torch
from torchvision.transforms import v2
import logging
from MLProcessorService.minio.minioClient import MinIOManager
from io import BytesIO

# Настройка логирования
logger = logging.getLogger(__name__)


class HistologcalPreparatProcessor:
    def __init__(self, path_to_model: str):
        self._device = "cuda" if torch.cuda.is_available() else "cpu"

        # Проверяем, существует ли файл модели
        if not os.path.exists(path_to_model):
            raise FileNotFoundError(f"Модель не найдена: {path_to_model}")

        try:
            self._model = torch.load(path_to_model, weights_only=False, map_location=self._device).module.eval()
        except Exception as e:
            raise RuntimeError(f"Ошибка при загрузке модели: {e}")

        self._RESIZE = 512
        self._compose = v2.Compose([
            v2.ToTensor(),
            v2.Resize([self._RESIZE, self._RESIZE]),
            v2.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
        ])

    def get_cells_mask(self, image: Image.Image) -> np.ndarray:
        src_image_size = (image.shape[1], image.shape[0])

        try:
            tensor_image = self._compose(image)
        except Exception as e:
            raise ValueError(f"Ошибка при предобработке изображения: {e}")

        with torch.no_grad():
            predict = self._model(tensor_image.unsqueeze(0))

        predict = predict[0].permute([2, 1, 0]).numpy().astype(np.int16)
        predict = cv2.resize(predict.astype(float), src_image_size).astype(np.int16)
        return predict * 255

    def get_preparat_mask(self, image: Image.Image, threshold: int=210) -> np.ndarray:
        _, preparat = cv2.threshold(image, threshold, 255, cv2.THRESH_BINARY_INV)
        return preparat


    def get_ratio(self, image: Image.Image) -> float:
        preparat = self.get_preparat_mask(image)
        cells = self.get_cells_mask(image)

        # Защита от деления на ноль
        if preparat.sum() == 0:
            raise ValueError("Препаратная маска пустая")

        return cells.sum() / preparat.sum()


class Processor:
    def __init__(self):
        self.processor = HistologcalPreparatProcessor('MLProcessorService/processor/model.pt')
    
    async def process(self, message):
        """
        Обработка сообщения.
        :param message: Сообщение.
        """
        logger.info(f"Обработка сообщения: {message}")
        async with MinIOManager() as minio:
            try:
                response = await minio.download_data("svs.bucket", message)
                im = np.load(BytesIO(response))
                # Обрабатываем слайд
                return self.processor.get_cells_mask(im).T

            except Exception as e:
                logger.error(f"Ошибка при обработке слайда '{message}': {e}", exc_info=True)
                raise



