from django.shortcuts import render_to_response
from django.template import RequestContext


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
    return render_to_response(
        "frontpage/contact.html",
        context_instance=RequestContext(request)
    )