from fastapi import File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi import APIRouter, Request
import logging
import os
from dotenv import load_dotenv
from ApiService.utils import generate_name
from ApiService.services import MinIOManager, RedisClient, KafkaProducerManager


logger = logging.getLogger(__name__)
load_dotenv()
router = APIRouter(prefix='/media')


@router.post('', tags=['media'])
async def upload_media(request: Request, file: UploadFile = File(...)):

    file_name = generate_name(file)
    try:
        async with MinIOManager() as minio_manager:
            if await minio_manager.upload_data('svs.bucket', file_name, file.file):
                async with KafkaProducerManager() as producer:
                    await producer.send(os.getenv("WRITE_TOPIC"), file_name)
                    await RedisClient().add_to_list(request.cookies.get("user_id"), ''.join(file_name.split('.')[:-1]))
                    await RedisClient().set_key(''.join(file_name.split('.')[:-1]), request.cookies.get("user_id"))
        return JSONResponse(status_code=200, content={'message': file_name})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/{file_id}', tags=['media'])
async def get_media(file_id: str):
    try:
        async with MinIOManager() as minio_manager:
            file = await minio_manager.download_data('svs.bucket', file_id)
            return StreamingResponse(
                file.stream(32 * 1024),  # Чтение файла блоками по 32 КБ
                media_type="application/octet-stream",  # Универсальный тип для бинарных данных
                headers={"Content-Disposition": f"attachment; filename={file_id}"}
            )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete('/{file_name}', tags=['media'])
async def delete_media(file_name: str):
    try:
        async with MinIOManager() as minio_manager:
            await minio_manager.remove_object('svs.bucket', file_name)
        return {"message": f"Файл '{file_name}' успешно удален."}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))