import json
import os

from django.conf import settings
from django.contrib import messages
from django.core.cache import cache
from django.core.mail import send_mail
from django.http import Http404, HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.cache import cache_page, never_cache
from django.views.decorators.csrf import csrf_exempt

from tacnet.apps.tacsketch.models import Game, GameMode, Map, TacSave

from .forms import MapRequestForm


@csrf_exempt
@never_cache
def index(request):

    if request.method == 'POST':
        form = MapRequestForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            message_contents = {
                'nickname': form.cleaned_data.get('nickname'),
                'game': form.cleaned_data.get('game'),
                'gamemode': form.cleaned_data.get('gamemode'),
                'map': form.cleaned_data.get('map'),
                'imageurl': form.cleaned_data.get('imageurl'),
            }
            message = "Suggested by: {nickname}\nGame: {game}\nGamemode: {gamemode}\n" \
                      "Map: {map}\nURL: {imageurl}".format(**message_contents)
            send_mail(
                subject="{game} - {map}".format(
                    game=form.cleaned_data.get('game').strip(),
                    map=form.cleaned_data.get('map').strip(),
                ),
                message=message,
                from_email='contact@tacnet.io',
                recipient_list=['contact@tacnet.io', ],
            )
            messages.add_message(request, messages.SUCCESS, "We have received your map "
                                                            "suggestions. We will consider "
                                                            "the suggestion as soon as possible.")
        else:
            messages.add_message(request, messages.ERROR, "Your request is not valid. Fill in "
                                                          "all the fields marked * and try again.")
        return redirect('index')
    else:
        form = MapRequestForm

        games = cache.get('games')
        if not games:
            games = Game.objects.all().order_by('name')
            cache.set('games', games, 60*60*24)

        for game in games:
            modes = GameMode.objects.filter(game=game).order_by('name')
            for mode in modes:
                maps = Map.objects.filter(game=game, gameMode=mode).order_by('name')
                setattr(mode, 'maps', maps)
            setattr(game, 'modes', modes)

    return render(request, 'tacsketch/tac.html', {'games': games, 'MapRequestForm': form})


@cache_page(60*60*24*3)
def icons(request):

    response_data = {}

    if not settings.DEBUG or "test1337" in (request.get_host()):
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
                            contains_numbers = False
                            vocals = "aeiouy"
                            name_list = file[0:len(file)-6].split("_")
                            new_name_list = []

                            for name in name_list:
                                for i in name:
                                    if str(i).isdigit():
                                        contains_numbers = True
                                        break
                                if contains_numbers or \
                                        ("counter" in folder.lower()and len(name) <= 3):
                                    name = name.upper()
                                elif "-" in name:
                                    names = str(name).split('-')
                                    for i in range(len(names)):
                                        names[i] = names[i].title()
                                    name = '-'.join(names)
                                else:
                                    has_vocals = False
                                    for i in name:
                                        if i in vocals:
                                            has_vocals = True
                                            break
                                    if has_vocals:
                                        name = name.title()
                                    else:
                                        name = name.upper()
                                contains_numbers = False
                                new_name_list.append(name)

                            name = " ".join(new_name_list)

                            image_data = {
                                'name': name,
                                'thumbnail': start_uri + "/icons/" + folder + "/" + thumbnail,
                                'image': start_uri + "/icons/" + folder + "/" + filename
                            }
                            image_list.append(image_data)

                game_name = folder.replace("_", " ").title()
                response_data[game_name] = image_list

    return HttpResponse(json.dumps(response_data, sort_keys=True), content_type="application/json")


@csrf_exempt
def save_tac(request):
    if request.method == "POST":
        user = request.user
        name = request.POST['name']
        game_map = request.POST['map']
        fabric_data = request.POST['fabric']
        lines_data = request.POST['lines']

        try:
            map = Map.objects.get(id=int(game_map))
            TacSave.add_object(name, user, map, fabric_data, lines_data)
            return HttpResponse("True")
        except:
            return HttpResponse("False")

    else:
        raise Http404


def load_tac_list(request):
    try:
        response_data = {}

        tacs = TacSave.objects.filter(user=request.user).order_by('datetime')
        for tac in tacs:
            response_data[tac.id] = {
                'id': tac.id,
                'name': tac.name,
                'mapID': tac.gameMap.id,
                'mapURI': str(tac.gameMap.image),
                'mapName': tac.gameMap.name,
                'gameName': tac.gameMap.game.name,
                'datetime': str(tac.datetime),
                'fabric': tac.fabricData,
                'lines': tac.linesData
            }
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    except:
        return HttpResponse("False")


@csrf_exempt
def delete_tac(request):
    try:
        id = request.POST['id']
        obj = TacSave.objects.get(id=id)
        if obj.user == request.user:
            obj.delete()
            return HttpResponse('True')
    except:
        pass

    return HttpResponse('False')
