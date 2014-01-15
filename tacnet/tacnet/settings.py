import os, sys
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


ALLOWED_HOSTS = ['129.241.208.163', 'tacnet.io', 'www.tacnet.io']


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

INTERNAL_IPS = ['127.0.0.1', '129.241.208.163']

STATICFILES_DIRS = (
    makepath('apps', 'base', 'static'),
    makepath('apps', 'tacsketch', 'static'),
)


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)


SECRET_KEY = '8e_je_1ie@2$ar+zxvokoy3-5ev@y2$z#w&&s!s2d1c0npa^80'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    #'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    #'django.middleware.cache.FetchFromCacheMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

ROOT_URLCONF = 'tacnet.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'tacnet.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'south',
    'frontpage',
    'base',
    'gunicorn',
    'tacsketch',
    'errors',
    'blog',
    'mailinglist',
    'authentication',

    # Uncomment the next line to enable the admin:
    'admin',
    'suit',
    'suit_redactor',
    'django.contrib.admin',
    'suit_redactor',
    'django_object_actions',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
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


# Production settings
configs = {
    ROOTPATH: 'settings',
    '/home/tacnet-www/www/tacnet': 'settings-production',
    '/home/tacnet-www/test/tacnet': 'settings-test',
}

config_module = __import__('%s' % configs[ROOTPATH], globals(), locals(), 'tacnet')

# Load the config settings properties into the local scope.
for setting in dir(config_module):
    if setting == setting.upper():
        locals()[setting] = getattr(config_module, setting)



SUIT_CONFIG = {
    # header
     'ADMIN_NAME': 'Tacnet',
    # 'HEADER_DATE_FORMAT': 'l, j. F Y',
    # 'HEADER_TIME_FORMAT': 'H:i',

    # forms
     'SHOW_REQUIRED_ASTERISK': True,  # Default True
     'CONFIRM_UNSAVED_CHANGES': True, # Default True

    # menu
    # 'SEARCH_URL': '/admin/auth/user/',
    # 'MENU_ICONS': {
    #    'sites': 'icon-leaf',
    #    'auth': 'icon-lock',
    # },
    # 'MENU_OPEN_FIRST_CHILD': True, # Default True
    # 'MENU_EXCLUDE': ('auth.group',),
    # 'MENU': (
    #     'sites',
    #     {'app': 'auth', 'icon':'icon-lock', 'models': ('user', 'group')},
    #     {'label': 'Settings', 'icon':'icon-cog', 'models': ('auth.user', 'auth.group')},
    #     {'label': 'Support', 'icon':'icon-question-sign', 'url': '/support/'},
    # ),

    # misc
    # 'LIST_PER_PAGE': 15
}

from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP

TEMPLATE_CONTEXT_PROCESSORS = TCP + (
    'django.core.context_processors.request',
)

# Messages

MESSAGE_TAGS = {
    messages.SUCCESS: 'alert-success',
    messages.INFO: 'alert-info',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}


from django.conf import global_settings
TEMPLATE_CONTEXT_PROCESSORS = global_settings.TEMPLATE_CONTEXT_PROCESSORS + (
    'base.context_processors.Twitter',
)



twitter = ["","","",""]
try:
    with open('/home/tacnet-www/www/passwords/twitter', 'rb') as f:
        twitter = f.readline().split(',')
except:
    pass
TWITTER_OAUTH = {
     'user': 'Reactu',
     'consumer_key': twitter[0],
     'consumer_secret': twitter[1],
     'access_token': twitter[2],
     'access_token_secret': twitter[3]
}