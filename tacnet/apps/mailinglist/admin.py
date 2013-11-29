from django.contrib import admin
from mailinglist.models import *

class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('mail', 'received_letters', 'register_date',)

admin.site.register(Subscriber, SubscriberAdmin)


from django.forms import ModelForm
from django.contrib.admin import ModelAdmin
from suit_redactor.widgets import RedactorWidget
from django_object_actions import DjangoObjectActions
from django.contrib.messages import *
from django.core.mail import *
from mailinglist.models import Subscriber

class LetterForm(ModelForm):
    class Meta:
        widgets = {
            'content': RedactorWidget(editor_options={'lang': 'en'})
        }

class LetterAdmin(DjangoObjectActions, ModelAdmin):
    form = LetterForm
    list_display = ('title', 'publish_date',)

    def toolfunc(self, request, obj):
        subscriblers = []
        subscriblers_obj = Subscriber.objects.all()

        for usr in subscriblers_obj:
            subscriblers.append(usr.mail)


        msg = EmailMessage(obj.title + ' - Tacnet.io Newsletter', obj.content, 'no-reply@tacnet.io', [], subscriblers)
        msg.content_subtype = "html"
        msg.send()

        add_message(request, SUCCESS, "The newsletter is sendt!")



    toolfunc.label = "Send This Letter"  # optional
    toolfunc.short_description = "This button sends the letter to all subscribers."

    objectactions = ('toolfunc', )


admin.site.register(Letter, LetterAdmin)