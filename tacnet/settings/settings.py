import os
from django.contrib.messages import constants as messages

DEBUG = True
TEMPLATE_DEBUG = DEBUG


ADMINS = (
    ('Tacnet Admins', 'forms@tacnet.io'),
)
MANAGERS = ADMINS

ROOTPATH = os.path.dirname(os.path.dirname(__file__))
makepath = lambda *f: os.path.join(ROOTPATH, *f)
PROJECT_ROOT = ROOTPATH

ALLOWED_HOSTS = ['*']

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

INTERNAL_IPS = ['127.0.0.1']

STATICFILES_DIRS = (
    makepath('apps', 'base', 'static'),
    makepath('apps', 'tacsketch', 'static'),
    ('icons', makepath('icons'))
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
SECRET_KEY = 'secret'

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
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

ROOT_URLCONF = 'tacnet.settings.urls'

WSGI_APPLICATION = 'tacnet.settings.wsgi.application'

TEMPLATE_DIRS = ()

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'tacnet.apps.frontpage',
    'tacnet.apps.base',
    'tacnet.apps.tacsketch',
    'tacnet.apps.errors',
    'tacnet.apps.authentication',

    'south',

    'tacnet.apps.admin',
    'suit',
    'suit_redactor',
    'django.contrib.admin',
    'captcha',
    'crispy_forms',
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

    },
    'loggers': {
        'django.request': {
            'handlers': [],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

SUIT_CONFIG = {
     'ADMIN_NAME': 'Tacnet',
     'SHOW_REQUIRED_ASTERISK': True,
     'CONFIRM_UNSAVED_CHANGES': True,
}

from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP
TEMPLATE_CONTEXT_PROCESSORS = TCP + (
    'django.core.context_processors.request',
    'tacnet.apps.frontpage.context_processors.feedbackForm'
)

MESSAGE_TAGS = {
    messages.SUCCESS: 'alert-success',
    messages.INFO: 'alert-info',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}

NOCAPTCHA = True

CRISPY_TEMPLATE_PACK = 'bootstrap3'
