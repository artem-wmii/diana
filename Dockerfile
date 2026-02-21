FROM python:3.11.0

EXPOSE 5012
WORKDIR /app

COPY flask_demo/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY flask_demo/ .

CMD python migrations/migrations.py && \
    gunicorn -b 0.0.0.0:5012 app:app --workers 2 --threads 4 --timeout 120
