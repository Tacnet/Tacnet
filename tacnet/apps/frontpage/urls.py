from django.conf.urls import *

urlpatterns = patterns('frontpage',
    # url(r'positionlock/(?P<position>\d+)/set/$', 'views.set_position_lock', name="set_position_lock"),
    # url(r'^index/$', 'views.index', name="index"),
    url(r'^$', 'views.index', name="index"),

    url(r'^about/$', 'views.about', name="about"),
    url(r'^contact/$', 'views.contact', name="contact"),

)