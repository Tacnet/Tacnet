from django.conf.urls import url

from tacnet.apps.frontpage import views

urlpatterns = [
    url(r'^$', views.index, name="index"),

    url(r'^about/$', views.about, name="about"),
    url(r'^contact/$', views.contact, name="contact"),
    url(r'^thankyou/$', views.thankyou, name="thankyou"),

]
