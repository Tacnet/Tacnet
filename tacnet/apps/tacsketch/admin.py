from django.contrib import admin
from models import *


class GameAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Game, GameAdmin)


class GameModeAdmin(admin.ModelAdmin):
    list_display = ('name', 'game',)

admin.site.register(GameMode, GameModeAdmin)


class MapAdmin(admin.ModelAdmin):
    list_display = ('name', 'game', 'gameMode')

admin.site.register(Map, MapAdmin)

class MapRequestAdmin(admin.ModelAdmin):
    list_display = ('email', 'game', 'gameMode', 'map')

admin.site.register(MapRequest, MapRequestAdmin)