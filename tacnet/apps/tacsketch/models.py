from django.db import models


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
    email = models.EmailField(verbose_name="User Mail")
    game = models.CharField(max_length=300, verbose_name="Game")
    map = models.CharField(max_length=300, verbose_name="Map")
    gameMode = models.CharField(max_length=300, verbose_name="Game Mode", blank=True)

    def __unicode__(self):
        return self.game + ", " + self.map