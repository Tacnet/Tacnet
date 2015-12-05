from django.conf.urls import url

from tacnet.apps.tacsketch import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^icons$', views.icons, name="Icons"),
    url(r'^save_tac$', views.save_tac, name="Save Tactic"),
    url(r'^get_tacs$', views.load_tac_list, name="Get Tactics"),
    url(r'^delete_tac$', views.delete_tac, name="Delete Tactics")
]
