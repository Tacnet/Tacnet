from django.http import Http404
from models import *
from forms import MapRequestForm
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.views.decorators.cache import never_cache

@never_cache
def index(request):

    if request.method == 'POST':
        form = MapRequestForm(request.POST)
        if form.is_valid():
            form.save()
            # return True
            return HttpResponse('True')
        else:
            return HttpResponse('False')

    else:
        form = MapRequestForm
        games = Game.objects.all()
        for game in games:
            modes = GameMode.objects.filter(game = game)
            for mode in modes:
                maps = Map.objects.filter(game = game, gameMode = mode)
                setattr(mode, 'maps', maps)
            setattr(game, 'modes', modes)

    return render(request, 'tacsketch/tac.html', {'games': games, 'MapRequestForm': form})
