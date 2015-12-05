from tacnet.settings.base import *  # noqa

try:
    from .local import *  # noqa
except ImportError:
    print("""
          Could not import local settings, if you want to set up
          local settings for dev run this:
          $ echo "from .development import *" > tacnet/settings/local.py
          """)
    raise ImportError
