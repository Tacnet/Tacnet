from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.http import HttpResponse
from django.core.mail import send_mail

from blog.models import Post

def index(request):

    posts = Post.objects.all().order_by('postDate').reverse()[:5]

    return render(request, 'frontpage/index.html', {'posts':posts})


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
            else:
                return HttpResponse('False')
        except:
            return HttpResponse('False')
        return HttpResponse('False')

    else:
        return HttpResponse('False')

