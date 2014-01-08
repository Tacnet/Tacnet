DEBUG = True

with open('/home/tacnet-www/www/passwords/tacnet_db', 'rb') as f:
    db_password = f.readline()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'tacnet_db',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'tacnet',
        'PASSWORD': db_password.strip(),
        'HOST': 'localhost',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

'''
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
'''

with open('/home/tacnet-www/www/passwords/mail_password', 'rb') as f:
    mail_password = f.readline()

EMAIL_HOST = 'smtp.stud.ntnu.no'
EMAIL_HOST_USER = 'larek'
EMAIL_HOST_PASSWORD = mail_password.strip()
EMAIL_PORT = 587
EMAIL_USE_TLS = True