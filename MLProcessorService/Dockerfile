FROM python:3.13 as builder
WORKDIR /install
RUN apt-get update && apt-get install -y build-essential \
    git \
    tzdata \ 
    libgl1 \ 
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \  
    && echo $TZ > /etc/timezone
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip wheel --no-deps --wheel-dir /wheels -r requirements.txt

FROM python:3.13
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Europe/Moscow
WORKDIR /app
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-deps --no-index --find-links=/wheels -r requirements.txt
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
COPY . .
CMD ["python", "main.py"]