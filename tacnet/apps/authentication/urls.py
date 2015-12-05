from django.conf.urls import url

from tacnet.apps.authentication import views

urlpatterns = [
    url(r'^login$', views.login, name="Login"),
    url(r'^status$', views.status, name="AuthStatus"),
    url(r'^logout$', views.logout, name="Logout"),
    url(r'^register$', views.register, name="Register"),
    url(r'^forgotpassword$', views.forgot_password, name="ForgotPassword"),
]
