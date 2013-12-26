from django.http import Http404
from models import *
from forms import MapRequestForm
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.views.decorators.cache import never_cache
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
import os
import json

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
                from_email='larek@stud.ntnu.no',
                recipient_list=['larek@stud.ntnu.no',],
            )
            messages.add_message(request, messages.SUCCESS, "We have received your map suggestions. We will consider the suggestion as soon as possible.")
        else:
            messages.add_message(request, messages.ERROR, "Your request is not valid. Fill in all the fields marked * and try again.")
        return redirect('index')
    else:
        form = MapRequestForm
        games = Game.objects.all().order_by('name')
        for game in games:
            modes = GameMode.objects.filter(game = game).order_by('name')
            for mode in modes:
                maps = Map.objects.filter(game = game, gameMode = mode).order_by('name')
                setattr(mode, 'maps', maps)
            setattr(game, 'modes', modes)

    return render(request, 'tacsketch/tac.html', {'games': games, 'MapRequestForm': form})


def icons(request):

    response_data = {}

    if not settings.DEBUG:
        for folder in os.listdir(settings.ICONS_ROOT):
            if os.path.isdir(settings.ICONS_ROOT + "/" + folder):

                image_list = []

                for file in os.listdir(settings.ICONS_ROOT + "/" + folder):
                    if os.path.isfile(settings.ICONS_ROOT + "/" + folder + "/" + file):

                        if file.find("_b.png") != -1 or file.find("_b.jpg") != -1:

                            filename = file
                            thumbnail = file.replace("_b.", "_t.")

                            if request.is_secure():
                                scheme = 'https://'
                            else:
                                scheme = 'http://'
                            start_uri = scheme + request.get_host()
                            containsNumbers = False
                            vocals = "aeiouy"
                            nameList = file[0:len(file)-6].split("_")
                            newNameList = []

                            for name in nameList:
                                for i in name:
                                    if i.isdigit():
                                        containsNumbers = True
                                        break
                                if containsNumbers:
                                    name = name.upper()
                                elif "-" in name:
                                    names = name.split("-")
                                    for i in range(len(names)):
                                        names[i] = names[i].title()
                                    name = "-".join(names)
                                else:
                                    hasVocals = False
                                    for i in name:
                                        if i in vocals:
                                            hasVocals = True
                                            break
                                    if hasVocals:
                                        name = name.title()
                                    else:
                                        name = name.upper()
                                containsNumbers = False
                                newNameList.append(name)

                            name = " ".join(newNameList)

                            image_data = {
                                'name': name,
                                'thumbnail': start_uri + "/icons/" + folder + "/" + thumbnail, 
                                'image': start_uri + "/icons/" + folder + "/" + filename
                            }
                            image_list.append(image_data)


                game_name = folder.replace("_", " ").title()
                response_data[game_name] = image_list


    return HttpResponse(json.dumps(response_data), content_type="application/json")


def save_tac(request):
    if request.method == "POST":
        '''
        user = request.user
        name = request.POST['name']
        gameMap = request.POST['map']
        fabricData = request.POST['fabric']
        linesData = request.POST['lines']'''

        return HttpResponse("asdas")

    else:
        raise Http404


def load_tac(request):
    if request.method == "POST":
        pass
    else:
        raise Http404




