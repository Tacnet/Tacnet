from django.shortcuts import render


def error404(request):
    return render(request, 'errors/error_404.html')


def error500(request):
    return render(request, 'errors/error_500.html')
