import os, sys

ROOTPATH = os.path.dirname(os.path.dirname(__file__))

configs = {
    ROOTPATH: 'settings',
    '/home/tacnet-www/test/tacnet': 'settings',
}

config_module = __import__('%s' % configs[ROOTPATH], globals(), locals(), 'tacnet')

# Load the config settings properties into the local scope.
for setting in dir(config_module):
    if setting == setting.upper():
        locals()[setting] = getattr(config_module, setting)


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