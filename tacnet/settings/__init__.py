import os
from settings import *


if os.environ.get('ENV_CONFIG') in ['1', 'True', 'true']:
    from production import *  # noqa
else:
    try:
        from local import *
    except ImportError:
        print """
            Could not import local settings, if you want to set up
            local settings for dev run this:
            $ echo "from development import *" > tacnet/settings/local.py
            """
        raise ImportError

TEMPLATE_DEBUG = DEBUG
THUMBNAIL_DEBUG = DEBUG
