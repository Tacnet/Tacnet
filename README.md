##[Tacnet.io](http://tacnet.io) [![Build status](https://ci.frigg.io/badges/Tacnet/Tacnet/)](https://ci.frigg.io/Tacnet/Tacnet/last/) [![Build coverage](https://ci.frigg.io/badges/coverage/Tacnet/Tacnet/)](https://ci.frigg.io/Tacnet/Tacnet/last/)
> Tacnet.io is a application that allows users to easily share and construct new tactics for games, without installation or annoying ads. 

Tacnet uses [TogetherJS](https://github.com/mozilla/togetherjs) and [Django](https://github.com/django/django).


##Instructions:

    virtualenv venv -p python3
    source venv/bin/activate (can also run . venv/bin/activate if source isn't available)
    pip install -r requirements/base.txt
    python tacnet/manage.py migrate
    python tacnet/manage.py collectstatic
    python tacnet/manage.py runserver 
