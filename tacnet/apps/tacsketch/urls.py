from django.conf.urls import *

urlpatterns = patterns('tacsketch',
    # url(r'positionlock/(?P<position>\d+)/set/$', 'views.set_position_lock', name="set_position_lock"),
    # url(r'^index/$', 'views.index', name="index"),
    url(r'^$', 'views.index', name="index"),
    url(r'^icons$', 'views.icons', name="Icons"),
)