from django.conf.urls import *

urlpatterns = patterns('blog',

    url(r'^(?P<id>\w+)', 'views.post', name="Post"),
    url(r'$', 'views.posts', name="Posts"),

)