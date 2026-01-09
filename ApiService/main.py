import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import asyncio
from ApiService.routes.ws import kafka_listener
from ApiService.utils import generate_id

from ApiService.routes.media import router as media_router
from ApiService.routes.ws import router as ws_router


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Приложение запускается... Запускаем Kafka-слушатель")
    task = asyncio.create_task(kafka_listener())  # Запускаем фоновую задачу
    yield  # Приложение работает
    print("🛑 Приложение останавливается... Останавливаем фоновые задачи")
    task.cancel()  # Останавливаем задачу
    try:
        await task
    except asyncio.CancelledError:
        pass



app = FastAPI(title="Media Storage Microservice", lifespan=lifespan)
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home(request: Request):
    user_id = request.cookies.get("user_id") or generate_id()
    response = templates.TemplateResponse("index.html", {"request": request})
    if "user_id" not in request.cookies:
        response.set_cookie(key="user_id", value=user_id, httponly=True)
    return response


# Подключаем CRUD роутер
app.include_router(media_router, prefix='/api')
app.include_router(ws_router, prefix='/api')


if __name__ == "__main__":
    logger.info("Сервер запущен...")
    import uvicorn
    uvicorn.run('main:app', host="0.0.0.0", port=8000)