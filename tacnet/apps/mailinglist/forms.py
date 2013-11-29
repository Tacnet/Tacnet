from django.forms import ModelForm
from models import Subscriber

class MailListSubscribeForm(ModelForm):

    class Meta:
        model = Subscriber
        fields = ['mail',]

