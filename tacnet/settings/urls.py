from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

from django.contrib import admin

from tacnet.apps.errors.views import error404, error500


admin.autodiscover()

# Custom 404 and 500 file
handler404 = error404
handler500 = error500

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    (r'^$', 'tacnet.apps.frontpage.views.index'),

    (r'^frontpage/', include('tacnet.apps.frontpage.urls')),
    (r'^tacsketch/', include('tacnet.apps.tacsketch.urls')),

    (r'^auth/', include('tacnet.apps.authentication.urls')),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
