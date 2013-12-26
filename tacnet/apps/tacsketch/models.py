from django.db import models
from django.contrib.auth.models import User

class Game (models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")


    def __unicode__(self):
        return self.name


class GameMode (models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")
    game = models.ForeignKey(Game, verbose_name="Game")


    def __unicode__(self):
        return str(self.game) + ", " + self.name


class Map (models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")
    game = models.ForeignKey(Game, verbose_name="Game")
    gameMode = models.ForeignKey(GameMode, verbose_name="Game Mode")
    image = models.ImageField(upload_to="maps", verbose_name="Image")


    def __unicode__(self):
        return self.name


class MapRequest (models.Model):
    nickname = models.CharField(max_length=300, verbose_name="Nickname", blank=True)
    game = models.CharField(max_length=300, verbose_name="Game")
    map = models.CharField(max_length=300, verbose_name="Map")
    gameMode = models.CharField(max_length=300, verbose_name="Game Mode", blank=True)
    imageurl = models.CharField(max_length=300, verbose_name="Image Link", blank=True)

    def __unicode__(self):
        return self.game + ", " + self.map


class TacSave(models.Model):
    name = models.CharField(max_length=200, verbose_name="Name")
    user = models.ForeignKey(User, verbose_name="User")
    gameMap = models.ForeignKey(Map, verbose_name="Map")
    fabricData = models.TextField(verbose_name = "Fabric Data")
    linesData = models.TextField(verbose_name = "Lines Data")