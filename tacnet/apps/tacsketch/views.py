from django.http import Http404
from models import *
from forms import MapRequestForm
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.views.decorators.cache import never_cache
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings

@never_cache
def index(request):

    if request.method == 'POST':
        form = MapRequestForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            message = "Suggested by: {nickname}\nGame: {game}\nGamemode: {gamemode}\nMap: {map}\nURL: {imageurl}".format(
                nickname=form.cleaned_data.get('nickname'),
                game=form.cleaned_data.get('game'),
                gamemode=form.cleaned_data.get('gamemode'),
                map=form.cleaned_data.get('map'),
                imageurl=form.cleaned_data.get('imageurl'),
            )
            send_mail(
                subject="{game} - {map}".format(
                    game=form.cleaned_data.get('game').strip(),
                    map=form.cleaned_data.get('map').strip(),
                ),
                message=message,
                from_email='forms@tacnet.io',
                recipient_list=['forms@tacnet.io',],
            )
            messages.add_message(request, messages.SUCCESS, "We have received your map suggestions. We will consider the suggestion as soon as possible.")
        else:
            messages.add_message(request, messages.ERROR, "Your request is not valid. Fill in all the fields marked * and try again.")
        return redirect('index')
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
