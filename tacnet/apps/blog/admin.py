from models import *
from django.contrib import admin


class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'postDate', 'intro')

admin.site.register(Post, PostAdmin)