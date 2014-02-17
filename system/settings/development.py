from settings import makepath

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': makepath('tacnet.db'),

        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}