from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.http import HttpResponse
from django.core.mail import send_mail
from tacnet.apps.frontpage.forms import FeedbackForm


def index(request):
    return render(request, 'frontpage/index.html')


def about(request):
    return render_to_response(
        "frontpage/about.html",
        context_instance=RequestContext(request)
    )


def thankyou(request):
    return render_to_response(
        "frontpage/thankyou.html",
        context_instance=RequestContext(request)
    )

    
def contact(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']

            message = "Contact Form - User: {email}\nMessage: {message}".format(
                email=email,
                message=message,
            )

            try:
                status = send_mail(
                    subject="Contact Form - User: {email}".format(email=email),
                    message=message,
                    from_email='contact@tacnet.io',
                    recipient_list=['contact@tacnet.io'],
                )

                if status:
                    return HttpResponse('True')
            except:
                pass

    return HttpResponse('False')

