from django.db import models
import datetime

class Subscriber(models.Model):
    mail = models.EmailField(verbose_name="E-mail", unique=True)
    received_letters = models.IntegerField(max_length=1000, verbose_name="Received Letters", default=0)
    register_date = models.DateField(verbose_name="Register Date", default=datetime.datetime.today())

    def __unicode__(self):
        return self.mail


class Letter(models.Model):
    title = models.CharField(max_length=200, verbose_name="Title")
    publish_date = models.DateTimeField(verbose_name="Publish Date", default=datetime.datetime.now())
    content = models.TextField(verbose_name="Content")

    def __unicode__(self):
        return self.title
