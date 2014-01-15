DEBUG = False


with open('/home/tacnet-www/www/passwords/tacnet_db', 'rb') as f:
    db_password = f.readline()


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'tacnet_db',

        'USER': 'tacnet',
        'PASSWORD': db_password.strip(),
        'HOST': 'localhost',
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


with open('/home/tacnet-www/www/passwords/django_secret', 'rb') as f:
    SECRET_KEY_READ = f.readline()
SECRET_KEY = SECRET_KEY_READ


with open('/home/tacnet-www/www/passwords/mail_password', 'rb') as f:
    mail_password = f.readline()
EMAIL_HOST = 'smtp.stud.ntnu.no'
EMAIL_HOST_USER = 'larek'
EMAIL_HOST_PASSWORD = mail_password.strip()
EMAIL_PORT = 587
EMAIL_USE_TLS = True