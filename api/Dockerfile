FROM python:3.13.3-alpine

WORKDIR /nutrimenu-ai

COPY ./requirements.txt requirements.txt

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . api

CMD [ "fastapi", "run", "api/main.py", "--port", "80", "--host", "0.0.0.0" ]