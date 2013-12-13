##[Tacnet.io](http://tacnet.io)
Tacnet.io is a work in progress application that allows users to easily share and construct new tactics for games, without installation or annoying ads. 

Tacnet uses [TogetherJS](https://github.com/mozilla/togetherjs) and [Django](https://github.com/django/django).

##Instructions:

    virtualenv venv
    source venv/bin/activate (can also run . venv/bin/activate if source isn't available)
    pip install -r requirements-dev.txt
    python tacnet/manage.py syncdb --migrate
    python tacnet/manage.py runserver 
