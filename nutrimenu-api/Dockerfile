FROM python:3.13.3-alpine

WORKDIR /nutrimenu

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .
CMD [ "uvicorn", "main:app", "--port", "80", "--host", "0.0.0.0" ]