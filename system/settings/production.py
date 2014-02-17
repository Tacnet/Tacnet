from settings import ROOTPATH
DEBUG = False

with open(ROOTPATH + '/../passwords/database', 'rb') as f:
    db_password = f.readline()


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'tacnet-django',

        'USER': 'tacnet',
        'PASSWORD': db_password.strip(),
        'HOST': 'database.sylliaas.no',
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


with open(ROOTPATH + '/../passwords/mail', 'rb') as f:
    mail_password = f.readline()
EMAIL_HOST = 'smtp.stud.ntnu.no'
EMAIL_HOST_USER = 'larek'
EMAIL_HOST_PASSWORD = mail_password.strip()
EMAIL_PORT = 587
EMAIL_USE_TLS = True