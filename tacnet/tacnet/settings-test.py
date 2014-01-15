with open('/home/tacnet-www/www/passwords/tacnet_db', 'rb') as f:
    db_password = f.readline()


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'tacnet_db_test',

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
        'KEY_PREFIX': '/tacnet-test'
    }
}