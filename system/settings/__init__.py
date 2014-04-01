from settings import *


try:
    from local import *
except ImportError:
    print """
          Could not import local settings, if you want to set up
          local settings for dev run this:
          $ echo "from development import *" > system/settings/local.py
          """
    raise ImportError

TEMPLATE_DEBUG = DEBUG
THUMBNAIL_DEBUG = DEBUG