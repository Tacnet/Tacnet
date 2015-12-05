from django.core.mail import send_mail
from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, 'frontpage/index.html')


def about(request):
    return render(request, 'frontpage/about.html')


def thankyou(request):
    return render(request, 'frontpage/thankyou.html')


def contact(request):
    if request.method == 'POST':
        email = request.POST['email']
        message = request.POST['message']

        message = "Contact Form - User: {email}\nMessage: {message}".format(
            email=email,
            message=message,
        )

        try:

            status = send_mail(
                subject="Contact Form - User: {email}".format(
                    email=email,
                ),
                message=message,
                from_email='contact@tacnet.io',
                recipient_list=['contact@tacnet.io', ],
            )

            if status:
                return HttpResponse('True')
            else:
                return HttpResponse('False')
        except:
            return HttpResponse('False')

    else:
        return HttpResponse('False')
