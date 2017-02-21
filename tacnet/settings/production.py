import os

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DATABASE_NAME', 'tacnet'),
        'USER': os.environ.get('DATABASE_USER', 'tacnet'),
        'PASSWORD': os.environ['DATABASE_PASSWORD'],
        'HOST': os.environ['DATABASE_HOST'],
    }
}


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': os.environ['MEMCACHE_HOST'],
        'KEY_PREFIX': '/tacnet'
    }
}

SECRET_KEY = os.environ['SECRET_KEY']

EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_SUBJECT_PREFIX = '[Tacnet] '
SERVER_EMAIL = 'Tacnet <tacnet@tacnet.io>'
DEFAULT_FROM_EMAIL = SERVER_EMAIL

RECAPTCHA_PUBLIC_KEY = os.environ['RECAPTCHA_PUBLIC_KEY']
RECAPTCHA_PRIVATE_KEY = os.environ['RECAPTCHA_PRIVATE_KEY']

RAVEN_CONFIG = {
    'dsn': os.environ['SENTRY_DSN'],
}
