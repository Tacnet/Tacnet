from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


#from django.contrib import admin
#admin.autodiscover()

# Custom 404 file
handler404 = 'errors.views.error404'
handler500 = 'errors.views.error500'

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'sylliaas.views.home', name='home'),
    # url(r'^sylliaas/', include('sylliaas.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    (r'^$', 'frontpage.views.index'),
    #(r'^$', 'errors.views.underdevelopment'),

    (r'^frontpage/', include('frontpage.urls')),
    (r'^frontpage/', include('tacsketch.urls'))

)
urlpatterns += staticfiles_urlpatterns()
