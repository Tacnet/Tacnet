from django.shortcuts import render
from django.template import RequestContext
from models import *

def index(request):

    games = Game.objects.all()
    for game in games:
        modes = GameMode.objects.filter(game = game)
        for mode in modes:
            maps = Map.objects.filter(game = game, gameMode = mode)
            setattr(mode, 'maps', maps)
        setattr(game, 'modes', modes)

    return render(request, 'tacsketch/tac.html', {'games': games})