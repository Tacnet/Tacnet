import os
import sys

from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP
from django.contrib.messages import constants as messages

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Tacnet Admins', 'forms@tacnet.io'),
)

ROOTPATH = os.path.dirname(os.path.dirname(__file__))
makepath = lambda *f: os.path.join(ROOTPATH, *f)


PROJECT_ROOT = ROOTPATH
sys.path.insert(0, os.path.join(PROJECT_ROOT, 'apps'))

MANAGERS = ADMINS


ALLOWED_HOSTS = ['tacnet.io', 'www.tacnet.io']


TIME_ZONE = 'Europe/Oslo'


LANGUAGE_CODE = 'en-us'


SITE_ID = 1


USE_I18N = True


USE_L10N = True


USE_TZ = True


MEDIA_ROOT = makepath('files', 'media')


MEDIA_URL = '/media/'


STATIC_ROOT = makepath('files', 'static')


ICONS_ROOT = makepath('icons')


STATIC_URL = '/static/'

INTERNAL_IPS = ['127.0.0.1', '129.241.208.79']

STATICFILES_DIRS = (
    makepath('apps', 'base', 'static'),
    makepath('apps', 'tacsketch', 'static'),
)


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)


SECRET_KEY = '8e_je_1ie@2$ar+zxvokoy3-5ev@y2$z#w&&s!s2d1c0npa^80'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

ROOT_URLCONF = 'tacnet.settings.urls'

WSGI_APPLICATION = 'tacnet.settings.wsgi.application'

TEMPLATE_DIRS = (
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',

    'tacnet.apps.frontpage',
    'tacnet.apps.base',
    'tacnet.apps.tacsketch',
    'tacnet.apps.errors',
    'tacnet.apps.authentication',

    'django_object_actions',
)

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

TEMPLATE_CONTEXT_PROCESSORS = TCP + [
    'django.core.context_processors.request',
    'base.context_processors.twitter',
]

MESSAGE_TAGS = {
    messages.SUCCESS: 'alert-success',
    messages.INFO: 'alert-info',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}

twitter = ["", "", "", ""]
try:
    with open(ROOTPATH + '/../passwords/twitter', 'rb') as f:
        twitter = f.read().strip().split(',')

except:
    pass

TWITTER_OAUTH = {
    'user': 'ekmartinb',
    'consumer_key': twitter[0],
    'consumer_secret': twitter[1],
    'access_token': twitter[2],
    'access_token_secret': twitter[3]
}
