from models import *
from django.contrib import admin
from django.forms import ModelForm
from django.contrib.admin import ModelAdmin
from suit_redactor.widgets import RedactorWidget


class PostForm(ModelForm):
    class Meta:
        widgets = {
            'intro': RedactorWidget(editor_options={'lang': 'en'}),
            'text': RedactorWidget(editor_options={'lang': 'en'})
        }


class PostAdmin(ModelAdmin):
    list_display = ('title', 'postDate', 'intro')
    form = PostForm

    
admin.site.register(Post, PostAdmin)