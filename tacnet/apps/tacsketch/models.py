from django.contrib.auth.models import User
from django.db import models


class Game (models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")

    def str(self):
        return self.name


class GameMode (models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")
    game = models.ForeignKey(Game, verbose_name="Game")

    def str(self):
        return str(self.game) + ", " + str(self.name)


class Map (models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")
    game = models.ForeignKey(Game, verbose_name="Game")
    game_mode = models.ForeignKey(GameMode, verbose_name="Game Mode")
    image = models.ImageField(upload_to="maps", verbose_name="Image")

    def str(self):
        return self.name


class MapRequest (models.Model):
    nickname = models.CharField(max_length=300, verbose_name="Nickname", blank=True)
    game = models.CharField(max_length=300, verbose_name="Game")
    map = models.CharField(max_length=300, verbose_name="Map")
    game_mode = models.CharField(max_length=300, verbose_name="Game Mode", blank=True)
    image_url = models.CharField(max_length=300, verbose_name="Image Link", blank=True)

    def str(self):
        return self.game + ", " + self.map


class TacSave(models.Model):
    name = models.CharField(max_length=200, verbose_name="Name")
    datetime = models.DateTimeField(auto_now=True, verbose_name="DateTime")
    user = models.ForeignKey(User, verbose_name="User")
    game_map = models.ForeignKey(Map, verbose_name="Map")
    fabric_data = models.TextField(verbose_name="Fabric Data")
    lines_data = models.TextField(verbose_name="Lines Data")

    def str(self):
        return self.name + self.user.username

    @classmethod
    def add_object(cls, name, user, game_map, fabric_data, lines_data):
        obj = cls(name=name, game_map=game_map, user=user, fabric_data=fabric_data,
                  lines_data=lines_data)
        obj.save()
        return obj
