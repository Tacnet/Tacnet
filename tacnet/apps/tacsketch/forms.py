from django.forms import ModelForm

from .models import MapRequest


class MapRequestForm(ModelForm):

    class Meta:
        model = MapRequest
