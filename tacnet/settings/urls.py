from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

from tacnet.apps.frontpage.views import index

admin.autodiscover()


handler404 = 'tacnet.apps.errors.views.error404'
handler500 = 'tacnet.apps.errors.views.error500'

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', index),

    url(r'^frontpage/', include('tacnet.apps.frontpage.urls')),
    url(r'^tacsketch/', include('tacnet.apps.tacsketch.urls')),

    url(r'^auth/', include('tacnet.apps.authentication.urls')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
