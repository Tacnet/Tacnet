from tacnet.settings.base import ROOTPATH

DEBUG = False

with open(ROOTPATH + '/../passwords/database', 'rb') as f:
    db_password = f.readline()


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'tacnet',
        'USER': 'tacnet',
        'PASSWORD': db_password.strip(),
        'HOST': '127.0.0.1',
        'PORT': '',
    }
}


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
        'KEY_PREFIX': '/tacnet-prod'
    }
}


with open(ROOTPATH + '/../passwords/secret', 'rb') as f:
    SECRET_KEY_READ = f.readline()
SECRET_KEY = SECRET_KEY_READ


EMAIL_HOST = '127.0.0.1'
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_PORT = 25
EMAIL_USE_TLS = False
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_SUBJECT_PREFIX = "[Tacnet] "
SERVER_EMAIL = "Tacnet" + ' <' + "tacnet@tacnet.io" + '>'
DEFAULT_FROM_EMAIL = SERVER_EMAIL
