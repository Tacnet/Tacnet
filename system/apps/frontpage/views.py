from django.shortcuts import render_to_response, render, redirect
from django.template import RequestContext
from django.http import HttpResponse
from django.core.mail import send_mail
from mailinglist.forms import MailListSubscribeForm
from django.contrib.messages import *
import datetime
from blog.models import Post

def index(request):

    posts = Post.objects.all().order_by('postDate').reverse()[:5]

    if request.method == 'POST':
        form = MailListSubscribeForm(request.POST)
        if form.is_valid():
            form.save()
            add_message(request, INFO, 'Your email address was added to the mailing list.')
            return redirect(index)
        else:
            add_message(request, ERROR, 'Could not add the email to mailing list.')
            return redirect(index)
    else:
        form = MailListSubscribeForm

    return render(request, 'frontpage/index.html', {'posts':posts, 'form':form,})


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
            else:
                return HttpResponse('False')
        except:
            return HttpResponse('False')

    else:
        return HttpResponse('False')

