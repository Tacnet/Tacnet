FROM python:2.7

MAINTAINER Tacnet Team <contact@tacnet.io>

ENV PYTHONPATH /app/
ENV PYTHONUNBUFFERED 1
ENV PORT 8000
ENV ENV_CONFIG 1

RUN mkdir -p /app
COPY . /app/
WORKDIR /app

RUN set -e \
    && pip install --no-cache -r requirements.txt \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN set -e \
    && echo 'SECRET_KEY="secret"' > tacnet/settings/local.py \
    && ENV_CONFIG=0 python manage.py collectstatic --noinput

ENTRYPOINT ["uwsgi", "--ini", "tacnet.ini"]
