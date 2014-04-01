from django.shortcuts import render, redirect
from django.contrib.auth.decorators import permission_required
from django.contrib import messages
from datetime import datetime

from models import Post


def post(request, id):

    posts = Post.objects.all().order_by('postDate').reverse()
    for p in posts:
       if str(p.id) == id:
            return render(request, 'blog/post.html', {'post': p})

    return render(request, 'blog/posts.html', {'posts':posts})


def posts(request):
     posts = Post.objects.all().order_by('postDate').reverse()
     return render(request, 'blog/posts.html', {'posts':posts})