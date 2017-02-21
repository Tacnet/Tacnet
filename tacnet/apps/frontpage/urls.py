from django.conf.urls import *

urlpatterns = patterns('tacnet.apps.frontpage',
    url(r'^$', 'views.index', name='index'),
    url(r'^about/$', 'views.about', name='about'),
    url(r'^contact/$', 'views.contact', name='contact'),
    url(r'^thankyou/$', 'views.thankyou', name='thankyou'),
)
