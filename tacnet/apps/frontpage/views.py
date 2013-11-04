from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.core.mail import send_mail


def index(request):
    return render_to_response(
        "frontpage/index.html",
        context_instance=RequestContext(request)
    )


def about(request):
    return render_to_response(
        "frontpage/about.html",
        context_instance=RequestContext(request)
    )

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
                from_email='larek@stud.ntnu.no',
                recipient_list=['larek@stud.ntnu.no',],
            )

            if status:
                return HttpResponse('True')
        except:
            pass
        return HttpResponse('False')

    else:
        return HttpResponse('False')

