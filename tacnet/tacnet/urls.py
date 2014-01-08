from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

# Custom 404 and 500 file
handler404 = 'errors.views.error404'
handler500 = 'errors.views.error500'

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    (r'^$', 'frontpage.views.index'),

    (r'^frontpage/', include('frontpage.urls')),
    (r'^blog/', include('blog.urls')),
    (r'^tacsketch/', include('tacsketch.urls')),

    (r'^auth/', include('authentication.urls')),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
