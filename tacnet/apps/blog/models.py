from django.db import models
from django.contrib.auth.models import User

class Post (models.Model):
    title = models.CharField(max_length=200, verbose_name="Title")
    postDate = models.DateTimeField(verbose_name="Post date")
    intro = models.TextField(verbose_name="Intro")
    text = models.TextField(verbose_name="Text")
    postImage = models.ImageField(upload_to="blog", verbose_name="Post Image", blank=True, null=True)
    author = models.ForeignKey(User, verbose_name="Author")
