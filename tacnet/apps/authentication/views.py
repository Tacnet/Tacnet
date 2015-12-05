import random
import string

from django.contrib.auth import login as user_login
from django.contrib.auth import logout as user_logout
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.http import HttpResponse


def login(request):
    if request.method == "POST":
        try:
            username = request.POST['username']
            password = request.POST['password']

            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    user_login(request, user)
                    return HttpResponse(True)

        except:
            pass

    return HttpResponse(False)


def status(request):
    if request.user.is_authenticated():
        return HttpResponse(request.user.username)
    else:
        return HttpResponse(False)


def logout(request):
    try:
        user_logout(request)
        return HttpResponse(True)
    except:
        return HttpResponse(False)


def register(request):
    if request.user.is_authenticated():
        return HttpResponse(False)

    if request.method == "POST":
        username = request.POST['register-username']
        mail = request.POST['register-mail']

        password = request.POST['register-password']
        retypepassword = request.POST['register-retypepassword']

        if username == "" or \
           password == "" or \
           retypepassword == "" or \
           password != retypepassword:
            return HttpResponse(False)

        try:
            if mail == "":
                mail = "None@none.com"
            user = User.objects.create_user(username, mail, password)
            user.is_active = True
            user.save()
            return HttpResponse(True)
        except:
            pass

    return HttpResponse(False)


def forgot_password(request):
    if request.user.is_authenticated():
        return HttpResponse(False)

    if request.method == 'POST':
        try:
            mail = request.POST['forgot-mail']
            if mail == "None@none.com":

                return HttpResponse(False)

            current_user = User.objects.get(email=mail)

            newpw = ""''.join(random.choice(string.ascii_uppercase + string.digits)
                              for x in range(8))

            current_user.set_password(newpw)

            html_content = "<h3>User Restore</h3>" \
                           "<p>New password: " + newpw + "</p>"

            msg = EmailMessage('[' + 'Tacnet.io' + '] User Restore',
                               html_content, 'no-reply@tacnet.io', [current_user.email])
            msg.content_subtype = "html"

            msg.send()

            return HttpResponse(True)

        except:
            return HttpResponse(False)
